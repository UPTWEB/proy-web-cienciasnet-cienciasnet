/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  FileText,
  Warning,
  SpinnerGap,
  Plus,
  FileCsv,
  ShieldCheck,
  CheckCircle,
  MagnifyingGlass
} from '@phosphor-icons/react'
import { useAuth } from '@/features/auth/AuthContext'
import { listAcademic, listAccounts } from '@/features/phase-one/api'
import { OperationalState } from '@/components/shared/OperationalState'
import { getApiError } from '@/lib/api/client'
import {
  listAssessments,
  createAssessment,
  listAssessmentResults,
  replaceAssessmentResults,
  importAssessmentResults
} from './api'
import type { AssessmentResult, ReplaceAssessmentResultsInput } from './types'
import {
  publishAssessment,
  setAssessmentClosure,
  correctPublishedResult
} from '@/features/academic-reports/api'

export function AssessmentsPage() {
  const { user } = useAuth()
  const client = useQueryClient()

  // 1. Roles and Permissions check
  const isDocente = user?.roles.includes('docente') && !user?.roles.some((r) => ['superadmin', 'coordinador_academico'].includes(r))
  const isCoordinator = user?.roles.some((r) => ['superadmin', 'coordinador_academico'].includes(r))

  // Selected teaching load (assignment)
  const [selectedLoadId, setSelectedLoadId] = useState('')
  // Selected assessment
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('')

  // Modal control states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  // 2. Fetch Academic Data
  const assignmentsQuery = useQuery({
    queryKey: ['academic', 'teaching-assignments'],
    queryFn: () => listAcademic('teaching-assignments')
  })

  const coursesQuery = useQuery({
    queryKey: ['academic', 'courses'],
    queryFn: () => listAcademic('courses')
  })

  const sectionsQuery = useQuery({
    queryKey: ['academic', 'sections'],
    queryFn: () => listAcademic('sections')
  })

  const gradesQuery = useQuery({
    queryKey: ['academic', 'grades'],
    queryFn: () => listAcademic('grades')
  })

  const enrollmentsQuery = useQuery({
    queryKey: ['academic', 'enrollments'],
    queryFn: () => listAcademic('enrollments')
  })

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: () => listAccounts()
  })

  // 3. Filter teaching assignments based on Aislamiento de Carga
  const rawAssignments = assignmentsQuery.data?.data || []
  const assignments = isDocente
    ? rawAssignments.filter((a) => a.teacher_id === user?.id)
    : rawAssignments

  // Helper mappings
  const getCourseName = (courseId?: string) => {
    const course = coursesQuery.data?.data.find((c) => c.id === courseId)
    return course?.name || `Curso (${courseId?.slice(0, 8)})`
  }

  const getSectionName = (sectionId?: string) => {
    const sec = sectionsQuery.data?.data.find((s) => s.id === sectionId)
    const grade = gradesQuery.data?.data.find((g) => g.id === sec?.grade_id)
    return sec ? `${grade?.name || ''} "${sec.name}"` : `Sección (${sectionId?.slice(0, 8)})`
  }

  const getStudentName = (studentId: string) => {
    const student = accountsQuery.data?.data.find((a) => a.id === studentId)
    return student?.name || `Estudiante (${studentId.slice(0, 8)})`
  }

  const selectedLoad = assignments.find((a) => a.id === selectedLoadId)

  // 4. Fetch Assessments for selected load
  const assessmentsQuery = useQuery({
    queryKey: ['assessments', selectedLoadId],
    queryFn: () => listAssessments({ teaching_assignment_id: selectedLoadId }),
    enabled: !!selectedLoadId
  })

  const selectedAssessment = assessmentsQuery.data?.data.find((a) => a.id === selectedAssessmentId)

  // 5. Fetch assessment results
  const resultsQuery = useQuery({
    queryKey: ['assessment-results', selectedAssessmentId],
    queryFn: () => listAssessmentResults(selectedAssessmentId!),
    enabled: !!selectedAssessmentId
  })

  // 6. Merge section enrollments with results to ensure all students appear
  const [localResults, setLocalResults] = useState<AssessmentResult[]>([])
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({}) // studentId -> error msg
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')

  const activeEnrollments = enrollmentsQuery.data?.data.filter(
    (e) => e.section_id === selectedLoad?.section_id
  ) || []

  useEffect(() => {
    if (!selectedAssessmentId) {
      setLocalResults([])
      setRowErrors({})
      return
    }

    const fetchedResults = resultsQuery.data?.data || []
    const sectionId = selectedLoad?.section_id
    const enrollments = enrollmentsQuery.data?.data || []
    const studentList = accountsQuery.data?.data || []

    const enrolls = enrollments.filter((e) => e.section_id === sectionId && e.student_id)

    const merged: AssessmentResult[] = enrolls.map((enr) => {
      const studentId = enr.student_id!
      const existing = fetchedResults.find((r) => r.student_id === studentId)
      const student = studentList.find((a) => a.id === studentId)
      const studentName = student?.name || `Estudiante (${studentId.slice(0, 8)})`

      return {
        id: existing?.id || `new-res-${studentId}`,
        student_id: studentId,
        student_name: studentName,
        score: existing ? existing.score : null,
        status: existing ? (existing.status as 'recorded' | 'absent' | 'exempt' | 'pending') : 'pending',
        observations: existing ? existing.observations : null
      }
    })

    setLocalResults(merged)
    setRowErrors({})
  }, [resultsQuery.data, selectedAssessmentId, enrollmentsQuery.data, accountsQuery.data, selectedLoad?.section_id])

  // Marksheet mutation
  const saveResultsMutation = useMutation({
    mutationFn: (input: ReplaceAssessmentResultsInput) =>
      replaceAssessmentResults(selectedAssessmentId, input, `save-${selectedAssessmentId}-${Date.now()}`),
    onSuccess: async () => {
      setSaveSuccess('Notas guardadas y actualizadas exitosamente.')
      setSaveError('')
      await client.invalidateQueries({ queryKey: ['assessment-results', selectedAssessmentId] })
      setTimeout(() => setSaveSuccess(''), 4000)
    },
    onError: (err) => {
      setSaveSuccess('')
      setSaveError(getApiError(err).message)
    }
  })

  // Coordinator action mutations
  const publishMutation = useMutation({
    mutationFn: (id: string) => publishAssessment(id, `publish-${id}-${Date.now()}`),
    onSuccess: async () => {
      setSaveSuccess('Evaluación publicada exitosamente.')
      setSaveError('')
      await client.invalidateQueries({ queryKey: ['assessments', selectedLoadId] })
      setTimeout(() => setSaveSuccess(''), 4000)
    },
    onError: (err) => {
      setSaveSuccess('')
      setSaveError(getApiError(err).message)
    }
  })

  const closureMutation = useMutation({
    mutationFn: ({ id, closed }: { id: string; closed: boolean }) =>
      setAssessmentClosure(id, { closed }),
    onSuccess: async (_, variables) => {
      setSaveSuccess(variables.closed ? 'Evaluación cerrada exitosamente.' : 'Evaluación reabierta exitosamente.')
      setSaveError('')
      await client.invalidateQueries({ queryKey: ['assessments', selectedLoadId] })
      setTimeout(() => setSaveSuccess(''), 4000)
    },
    onError: (err) => {
      setSaveSuccess('')
      setSaveError(getApiError(err).message)
    }
  })

  const correctResultMutation = useMutation({
    mutationFn: ({ resultId, score, reason }: { resultId: string; score: string; reason: string }) =>
      correctPublishedResult(resultId, { score, reason }),
    onSuccess: async () => {
      setSaveSuccess('Nota corregida y auditada exitosamente.')
      setSaveError('')
      setShowCorrectModal(false)
      setCorrectionScore('')
      setCorrectionReason('')
      setCorrectionTarget(null)
      await client.invalidateQueries({ queryKey: ['assessment-results', selectedAssessmentId] })
      setTimeout(() => setSaveSuccess(''), 4000)
    },
    onError: (err) => {
      setCorrectionError(getApiError(err).message)
    }
  })

  // Modal states for Audited Correction
  const [showCorrectModal, setShowCorrectModal] = useState(false)
  const [correctionTarget, setCorrectionTarget] = useState<AssessmentResult | null>(null)
  const [correctionScore, setCorrectionScore] = useState('')
  const [correctionReason, setCorrectionReason] = useState('')
  const [correctionError, setCorrectionError] = useState('')

  const validateCorrectionScore = (scoreStr: string, maxScore: number) => {
    if (!scoreStr || scoreStr.trim() === '') {
      return 'Puntaje requerido'
    }
    const scoreNum = Number(scoreStr)
    if (isNaN(scoreNum) || scoreNum < 0) {
      return 'Número inválido'
    }
    if (scoreNum > maxScore) {
      return `Máximo ${maxScore}`
    }
    if (!/^\d{1,10}(\.\d{1,2})?$/.test(scoreStr)) {
      return 'Máx 2 decimales'
    }
    return ''
  }

  // Keyboard Navigation handler
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault()
      const nextInput = inputRefs.current[`score-${index + 1}`]
      nextInput?.focus()
      nextInput?.select()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevInput = inputRefs.current[`score-${index - 1}`]
      prevInput?.focus()
      prevInput?.select()
    }
  }

  // Individual mark cell validation
  const validateCell = (studentId: string, scoreStr: string | null, status: string, maxScore: number) => {
    if (status !== 'recorded') {
      setRowErrors((prev) => {
        const next = { ...prev }
        delete next[studentId]
        return next
      })
      return true
    }

    if (!scoreStr || scoreStr.trim() === '') {
      setRowErrors((prev) => ({ ...prev, [studentId]: 'Puntaje requerido' }))
      return false
    }

    const scoreNum = Number(scoreStr)
    if (isNaN(scoreNum) || scoreNum < 0) {
      setRowErrors((prev) => ({ ...prev, [studentId]: 'Número inválido' }))
      return false
    }

    if (scoreNum > maxScore) {
      setRowErrors((prev) => ({ ...prev, [studentId]: `Máximo ${maxScore}` }))
      return false
    }

    if (!/^\d{1,10}(\.\d{1,2})?$/.test(scoreStr)) {
      setRowErrors((prev) => ({ ...prev, [studentId]: 'Máx 2 decimales' }))
      return false
    }

    setRowErrors((prev) => {
      const next = { ...prev }
      delete next[studentId]
      return next
    })
    return true
  }

  const handleScoreChange = (index: number, studentId: string, val: string, maxScore: number) => {
    setLocalResults((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], score: val || null }
      return copy
    })
    validateCell(studentId, val, localResults[index].status, maxScore)
  }

  const handleStatusChange = (index: number, studentId: string, statusVal: 'recorded' | 'absent' | 'exempt' | 'pending', maxScore: number) => {
    setLocalResults((prev) => {
      const copy = [...prev]
      const nextScore = statusVal === 'recorded' ? copy[index].score : null
      copy[index] = { ...copy[index], status: statusVal, score: nextScore }
      validateCell(studentId, nextScore, statusVal, maxScore)
      return copy
    })
  }

  const handleObservationsChange = (index: number, val: string) => {
    setLocalResults((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], observations: val || null }
      return copy
    })
  }

  // --- EVALUATION CREATION (COORDINATORS) ---
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<'exam' | 'practice' | 'project' | 'participation' | 'other'>('exam')
  const [newMaxScore, setNewMaxScore] = useState('20.00')
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10))
  const [newChannel, setNewChannel] = useState<'general' | 'sciences' | 'humanities'>('general')
  const [newTotalQuestions, setNewTotalQuestions] = useState('')
  const [createError, setCreateError] = useState('')

  const isSelectedGradeFifthSecondary = (() => {
    if (!selectedLoad) return false
    const sec = sectionsQuery.data?.data.find((s) => s.id === selectedLoad.section_id)
    const grade = gradesQuery.data?.data.find((g) => g.id === sec?.grade_id)
    return grade?.name?.includes('5') || false
  })()

  const createAssessmentMutation = useMutation({
    mutationFn: createAssessment,
    onSuccess: async () => {
      setShowCreateModal(false)
      setNewTitle('')
      setNewType('exam')
      setNewMaxScore('20.00')
      setNewDate(new Date().toISOString().slice(0, 10))
      setNewChannel('general')
      setNewTotalQuestions('')
      setCreateError('')
      await client.invalidateQueries({ queryKey: ['assessments', selectedLoadId] })
    },
    onError: (err) => setCreateError(getApiError(err).message)
  })

  // --- CSV BULK IMPORTER ---
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [csvErrors, setCsvErrors] = useState<string[]>([])
  const [csvPreview, setCsvPreview] = useState<Array<{ studentId: string; studentName: string; score: string | null; status: string; observations: string }>>([])
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setCsvErrors([])
    setCsvPreview([])
    setImportError('')
    setImportSuccess('')

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) return

      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '')
      if (lines.length <= 1) {
        setCsvErrors(['El archivo está vacío o no contiene suficientes líneas.'])
        return
      }

      // Check header or parse lines directly. Let's look for standard headers: student_id, score, status, observations
      // const header = lines[0].split(',').map((h) => h.trim().toLowerCase())
      const rows = lines.slice(1)
      const maxScoreVal = Number(selectedAssessment?.max_score || 20)

      const errorsFound: string[] = []
      const previewData: typeof csvPreview = []

      rows.forEach((row, i) => {
        const cols = row.split(',').map((c) => c.trim())
        // Find indices or assume: 0=student_id, 1=score, 2=status, 3=observations
        const studentId = cols[0] || ''
        const scoreStr = cols[1] || ''
        const statusVal = (cols[2] || 'recorded').toLowerCase()
        const obs = cols[3] || ''

        const rowNum = i + 2 // 1-indexed header is row 1

        if (!studentId) {
          errorsFound.push(`Fila ${rowNum}: ID de estudiante ausente.`)
          return
        }

        // Check if student belongs to this section
        const isEnrolled = activeEnrollments.some((e) => e.student_id && e.student_id.toLowerCase() === studentId.toLowerCase())
        if (!isEnrolled) {
          errorsFound.push(`Fila ${rowNum}: El estudiante con ID "${studentId}" no está matriculado en esta sección.`)
        }

        const validStatuses = ['recorded', 'absent', 'exempt', 'pending']
        if (!validStatuses.includes(statusVal)) {
          errorsFound.push(`Fila ${rowNum}: Estado "${statusVal}" no es válido. Debe ser uno de: ${validStatuses.join(', ')}.`)
        }

        if (statusVal === 'recorded') {
          if (!scoreStr) {
            errorsFound.push(`Fila ${rowNum}: Puntaje requerido para el estado "recorded".`)
          } else {
            const scoreNum = Number(scoreStr)
            if (isNaN(scoreNum) || scoreNum < 0) {
              errorsFound.push(`Fila ${rowNum}: Puntaje "${scoreStr}" no es un número válido.`)
            } else if (scoreNum > maxScoreVal) {
              errorsFound.push(`Fila ${rowNum}: Puntaje "${scoreStr}" excede el puntaje máximo permitido (${maxScoreVal}).`)
            }
          }
        }

        previewData.push({
          studentId,
          studentName: getStudentName(studentId),
          score: statusVal === 'recorded' ? scoreStr : null,
          status: statusVal,
          observations: obs
        })
      })

      setCsvErrors(errorsFound)
      setCsvPreview(previewData)
    }

    reader.readAsText(file)
  }

  const importMutation = useMutation({
    mutationFn: (fileObj: File) => importAssessmentResults(fileObj, `import-${selectedAssessmentId}-${Date.now()}`),
    onSuccess: async () => {
      setImportSuccess('Resultados importados correctamente.')
      setImportError('')
      setSelectedFile(null)
      setCsvPreview([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      await client.invalidateQueries({ queryKey: ['assessment-results', selectedAssessmentId] })
      setTimeout(() => {
        setImportSuccess('')
        setShowImportModal(false)
      }, 2000)
    },
    onError: (err) => {
      setImportError(getApiError(err).message)
    }
  })

  return (
    <section className="page-stack dashboard-light-bg p-6 rounded-3xl border border-slate-100/80 shadow-sm text-slate-800">
      <header className="space-y-1">
        <p className="eyebrow text-blue-600 font-extrabold tracking-wider text-xs flex items-center gap-1.5">
          <FileText size={14} weight="bold" />
          Área Académica
        </p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Evaluaciones y Notas</h1>
        <p className="text-slate-500 text-sm">Configura evaluaciones y registra los resultados de los exámenes generales y simulacros de manera individual o masiva.</p>
      </header>

      {/* Selectors Panel */}
      <div className="glass-panel-light p-5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <label className="text-xs font-bold text-slate-700 flex flex-col flex-1 cursor-pointer">
          Carga Académica / Curso
          <select
            className="glass-input-light mt-1.5 p-3 rounded-xl text-sm font-semibold cursor-pointer"
            value={selectedLoadId}
            onChange={(e) => {
              setSelectedLoadId(e.target.value)
              setSelectedAssessmentId('')
              setSaveSuccess('')
              setSaveError('')
            }}
          >
            <option value="">Seleccione curso...</option>
            {assignments.map((item) => (
              <option value={item.id} key={item.id}>
                {getCourseName(item.course_id)} · {getSectionName(item.section_id)}
              </option>
            ))}
          </select>
        </label>

        {selectedLoadId && (
          <label className="text-xs font-bold text-slate-700 flex flex-col flex-1 cursor-pointer">
            Evaluación
            <select
              className="glass-input-light mt-1.5 p-3 rounded-xl text-sm font-semibold cursor-pointer"
              value={selectedAssessmentId}
              onChange={(e) => {
                setSelectedAssessmentId(e.target.value)
                setSaveSuccess('')
                setSaveError('')
              }}
            >
              <option value="">Seleccione evaluación...</option>
              {assessmentsQuery.data?.data.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.title} ({item.assessment_date} · Máx {item.max_score})
                </option>
              ))}
            </select>
          </label>
        )}

        {selectedLoadId && isCoordinator && (
          <button
            className="button button-primary bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm px-5 py-3 md:mt-5 font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} weight="bold" /> Crear Evaluación
          </button>
        )}
      </div>

      {/* Marksheet & Grid View */}
      {selectedAssessmentId ? (
        <div className="space-y-4">
          <div className="glass-panel-light p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-blue-600" size={22} weight="bold" />
                Registro: {selectedAssessment?.title}
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-black uppercase ${
                  selectedAssessment?.status === 'closed'
                    ? 'bg-red-100 text-red-800'
                    : selectedAssessment?.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedAssessment?.status === 'closed'
                    ? 'Cerrado'
                    : selectedAssessment?.status === 'published'
                    ? 'Publicado'
                    : 'Borrador'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tipo: <strong>{selectedAssessment?.assessment_type}</strong> |
                Puntaje Máximo: <strong>{selectedAssessment?.max_score}</strong> |
                Fecha: <strong>{selectedAssessment?.assessment_date}</strong>
                {selectedAssessment?.channel && (
                  <> | Canal: <strong>{selectedAssessment.channel}</strong></>
                )}
              </p>
            </div>

            <div className="flex gap-2">
              {/* Coordinator controls: Publicar / Cerrar / Reabrir */}
              {isCoordinator && selectedAssessment?.status === 'draft' && (
                <button
                  className="button button-secondary bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3.5 py-2.5 rounded-xl font-black flex items-center gap-1.5 cursor-pointer hover:bg-blue-100"
                  disabled={publishMutation.isPending}
                  onClick={() => publishMutation.mutate(selectedAssessment.id)}
                >
                  {publishMutation.isPending ? 'Publicando...' : 'Publicar'}
                </button>
              )}

              {isCoordinator && selectedAssessment?.status === 'published' && (
                <button
                  className="button button-secondary bg-red-50 text-red-700 border border-red-200 text-xs px-3.5 py-2.5 rounded-xl font-black flex items-center gap-1.5 cursor-pointer hover:bg-red-100"
                  disabled={closureMutation.isPending}
                  onClick={() => closureMutation.mutate({ id: selectedAssessment.id, closed: true })}
                >
                  {closureMutation.isPending ? 'Cerrando...' : 'Cerrar Evaluación'}
                </button>
              )}

              {isCoordinator && selectedAssessment?.status === 'closed' && (
                <button
                  className="button button-secondary bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs px-3.5 py-2.5 rounded-xl font-black flex items-center gap-1.5 cursor-pointer hover:bg-yellow-100"
                  disabled={closureMutation.isPending}
                  onClick={() => closureMutation.mutate({ id: selectedAssessment.id, closed: false })}
                >
                  {closureMutation.isPending ? 'Reabriendo...' : 'Reabrir Evaluación'}
                </button>
              )}

              {selectedAssessment?.status === 'draft' && (
                <>
                  <button
                    className="button button-secondary text-xs px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                    onClick={() => {
                      setSelectedFile(null)
                      setCsvErrors([])
                      setCsvPreview([])
                      setImportError('')
                      setImportSuccess('')
                      setShowImportModal(true)
                    }}
                  >
                    <FileCsv size={16} className="text-emerald-600" /> Importar CSV
                  </button>
                  <button
                    className="button button-primary bg-blue-600 hover:bg-blue-700 text-white text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer disabled:opacity-50"
                    disabled={saveResultsMutation.isPending || Object.keys(rowErrors).length > 0 || localResults.length === 0}
                    onClick={() =>
                      saveResultsMutation.mutate({
                        results: localResults.map((r) => ({
                          student_id: r.student_id,
                          score: r.score,
                          status: r.status,
                          observations: r.observations || ''
                        }))
                      })
                    }
                  >
                    {saveResultsMutation.isPending ? (
                      <>
                        <SpinnerGap className="spin" size={14} /> Guardando...
                      </>
                    ) : (
                      'Guardar Notas'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {saveSuccess && (
            <p className="form-success bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle size={18} weight="fill" className="text-green-600" />
              {saveSuccess}
            </p>
          )}

          {saveError && (
            <p className="form-error bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl font-bold flex items-center gap-2">
              <Warning size={18} weight="fill" className="text-red-600" />
              {saveError}
            </p>
          )}

          {resultsQuery.isLoading ? (
            <OperationalState state="loading" title="Cargando notas" message="Recuperando planilla del servidor." />
          ) : localResults.length === 0 ? (
            <OperationalState state="empty" title="Sin alumnos" message="No se encontraron matrículas en esta sección para este periodo." />
          ) : (
            <div className="glass-panel-light p-6 rounded-2xl">
              <div className="table-scroll border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 p-1">
                <table className="data-table">
                  <thead>
                    <tr className="text-xs text-slate-500 uppercase font-extrabold border-b border-slate-200/50">
                      <th className="p-3">Estudiante</th>
                      <th className="p-3 w-40">Estado</th>
                      <th className="p-3 w-40">Puntaje</th>
                      <th className="p-3">Observaciones</th>
                      {(selectedAssessment?.status === 'published' || selectedAssessment?.status === 'closed') && isCoordinator && (
                        <th className="p-3 w-28">Acción</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {localResults.map((res, index) => {
                      const hasError = rowErrors[res.student_id]
                      const maxScoreNum = Number(selectedAssessment?.max_score || 20)

                      const isReadOnly = selectedAssessment?.status === 'published' || selectedAssessment?.status === 'closed'

                      return (
                        <tr key={res.student_id} className="border-b border-slate-100/60 text-sm hover:bg-white transition-colors">
                          <td className="p-3 font-bold text-slate-900">
                            {res.student_name}
                            <small className="block text-slate-400 font-mono text-[10px] font-normal mt-0.5">ID: {res.student_id}</small>
                          </td>
                          <td className="p-3">
                            <select
                              className="glass-input-light p-2 rounded-lg text-xs w-full cursor-pointer font-bold disabled:opacity-75"
                              value={res.status}
                              disabled={isReadOnly}
                              onChange={(e) =>
                                handleStatusChange(
                                  index,
                                  res.student_id,
                                  e.target.value as 'recorded' | 'absent' | 'exempt' | 'pending',
                                  maxScoreNum
                                )
                              }
                            >
                              <option value="recorded">Registrado (Con Nota)</option>
                              <option value="absent">Ausente</option>
                              <option value="exempt">Exonerado</option>
                              <option value="pending">Pendiente</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              ref={(el) => {
                                inputRefs.current[`score-${index}`] = el
                              }}
                              className={`glass-input-light p-2 rounded-lg text-center font-mono font-black text-sm w-full transition-all ${
                                hasError ? 'border-red-400 bg-red-50/20 focus:border-red-500' : ''
                              }`}
                              placeholder="--"
                              value={res.score || ''}
                              disabled={res.status !== 'recorded' || isReadOnly}
                              onChange={(e) =>
                                handleScoreChange(index, res.student_id, e.target.value, maxScoreNum)
                              }
                              onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                            {hasError && <p className="text-[10px] text-red-600 font-bold mt-1">{hasError}</p>}
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              className="glass-input-light p-2 rounded-lg text-xs w-full font-normal"
                              placeholder="Ej. Justificó inasistencia..."
                              value={res.observations || ''}
                              disabled={isReadOnly}
                              onChange={(e) => handleObservationsChange(index, e.target.value)}
                            />
                          </td>
                          {isReadOnly && isCoordinator && (
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                className="button button-secondary text-xs px-2.5 py-1.5 rounded-lg font-bold hover:bg-slate-100 text-blue-600 border border-slate-200 cursor-pointer"
                                onClick={() => {
                                  setCorrectionTarget(res)
                                  setCorrectionScore(res.score || '')
                                  setCorrectionReason('')
                                  setCorrectionError('')
                                  setShowCorrectModal(true)
                                }}
                              >
                                Corregir
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : selectedLoadId ? (
        <div className="glass-panel-light p-8 rounded-2xl text-center space-y-2 border border-dashed border-slate-200">
          <MagnifyingGlass size={36} className="text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">Seleccione una Evaluación</h3>
          <p className="text-xs text-slate-500">Debe seleccionar una evaluación en el filtro superior para abrir la planilla de notas.</p>
        </div>
      ) : (
        <div className="glass-panel-light p-8 rounded-2xl text-center space-y-2 border border-dashed border-slate-200">
          <MagnifyingGlass size={36} className="text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800">Seleccione un Curso</h3>
          <p className="text-xs text-slate-500">Elija una de sus cargas académicas asignadas para listar sus evaluaciones.</p>
        </div>
      )}

      {/* --- CREATE EVALUATION MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <form
            className="bg-white border border-slate-100 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 text-slate-800"
            onSubmit={(e) => {
              e.preventDefault()
              createAssessmentMutation.mutate({
                teaching_assignment_id: selectedLoadId,
                title: newTitle,
                assessment_type: newType,
                max_score: newMaxScore,
                assessment_date: newDate,
                channel: isSelectedGradeFifthSecondary ? newChannel : undefined,
                total_questions: newTotalQuestions ? Number(newTotalQuestions) : undefined
              })
            }}
          >
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="text-blue-600 animate-float" size={24} weight="bold" />
              Crear Evaluación
            </h3>
            <p className="text-xs text-slate-400">
              Curso: <strong>{getCourseName(selectedLoad?.course_id)}</strong> | Sección: <strong>{getSectionName(selectedLoad?.section_id)}</strong>
            </p>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5">
                Título de la Evaluación
                <input
                  type="text"
                  className="glass-input-light p-3 rounded-xl text-sm"
                  placeholder="Ej. Práctica Calificada 1"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5 cursor-pointer">
                  Tipo
                  <select
                    className="glass-input-light p-3 rounded-xl text-sm cursor-pointer"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'exam' | 'practice' | 'project' | 'participation' | 'other')}
                  >
                    <option value="exam">Examen</option>
                    <option value="practice">Práctica</option>
                    <option value="project">Proyecto</option>
                    <option value="participation">Participación</option>
                    <option value="other">Otro</option>
                  </select>
                </label>

                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5">
                  Puntaje Máximo
                  <input
                    type="text"
                    pattern="^\d{1,10}(\.\d{1,2})?$"
                    title="Formato monetario o decimal, ej: 20 o 20.00"
                    className="glass-input-light p-3 rounded-xl text-sm font-mono font-bold"
                    placeholder="20.00"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5">
                  Fecha de Aplicación
                  <input
                    type="date"
                    className="glass-input-light p-3 rounded-xl text-sm"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </label>

                {newType === 'exam' && (
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5">
                    Total Preguntas
                    <input
                      type="number"
                      min={1}
                      className="glass-input-light p-3 rounded-xl text-sm"
                      placeholder="40"
                      value={newTotalQuestions}
                      onChange={(e) => setNewTotalQuestions(e.target.value)}
                    />
                  </label>
                )}
              </div>

              {isSelectedGradeFifthSecondary && (
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5 cursor-pointer">
                  Canal Especial (5° Secundaria)
                  <select
                    className="glass-input-light p-3 rounded-xl text-sm cursor-pointer"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as 'general' | 'sciences' | 'humanities')}
                  >
                    <option value="general">General</option>
                    <option value="sciences">Ciencias</option>
                    <option value="humanities">Letras / Humanidades</option>
                  </select>
                </label>
              )}
            </div>

            {createError && <p className="form-error bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">{createError}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="button button-secondary rounded-xl text-slate-650 text-sm px-4 py-2 border-slate-200 hover:bg-slate-50 font-bold"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="button button-primary bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm px-4 py-2 font-bold shadow-md disabled:opacity-50"
                disabled={createAssessmentMutation.isPending}
              >
                Confirmar y Crear
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- CSV BULK IMPORTER MODAL --- */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white border border-slate-100 p-6 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-4 text-slate-800">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCsv className="text-emerald-600 animate-float" size={24} weight="bold" />
              Importación Masiva de Notas
            </h3>
            <p className="text-xs text-slate-500">
              Suba un archivo CSV con las columnas: <strong>student_id, score, status, observations</strong>.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <label className="text-xs font-bold text-slate-700 block cursor-pointer">
                Seleccionar Archivo CSV
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  className="mt-2 text-sm text-slate-500 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 file:cursor-pointer hover:file:bg-blue-100"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {/* Error Preview Banner */}
            {csvErrors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 space-y-2">
                <strong className="text-sm font-bold block flex items-center gap-1.5">
                  <Warning size={16} weight="fill" className="text-red-600" />
                  Errores de Validación Encontrados ({csvErrors.length})
                </strong>
                <ul className="text-xs space-y-1 list-disc pl-4 max-h-40 overflow-y-auto leading-relaxed">
                  {csvErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
                <p className="text-[10px] text-red-600 font-black pt-1">Debe corregir el archivo y volverlo a subir para habilitar la confirmación.</p>
              </div>
            )}

            {/* Success Parser Preview */}
            {selectedFile && csvErrors.length === 0 && csvPreview.length > 0 && (
              <div className="space-y-3">
                <strong className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  Previsualización de Registros a Importar ({csvPreview.length})
                </strong>
                <div className="table-scroll border border-slate-100 rounded-xl overflow-hidden max-h-60 bg-slate-50/50 p-1">
                  <table className="data-table">
                    <thead>
                      <tr className="text-[11px] text-slate-500 uppercase font-bold border-b border-slate-200/50">
                        <th className="p-2">Estudiante</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2">Nota</th>
                        <th className="p-2">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.map((item, i) => (
                        <tr key={i} className="border-b border-slate-100 text-xs">
                          <td className="p-2 font-semibold">{item.studentName}</td>
                          <td className="p-2 capitalize font-mono text-[10px]">{item.status}</td>
                          <td className="p-2 font-mono font-black text-slate-900">{item.score || '--'}</td>
                          <td className="p-2 italic text-slate-500">{item.observations || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {importError && <p className="form-error bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">{importError}</p>}
            {importSuccess && <p className="form-success bg-green-50 border border-green-200 text-green-700 text-xs p-3 rounded-xl font-bold">{importSuccess}</p>}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                className="button button-secondary rounded-xl text-slate-650 text-sm px-4 py-2 border-slate-200 hover:bg-slate-50 font-bold"
                onClick={() => setShowImportModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="button button-primary bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm px-4 py-2 font-bold shadow-md disabled:opacity-50"
                disabled={!selectedFile || csvErrors.length > 0 || importMutation.isPending}
                onClick={() => {
                  if (selectedFile) importMutation.mutate(selectedFile)
                }}
              >
                {importMutation.isPending ? (
                  <>
                    <SpinnerGap className="spin" size={14} /> Importando...
                  </>
                ) : (
                  'Confirmar e Importar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- AUDITED CORRECTION MODAL --- */}
      {showCorrectModal && correctionTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <form
            className="bg-white border border-slate-100 p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 text-slate-800"
            onSubmit={(e) => {
              e.preventDefault()
              const err = validateCorrectionScore(correctionScore, Number(selectedAssessment?.max_score || 20))
              if (err) {
                setCorrectionError(err)
                return
              }
              if (!correctionReason.trim()) {
                setCorrectionError('La razón de corrección es obligatoria')
                return
              }
              correctResultMutation.mutate({
                resultId: correctionTarget.id,
                score: correctionScore,
                reason: correctionReason
              })
            }}
          >
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Warning className="text-yellow-600 animate-float" size={24} weight="bold" />
              Diálogo de Corrección Auditada
            </h3>
            
            {/* Warning Banner */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-xs space-y-1">
              <strong className="font-bold block flex items-center gap-1">
                <Warning size={14} weight="fill" className="text-yellow-600" />
                ¡Advertencia de Impacto Académico!
              </strong>
              <p>Esta evaluación ya está publicada. Cualquier cambio recalculará el ranking y volverá a notificar al alumno/familia.</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 font-bold">Estudiante</p>
                <p className="text-sm font-bold text-slate-950">{correctionTarget.student_name}</p>
                <small className="block text-slate-400 font-mono text-[10px]">ID: {correctionTarget.student_id}</small>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold">Nota Actual</p>
                  <p className="text-sm font-mono font-black text-slate-800">{correctionTarget.score || 'Ausente/Exento'}</p>
                </div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1">
                  Nueva Nota
                  <input
                    type="text"
                    className="glass-input-light p-2 rounded-lg text-sm font-mono font-bold"
                    placeholder="20.00"
                    value={correctionScore}
                    onChange={(e) => setCorrectionScore(e.target.value)}
                  />
                </label>
              </div>

              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5">
                Razón de la Corrección
                <textarea
                  className="glass-input-light p-3 rounded-xl text-sm min-h-[80px]"
                  placeholder="Escriba la justificación detallada de este cambio de nota..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  maxLength={1000}
                />
              </label>
            </div>

            {correctionError && <p className="form-error bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">{correctionError}</p>}
            {correctResultMutation.isError && <p className="form-error bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl">{getApiError(correctResultMutation.error).message}</p>}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                className="button button-secondary rounded-xl text-slate-650 text-sm px-4 py-2 border-slate-200 hover:bg-slate-50 font-bold"
                onClick={() => {
                  setShowCorrectModal(false)
                  setCorrectionTarget(null)
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="button button-primary bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl text-sm px-4 py-2 font-bold shadow-md disabled:opacity-50"
                disabled={correctResultMutation.isPending}
              >
                {correctResultMutation.isPending ? 'Guardando...' : 'Guardar y Recalcular'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
