import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Fingerprint,
  Warning,
  SpinnerGap,
  Camera,
  Trash,
  Key,
  ShieldCheck
} from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/AuthContext'
import { DataTable } from '@/components/shared/DataTable'
import { OperationalState } from '@/components/shared/OperationalState'
import { getApiError } from '@/lib/api/client'
import {
  listBiometricConsents,
  grantBiometricConsent,
  revokeBiometricConsent,
  enrollBiometricProfile,
  listStations,
  createStation,
  revokeStation,
  listStationCameras,
  createStationCamera,
  createStationActivationCode
} from './api'

export function BiometricAdminPage() {
  const { user } = useAuth()
  const client = useQueryClient()

  // 1. Permission check
  const canManageDevices = user?.roles.includes('superadmin') || user?.permissions.includes('gestionar_dispositivos')

  // Tabs state: 'consents' | 'enrollment' | 'stations'
  const [activeTab, setActiveTab] = useState<'consents' | 'enrollment' | 'stations'>('consents')

  // Shared Query Cache invalidation helper
  const invalidate = async (key: string) => client.invalidateQueries({ queryKey: [key] })

  // Queries
  const consentsQuery = useQuery({ queryKey: ['consents'], queryFn: listBiometricConsents })
  const stationsQuery = useQuery({ queryKey: ['stations'], queryFn: listStations })

  // --- TAB 1: Consents state & mutations ---
  const [consentStudentId, setConsentStudentId] = useState('')
  const [legalBasis, setLegalBasis] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [consentMessage, setConsentMessage] = useState('')
  const [consentError, setConsentError] = useState('')
  const [revocationConsentId, setRevocationConsentId] = useState<string | null>(null)
  const [revocationReason, setRevocationReason] = useState('')

  const grantConsentMutation = useMutation({
    mutationFn: grantBiometricConsent,
    onSuccess: async () => {
      setConsentStudentId('')
      setLegalBasis('')
      setExpiresAt('')
      setConsentMessage('Consentimiento biométrico otorgado con éxito.')
      setConsentError('')
      await invalidate('consents')
    },
    onError: (err) => {
      setConsentMessage('')
      setConsentError(getApiError(err).message)
    }
  })

  const revokeConsentMutation = useMutation({
    mutationFn: ({ consentId, reason }: { consentId: string; reason: string }) =>
      revokeBiometricConsent(consentId, reason),
    onSuccess: async () => {
      setRevocationConsentId(null)
      setRevocationReason('')
      await invalidate('consents')
    }
  })

  // --- TAB 2: Guided Enrollment state & mutations ---
  const [enrollStudentId, setEnrollStudentId] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [cameraActive, setCameraActive] = useState(false)
  const [enrollMessage, setEnrollMessage] = useState('')
  const [enrollError, setEnrollError] = useState('')
  const [isEnrolling, setIsEnrolling] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Find active consent for target student
  const activeConsent = consentsQuery.data?.data.find(
    (c) =>
      c.student_id.toLowerCase() === enrollStudentId.trim().toLowerCase() &&
      c.status === 'active'
  )

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviews])

  // Camera control
  const startCamera = async () => {
    try {
      setCameraActive(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error starting camera stream:', err)
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && images.length < 5) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth || 640
      canvas.height = videoRef.current.videoHeight || 480
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
            const url = URL.createObjectURL(file)
            setImages((prev) => [...prev, file])
            setImagePreviews((prev) => [...prev, url])
          }
        }, 'image/jpeg')
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const allowedCount = 5 - images.length
      const addedFiles = filesArray.slice(0, allowedCount)

      const addedPreviews = addedFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...addedFiles])
      setImagePreviews((prev) => [...prev, ...addedPreviews])
    }
  }

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const enrollProfileMutation = useMutation({
    mutationFn: ({ studentId, consentId }: { studentId: string; consentId: string }) =>
      enrollBiometricProfile(studentId, consentId, images),
    onMutate: () => {
      setIsEnrolling(true)
      setEnrollMessage('')
      setEnrollError('')
    },
    onSuccess: async () => {
      setImages([])
      setImagePreviews([])
      setEnrollStudentId('')
      setEnrollMessage('Perfil facial enrolado con éxito.')
      setEnrollError('')
      setIsEnrolling(false)
      stopCamera()
    },
    onError: (err) => {
      setEnrollMessage('')
      setEnrollError(getApiError(err).message)
      setIsEnrolling(false)
    }
  })

  // --- TAB 3: Devices & Stations state & mutations ---
  const [stationName, setStationName] = useState('')
  const [stationLocation, setStationLocation] = useState('')
  const [stationMode, setStationMode] = useState<'entry' | 'exit' | 'mixed'>('mixed')
  const [stationMessage, setStationMessage] = useState('')
  const [stationError, setStationError] = useState('')

  const [revocationStationId, setRevocationStationId] = useState<string | null>(null)
  const [stationRevokeReason, setStationRevokeReason] = useState('')

  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [cameraLabel, setCameraLabel] = useState('')
  const [cameraIdentifier, setCameraIdentifier] = useState('')



  const [activationCodeInfo, setActivationCodeInfo] = useState<{ code: string; stationId: string } | null>(null)

  // Sub-query for selected station cameras
  const camerasQuery = useQuery({
    queryKey: ['cameras', selectedStationId],
    queryFn: () => listStationCameras(selectedStationId!),
    enabled: !!selectedStationId
  })

  const createStationMutation = useMutation({
    mutationFn: createStation,
    onSuccess: async () => {
      setStationName('')
      setStationLocation('')
      setStationMode('mixed')
      setStationMessage('Estación de asistencia registrada.')
      setStationError('')
      await invalidate('stations')
    },
    onError: (err) => {
      setStationMessage('')
      setStationError(getApiError(err).message)
    }
  })

  const revokeStationMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => revokeStation(id, reason),
    onSuccess: async () => {
      setRevocationStationId(null)
      setStationRevokeReason('')
      await invalidate('stations')
    }
  })

  const createCameraMutation = useMutation({
    mutationFn: ({ stationId, label, identifier }: { stationId: string; label: string; identifier: string }) =>
      createStationCamera(stationId, { label, device_identifier: identifier, active: true }),
    onSuccess: async () => {
      setCameraLabel('')
      setCameraIdentifier('')
      await invalidate('cameras')
    }
  })

  const generateActivationMutation = useMutation({
    mutationFn: createStationActivationCode,
    onSuccess: (data, stationId) => {
      setActivationCodeInfo({ code: data.activation_code, stationId })
    }
  })

  // Permisos de UI generales
  if (!canManageDevices) {
    return (
      <OperationalState
        state="forbidden"
        title="Acceso Denegado"
        message="Su cuenta no tiene los permisos necesarios (gestionar_dispositivos) para administrar la infraestructura biométrica."
      />
    )
  }

  return (
    <section className="page-stack">
      <header>
        <p className="eyebrow">Seguridad e Infraestructura</p>
        <h1>Biometría y Dispositivos</h1>
        <p>Administra el consentimiento, enrola rostros de alumnos y autoriza estaciones de asistencia de forma segura.</p>
      </header>

      {/* Tabs navigation */}
      <div className="flex border-b border-gray-200 mb-6 gap-2">
        <button
          className={`px-4 py-2 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'consents' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('consents')}
        >
          Consentimientos
        </button>
        <button
          className={`px-4 py-2 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'enrollment' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('enrollment')
            stopCamera()
          }}
        >
          Enrolamiento Facial
        </button>
        <button
          className={`px-4 py-2 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'stations' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('stations')
            stopCamera()
          }}
        >
          Estaciones y Cámaras
        </button>
      </div>

      {/* TAB 1: Consentimientos */}
      {activeTab === 'consents' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <form
              className="panel"
              onSubmit={(e) => {
                e.preventDefault()
                grantConsentMutation.mutate({
                  student_id: consentStudentId,
                  legal_basis: legalBasis,
                  expires_at: expiresAt || undefined
                })
              }}
            >
              <h2>Otorgar Consentimiento</h2>
              <label>
                ID del Alumno (UUID)
                <input
                  type="text"
                  placeholder="00000000-0000-0000-0000-000000000000"
                  value={consentStudentId}
                  onChange={(e) => setConsentStudentId(e.target.value)}
                  required
                />
              </label>
              <label>
                Base Legal / Documentación
                <input
                  type="text"
                  placeholder="Ej. Consentimiento firmado 2026-06-08"
                  value={legalBasis}
                  onChange={(e) => setLegalBasis(e.target.value)}
                  required
                />
              </label>
              <label>
                Fecha de Expiración (Opcional)
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </label>

              <button className="button button-primary" type="submit" disabled={grantConsentMutation.isPending}>
                Registrar Consentimiento
              </button>

              {consentMessage && <p className="form-success">{consentMessage}</p>}
              {consentError && <p className="form-error">{consentError}</p>}
            </form>
          </div>

          <div className="md:col-span-2 panel">
            <h2>Historial de Consentimientos</h2>
            <DataTable
              rows={consentsQuery.data?.data}
              isLoading={consentsQuery.isLoading}
              error={consentsQuery.error as Error}
              columns={[
                {
                  label: 'ID Alumno',
                  render: (consent) => (
                    <div>
                      <strong>{consent.student_name || 'Alumno'}</strong>
                      <small>{consent.student_id}</small>
                    </div>
                  )
                },
                { label: 'Base Legal', render: (consent) => consent.legal_basis },
                {
                  label: 'Estado',
                  render: (consent) => (
                    <span
                      className={`status-chip ${
                        consent.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : consent.status === 'revoked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {consent.status === 'active'
                        ? 'Activo'
                        : consent.status === 'revoked'
                        ? 'Revocado'
                        : 'Expirado'}
                    </span>
                  )
                },
                {
                  label: 'Acciones',
                  render: (consent) =>
                    consent.status === 'active' ? (
                      <button
                        className="button button-secondary text-red-600 border-red-200"
                        onClick={() => setRevocationConsentId(consent.id)}
                      >
                        Revocar
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs">Sin acciones</span>
                    )
                }
              ]}
            />
          </div>

          {/* Revocation Modal Overlay */}
          {revocationConsentId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
                <h3 className="text-lg font-bold">Revocar Consentimiento Biométrico</h3>
                <p className="text-sm text-gray-500">
                  Esta acción programará la eliminación inmediata de los perfiles faciales asociados. Debes registrar el motivo.
                </p>
                <label className="block text-sm font-bold">
                  Motivo de Revocación
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    placeholder="Ej. Solicitado por el apoderado"
                    value={revocationReason}
                    onChange={(e) => setRevocationReason(e.target.value)}
                    required
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setRevocationConsentId(null)
                      setRevocationReason('')
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="button button-primary bg-red-600 hover:bg-red-700 text-white"
                    disabled={!revocationReason || revokeConsentMutation.isPending}
                    onClick={() =>
                      revokeConsentMutation.mutate({
                        consentId: revocationConsentId,
                        reason: revocationReason
                      })
                    }
                  >
                    Confirmar Revocación
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Enrolamiento Guided Flow */}
      {activeTab === 'enrollment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel flex flex-col justify-between">
            <div>
              <h2>Verificar Consentimiento</h2>
              <p className="text-sm text-gray-500 mb-4">
                Ingresa el ID del alumno para comprobar si tiene un consentimiento activo.
              </p>
              <label>
                ID del Alumno (UUID)
                <input
                  type="text"
                  placeholder="00000000-0000-0000-0000-000000000000"
                  value={enrollStudentId}
                  onChange={(e) => setEnrollStudentId(e.target.value)}
                />
              </label>

              {/* Consent alert banners */}
              {enrollStudentId.trim() !== '' && (
                <div className="mt-4">
                  {activeConsent ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800">
                      <ShieldCheck size={24} weight="fill" className="text-green-600 mt-0.5" />
                      <div>
                        <strong>Consentimiento Activo Encontrado</strong>
                        <p className="text-xs mt-1 text-green-700">
                          Base Legal: {activeConsent.legal_basis} (Válido)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800">
                      <Warning size={24} weight="fill" className="text-red-600 mt-0.5" />
                      <div>
                        <strong>Enrolamiento Bloqueado</strong>
                        <p className="text-xs mt-1 text-red-700">
                          El alumno no cuenta con consentimiento biométrico activo. Registra uno antes de continuar.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* General enrollment messages */}
            <div className="mt-4">
              {enrollMessage && <p className="form-success">{enrollMessage}</p>}
              {enrollError && <p className="form-error">{enrollError}</p>}
            </div>
          </div>

          {/* Capture Console */}
          <div className="panel space-y-4">
            <h2>Captura Facial (3 a 5 Fotos)</h2>

            {!activeConsent ? (
              <div className="h-64 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-600 bg-gray-50">
                <Fingerprint size={48} weight="thin" />
                <p className="mt-2 text-sm">Ingresa un ID con consentimiento activo para desbloquear la cámara.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Webcam capture feed */}
                {cameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-gray-800">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    {/* Face alignment guide */}
                    <div className="absolute inset-0 border-4 border-dashed border-indigo-400/50 rounded-full m-8 pointer-events-none flex items-center justify-center">
                      <span className="bg-black/50 text-indigo-200 text-xs px-2 py-1 rounded">Alinea el rostro aquí</span>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      <button
                        className="button button-primary"
                        onClick={capturePhoto}
                        disabled={images.length >= 5}
                      >
                        <Camera size={18} /> Capturar Foto
                      </button>
                      <button className="button button-secondary text-white border-transparent bg-black/40 hover:bg-black/60" onClick={stopCamera}>
                        Apagar Cámara
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 rounded-2xl flex flex-col items-center justify-center bg-gray-100 border border-gray-200">
                    <button className="button button-secondary" onClick={startCamera}>
                      <Camera size={18} /> Encender Cámara
                    </button>
                  </div>
                )}

                {/* File picker alternative */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <strong className="text-sm block">Subida Manual / E2E</strong>
                    <span className="text-xs text-gray-600">Alternativa para pruebas o carga de archivos</span>
                  </div>
                  <label className="button button-secondary cursor-pointer">
                    Seleccionar Archivos
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={images.length >= 5}
                    />
                  </label>
                </div>

                {/* Captured previews grid */}
                {images.length > 0 && (
                  <div className="space-y-2">
                    <strong className="text-sm">Fotos Capturadas ({images.length} de 5)</strong>
                    <div className="grid grid-cols-5 gap-2">
                      {imagePreviews.map((url, idx) => (
                        <div key={url} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img src={url} alt="Snap preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                            onClick={() => removePhoto(idx)}
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit action */}
                <button
                  className="button button-primary w-full"
                  disabled={images.length < 3 || isEnrolling}
                  onClick={() =>
                    enrollProfileMutation.mutate({
                      studentId: enrollStudentId,
                      consentId: activeConsent.id
                    })
                  }
                >
                  {isEnrolling ? (
                    <>
                      <SpinnerGap className="spin" size={18} /> Enrolando...
                    </>
                  ) : (
                    'Finalizar y Registrar Enrolamiento'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Estaciones y Cámaras */}
      {activeTab === 'stations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <form
              className="panel"
              onSubmit={(e) => {
                e.preventDefault()
                createStationMutation.mutate({
                  name: stationName,
                  location: stationLocation,
                  mode: stationMode
                })
              }}
            >
              <h2>Nueva Estación</h2>
              <label>
                Nombre
                <input
                  type="text"
                  placeholder="Ej. Puerta Principal"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  required
                />
              </label>
              <label>
                Ubicación
                <input
                  type="text"
                  placeholder="Ej. Pabellón Secundaria"
                  value={stationLocation}
                  onChange={(e) => setStationLocation(e.target.value)}
                  required
                />
              </label>
              <label>
                Modo de Operación
                <select
                  value={stationMode}
                  onChange={(e) => setStationMode(e.target.value as 'entry' | 'exit' | 'mixed')}
                >
                  <option value="entry">Entrada</option>
                  <option value="exit">Salida</option>
                  <option value="mixed">Mixto (Entrada/Salida)</option>
                </select>
              </label>

              <button className="button button-primary" type="submit" disabled={createStationMutation.isPending}>
                Registrar Estación
              </button>

              {stationMessage && <p className="form-success">{stationMessage}</p>}
              {stationError && <p className="form-error">{stationError}</p>}
            </form>

            {/* Temporary Activation Code Display */}
            {activationCodeInfo && (
              <div className="panel border-indigo-200 bg-indigo-50/50">
                <div className="flex items-start gap-3">
                  <Key size={24} className="text-indigo-600 mt-1" />
                  <div>
                    <strong className="block text-indigo-900">Código de Activación</strong>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      Ingresa este código en la estación para vincular el dispositivo.
                    </p>
                    <div className="mt-3 text-3xl font-mono font-bold tracking-widest text-indigo-950 bg-indigo-100/60 py-2 px-4 rounded-xl text-center">
                      {activationCodeInfo.code}
                    </div>
                    <span className="text-[10px] text-indigo-500 block mt-2 text-center">
                      Válido por 10 minutos
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="panel">
              <h2>Estaciones de Asistencia</h2>
              <DataTable
                rows={stationsQuery.data?.data}
                isLoading={stationsQuery.isLoading}
                error={stationsQuery.error as Error}
                columns={[
                  {
                    label: 'Estación',
                    render: (st) => (
                      <div>
                        <strong>{st.name}</strong>
                        <small>{st.location}</small>
                      </div>
                    )
                  },
                  {
                    label: 'Modo',
                    render: (st) => (
                      <span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">
                        {st.mode === 'mixed' ? 'Mixto' : st.mode === 'entry' ? 'Entrada' : 'Salida'}
                      </span>
                    )
                  },
                  {
                    label: 'Estado',
                    render: (st) => (
                      <span
                        className={`status-chip ${
                          st.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : st.status === 'revoked'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {st.status === 'active'
                          ? 'Activa'
                          : st.status === 'revoked'
                          ? 'Revocada'
                          : 'Inactiva'}
                      </span>
                    )
                  },
                  {
                    label: 'Acciones',
                    render: (st) => (
                      <div className="row-actions flex-wrap">
                        {st.status === 'active' ? (
                          <>
                            <button
                              className="button button-secondary text-xs py-1"
                              onClick={() => generateActivationMutation.mutate(st.id)}
                            >
                              Activar
                            </button>
                            <button
                              className="button button-secondary text-red-600 border-red-200 text-xs py-1"
                              onClick={() => setRevocationStationId(st.id)}
                            >
                              Revocar
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-600 text-xs">Histórica</span>
                        )}
                        <button
                          className={`button text-xs py-1 ${
                            selectedStationId === st.id ? 'button-primary' : 'button-secondary'
                          }`}
                          onClick={() => setSelectedStationId(st.id)}
                        >
                          Cámaras
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </div>

            {/* Selected Station Cameras Sub-panel */}
            {selectedStationId && (
              <div className="panel space-y-4 border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3>Cámaras de la Estación</h3>
                    <p className="text-xs text-gray-500">
                      Dispositivo seleccionado: {stationsQuery.data?.data.find((s) => s.id === selectedStationId)?.name}
                    </p>
                  </div>
                  <button className="text-xs text-indigo-600 underline" onClick={() => setSelectedStationId(null)}>
                    Cerrar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cameras List */}
                  <div className="border rounded-xl p-3 bg-gray-50/50">
                    <strong className="text-xs block mb-2 text-gray-600">Listado de Cámaras</strong>
                    {camerasQuery.isLoading ? (
                      <div className="flex items-center justify-center p-6">
                        <SpinnerGap className="spin text-indigo-600" size={24} />
                      </div>
                    ) : camerasQuery.error ? (
                      <div className="p-4 text-xs text-red-600">Error: {(camerasQuery.error as Error).message}</div>
                    ) : camerasQuery.data && camerasQuery.data.length > 0 ? (
                      <div className="space-y-2">
                        {camerasQuery.data.map((cam) => (
                          <div key={cam.id} className="flex justify-between items-center bg-white p-2.5 rounded-lg border shadow-sm">
                            <div>
                              <strong className="text-sm block">{cam.label}</strong>
                              <code className="text-[10px] text-gray-600">{cam.device_identifier}</code>
                            </div>
                            <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                              Activa
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 text-xs text-gray-600">Sin cámaras registradas.</div>
                    )}
                  </div>

                  {/* Add Camera Form */}
                  <div className="border rounded-xl p-3 bg-white space-y-3">
                    <strong className="text-xs block text-gray-600">Registrar Nueva Cámara</strong>
                    <label className="block text-xs font-bold space-y-1">
                      Etiqueta / Nombre
                      <input
                        type="text"
                        className="w-full mt-1 p-2 border border-gray-300 rounded text-xs"
                        placeholder="Ej. Entrada Principal Izquierda"
                        value={cameraLabel}
                        onChange={(e) => setCameraLabel(e.target.value)}
                        required
                      />
                    </label>
                    <label className="block text-xs font-bold space-y-1">
                      Identificador del Dispositivo
                      <input
                        type="text"
                        className="w-full mt-1 p-2 border border-gray-300 rounded text-xs"
                        placeholder="Ej. /dev/video0 o USB-Cam"
                        value={cameraIdentifier}
                        onChange={(e) => setCameraIdentifier(e.target.value)}
                        required
                      />
                    </label>
                    <button
                      className="button button-primary w-full text-xs py-2"
                      disabled={!cameraLabel || !cameraIdentifier || createCameraMutation.isPending}
                      onClick={() =>
                        createCameraMutation.mutate({
                          stationId: selectedStationId,
                          label: cameraLabel,
                          identifier: cameraIdentifier
                        })
                      }
                    >
                      Añadir Cámara
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Revoke Station Modal Overlay */}
          {revocationStationId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
                <h3 className="text-lg font-bold">Revocar Estación de Asistencia</h3>
                <p className="text-sm text-gray-500">
                  Esta acción revocará la sesión técnica del dispositivo permanentemente. La estación permanecerá inactiva en el historial.
                </p>
                <label className="block text-sm font-bold">
                  Motivo de Revocación
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-gray-300 rounded"
                    placeholder="Ej. Estación comprometida / fuera de servicio"
                    value={stationRevokeReason}
                    onChange={(e) => setStationRevokeReason(e.target.value)}
                    required
                  />
                </label>
                <div className="flex justify-end gap-2">
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setRevocationStationId(null)
                      setStationRevokeReason('')
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="button button-primary bg-red-600 hover:bg-red-700 text-white"
                    disabled={!stationRevokeReason || revokeStationMutation.isPending}
                    onClick={() =>
                      revokeStationMutation.mutate({
                        id: revocationStationId,
                        reason: stationRevokeReason
                      })
                    }
                  >
                    Revocar Estación
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
