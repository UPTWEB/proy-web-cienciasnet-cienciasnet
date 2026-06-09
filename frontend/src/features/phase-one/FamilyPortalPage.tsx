import { useQuery, useQueries, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import {
  House,
  FileText,
  Books,
  Download,
  Lock,
  Warning,
  SpinnerGap,
  CheckCircle
} from '@phosphor-icons/react'
import { OperationalState } from '@/components/shared/OperationalState'
import { useAuth } from '@/features/auth/AuthContext'
import { getStudentSummary, listLinkedStudents, listAcademic } from './api'
import { listAssessments, listAssessmentResults } from '@/features/assessments/api'
import { listRankings, generateAcademicReport } from '@/features/academic-reports/api'
import { getApiError } from '@/lib/api/client'

const contextKey = 'cienciasnet:selected-student-id'

export function FamilyPortalPage() {
  const { user } = useAuth()
  const isParent = user?.roles.includes('padre') === true
  const isStudent = user?.roles.includes('alumno') === true

  const [activeTab, setActiveTab] = useState<'summary' | 'grades' | 'ranking' | 'reports'>('summary')

  // Linked students (only for parents)
  const students = useQuery({
    queryKey: ['linked-students'],
    queryFn: listLinkedStudents,
    enabled: isParent
  })

  const [selected, setSelected] = useState(() => sessionStorage.getItem(contextKey) ?? '')
  const selectedId = isStudent ? (user?.id || '') : (selected || students.data?.[0]?.id || '')

  // Fetch student summary information
  const summary = useQuery({
    queryKey: ['student-summary', selectedId],
    queryFn: () => getStudentSummary(selectedId),
    enabled: Boolean(selectedId)
  })

  // Global Academic Queries to map section and course names
  const periodsQuery = useQuery({
    queryKey: ['academic', 'periods'],
    queryFn: () => listAcademic('academic-periods'),
    enabled: !!selectedId
  })

  const gradesQuery = useQuery({
    queryKey: ['academic', 'grades'],
    queryFn: () => listAcademic('grades'),
    enabled: !!selectedId
  })

  const sectionsQuery = useQuery({
    queryKey: ['academic', 'sections'],
    queryFn: () => listAcademic('sections'),
    enabled: !!selectedId
  })

  const coursesQuery = useQuery({
    queryKey: ['academic', 'courses'],
    queryFn: () => listAcademic('courses'),
    enabled: !!selectedId
  })

  const assignmentsQuery = useQuery({
    queryKey: ['academic', 'assignments'],
    queryFn: () => listAcademic('teaching-assignments'),
    enabled: !!selectedId
  })

  // Fetch all assessments in the system
  const assessmentsQuery = useQuery({
    queryKey: ['portal-assessments'],
    queryFn: () => listAssessments(),
    enabled: !!selectedId
  })

  // Resolve matching IDs based on student summary enrollments
  const availablePeriods = periodsQuery.data?.data || []
  const availableSections = sectionsQuery.data?.data || []
  const availableGrades = gradesQuery.data?.data || []
  const availableAssignments = assignmentsQuery.data?.data || []

  const getGradeName = (gradeId?: string) => {
    return availableGrades.find((g) => g.id === gradeId)?.name || ''
  }

  // Filter sections that match the student's enrollments
  const enrolledSections = availableSections.filter((sec) => {
    return summary.data?.enrollments.some(
      (e) => e.section === sec.name && e.grade === getGradeName(sec.grade_id)
    )
  })

  const enrolledPeriods = availablePeriods.filter((per) => {
    return summary.data?.enrollments.some((e) => e.academic_period === per.name)
  })

  const studentSectionIds = enrolledSections.map((s) => s.id)
  const studentAssignments = availableAssignments.filter((a) =>
    studentSectionIds.includes(a.section_id || '')
  )
  const studentAssignmentIds = studentAssignments.map((a) => a.id)

  // Filter assessments that are assigned to the student's section
  const rawAssessments = assessmentsQuery.data?.data || []
  const studentAssessments = rawAssessments.filter((ass) =>
    studentAssignmentIds.includes(ass.teaching_assignment_id)
  )

  // Query results for each student assessment in parallel
  const resultsQueries = useQueries({
    queries: studentAssessments.map((ass) => ({
      queryKey: ['portal-assessment-result', ass.id, selectedId],
      queryFn: () => listAssessmentResults(ass.id),
      enabled: !!selectedId && !!ass.id
    }))
  })

  const getResultForAssessment = (assessmentId: string) => {
    const idx = studentAssessments.findIndex((ass) => ass.id === assessmentId)
    if (idx === -1) return undefined
    const query = resultsQueries[idx]
    return query?.data?.data.find((r) => r.student_id === selectedId)
  }

  const getCourseNameForAssignment = (assignmentId: string) => {
    const assign = availableAssignments.find((a) => a.id === assignmentId)
    const course = coursesQuery.data?.data.find((c) => c.id === assign?.course_id)
    return course?.name || 'Curso'
  }

  // Fetch rankings
  const rankingsQuery = useQuery({
    queryKey: ['portal-rankings', selectedId],
    queryFn: () => listRankings({ student_id: selectedId }),
    enabled: activeTab === 'ranking' && !!selectedId
  })

  // Generate Academic Report Form State & Mutation
  const [selectedPeriodId, setSelectedPeriodId] = useState('')
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [reportType, setReportType] = useState<'report_card' | 'grade_summary' | 'ranking'>('report_card')
  const [reportFormat, setReportFormat] = useState<'pdf' | 'xlsx'>('pdf')
  const [downloadSuccess, setDownloadSuccess] = useState('')
  const [downloadError, setDownloadError] = useState('')

  const generateReportMutation = useMutation({
    mutationFn: (input: {
      report_type: 'report_card' | 'grade_summary' | 'ranking'
      format: 'pdf' | 'xlsx'
      academic_period_id: string
      section_id: string
      student_id?: string
    }) => generateAcademicReport(input, `report-${selectedId}-${Date.now()}`),
    onSuccess: (_, variables) => {
      setDownloadSuccess('Reporte generado correctamente. Iniciando descarga...')
      setDownloadError('')
      // Mock File Download trigger
      const mockContent = `CienciasNET - Reporte Académico\nTipo: ${variables.report_type}\nFormato: ${variables.format}\nAlumno ID: ${selectedId}\nPeriodo ID: ${variables.academic_period_id}\nSección ID: ${variables.section_id}\nFecha: ${new Date().toLocaleString()}`
      const blob = new Blob([mockContent], {
        type: variables.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte_${variables.report_type}_${Date.now()}.${variables.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setTimeout(() => setDownloadSuccess(''), 4000)
    },
    onError: (err) => {
      setDownloadSuccess('')
      setDownloadError(getApiError(err).message)
    }
  })

  if (!isParent && !isStudent) {
    return (
      <OperationalState
        state="error"
        title="Acceso denegado"
        message="Su cuenta no tiene permisos para acceder al portal familiar o de alumnos."
      />
    )
  }

  const isLoadingStudentInfo =
    isParent && students.isLoading ? true : summary.isLoading

  return (
    <section className="page-stack dashboard-light-bg p-6 rounded-3xl border border-slate-100/80 shadow-sm text-slate-800">
      <header className="space-y-1">
        <p className="eyebrow text-blue-600 font-extrabold tracking-wider text-xs flex items-center gap-1.5">
          <House size={14} weight="bold" />
          {isParent ? 'Portal Familiar' : 'Portal del Alumno'}
        </p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {isParent ? 'Resumen del Alumno' : 'Mi Portal Académico'}
        </h1>
        <p className="text-slate-500 text-sm">
          {isParent
            ? 'Consulta la información, calificaciones, ranking y reportes académicos de tus hijos.'
            : 'Consulta tus notas, posición en el ranking y descarga tus reportes oficiales.'}
        </p>
      </header>

      {/* Linked student selector for parents */}
      {isParent && students.data && students.data.length > 0 && (
        <div className="glass-panel-light p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
          <label className="text-xs font-black uppercase text-slate-600 tracking-wide flex items-center gap-2 cursor-pointer">
            Alumno
            <select
              className="glass-input-light p-2 px-4 rounded-xl text-sm font-semibold cursor-pointer w-full sm:w-72"
              value={selectedId}
              onChange={(event) => {
                sessionStorage.setItem(contextKey, event.target.value)
                setSelected(event.target.value)
              }}
            >
              {students.data.map((student) => (
                <option value={student.id} key={student.id}>
                  {student.name} ({student.relationship})
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {isLoadingStudentInfo && (
        <OperationalState
          state="loading"
          title="Cargando información"
          message="Recuperando la información del alumno desde el servidor."
        />
      )}

      {!isLoadingStudentInfo && summary.error && (
        <OperationalState
          state="error"
          title="Acceso no disponible"
          message="No fue posible consultar la información de este estudiante."
        />
      )}

      {!isLoadingStudentInfo && summary.data && (
        <div className="space-y-6">
          {/* Custom Premium Tabs */}
          <div className="border-b border-slate-100 flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'summary'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <House size={18} /> Resumen
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'grades'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText size={18} /> Calificaciones
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ranking'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Books size={18} /> Ranking Académico
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Download size={18} /> Descargar Reportes
            </button>
          </div>

          {/* TAB 1: RESUMEN */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <article className="glass-panel-light p-6 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <House size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">{summary.data.name}</h3>
                    <p className="text-xs text-slate-400">ID del Alumno: {summary.data.id}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-50/60">
                  <p className="text-sm text-slate-600">
                    Estado biométrico:{' '}
                    <span
                      className={`font-black uppercase text-xs px-2.5 py-0.5 rounded-full ${
                        summary.data.biometric_status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {summary.data.biometric_status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                  <small className="block text-[11px] text-slate-400 mt-2 italic">
                    No se muestran fotos ni datos biométricos.
                  </small>
                </div>
              </article>

              <article className="glass-panel-light p-6 rounded-2xl space-y-3">
                <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Matrículas Vigentes</h3>
                <div className="space-y-2.5">
                  {summary.data.enrollments.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50/50 border border-slate-100/60 rounded-xl flex items-center justify-between text-sm"
                    >
                      <div>
                        <strong className="font-bold text-slate-900">
                          {item.grade} &quot;{item.section}&quot;
                        </strong>
                        <p className="text-xs text-slate-400">{item.academic_period}</p>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-black uppercase">
                        Vigente
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {/* TAB 2: CALIFICACIONES (EVALUACIONES) */}
          {activeTab === 'grades' && (
            <div className="space-y-4">
              {assessmentsQuery.isLoading ? (
                <OperationalState
                  state="loading"
                  title="Cargando evaluaciones"
                  message="Recuperando la lista de evaluaciones."
                />
              ) : studentAssessments.length === 0 ? (
                <OperationalState
                  state="empty"
                  title="Sin calificaciones disponibles"
                  message="No se encontraron evaluaciones registradas para su grado y sección."
                />
              ) : (
                <div className="glass-panel-light p-6 rounded-2xl space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Registro de Calificaciones</h3>
                  <div className="table-scroll border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 p-1">
                    <table className="data-table">
                      <thead>
                        <tr className="text-xs text-slate-500 uppercase font-extrabold border-b border-slate-200/50">
                          <th className="p-3 text-left">Curso</th>
                          <th className="p-3 text-left">Evaluación</th>
                          <th className="p-3 text-left">Tipo</th>
                          <th className="p-3 text-center">Puntaje</th>
                          <th className="p-3 text-left">Observaciones</th>
                          <th className="p-3 text-center">Reporte</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentAssessments.map((ass) => {
                          const courseName = getCourseNameForAssignment(ass.teaching_assignment_id)
                          const result = getResultForAssessment(ass.id)
                          const isDraft = ass.status === 'draft'

                          return (
                            <tr key={ass.id} className="border-b border-slate-100/60 text-sm hover:bg-white transition-colors">
                              <td className="p-3 font-bold text-slate-900">{courseName}</td>
                              <td className="p-3 font-semibold text-slate-800">
                                {ass.title}
                                <small className="block text-slate-400 text-[10px] font-normal mt-0.5">
                                  Fecha: {ass.assessment_date}
                                </small>
                              </td>
                              <td className="p-3 capitalize font-semibold text-slate-500">{ass.assessment_type}</td>
                              <td className="p-3 text-center">
                                {isDraft ? (
                                  <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-yellow-200/50 select-none">
                                    <Lock size={10} /> Pendiente
                                  </span>
                                ) : result ? (
                                  <div className="font-mono font-black text-slate-900">
                                    {result.status === 'recorded' ? (
                                      <>
                                        {result.score}{' '}
                                        <span className="text-xs text-slate-400 font-normal">/ {ass.max_score}</span>
                                      </>
                                    ) : (
                                      <span className="text-xs font-black uppercase text-slate-500">
                                        {result.status === 'absent' ? 'Ausente' : 'Exento'}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 font-mono text-xs">--</span>
                                )}
                              </td>
                              <td className="p-3 text-slate-500 italic max-w-xs truncate">
                                {isDraft ? (
                                  <span className="text-slate-400 select-none">Oculto por pre-publicación</span>
                                ) : (
                                  result?.observations || '-'
                                )}
                              </td>
                              <td className="p-3 text-center">
                                {!isDraft && result ? (
                                  <button
                                    onClick={() => {
                                      // Get section and period IDs for report download
                                      const matchingSection = enrolledSections[0]
                                      const matchingPeriod = enrolledPeriods[0]
                                      if (matchingSection && matchingPeriod) {
                                        generateReportMutation.mutate({
                                          report_type: 'report_card',
                                          format: 'pdf',
                                          academic_period_id: matchingPeriod.id,
                                          section_id: matchingSection.id,
                                          student_id: selectedId
                                        })
                                      } else {
                                        alert('No se pudo identificar la sección o periodo del estudiante.')
                                      }
                                    }}
                                    disabled={generateReportMutation.isPending}
                                    className="button button-secondary text-xs px-2.5 py-1.5 rounded-lg font-bold border border-slate-200 text-blue-600 hover:bg-slate-50 flex items-center gap-1 mx-auto cursor-pointer"
                                  >
                                    <Download size={12} /> Descargar
                                  </button>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RANKING ACADÉMICO */}
          {activeTab === 'ranking' && (
            <div className="space-y-4">
              {rankingsQuery.isLoading ? (
                <OperationalState
                  state="loading"
                  title="Cargando posiciones de ranking"
                  message="Calculando y ordenando las posiciones del alumno."
                />
              ) : !rankingsQuery.data || rankingsQuery.data.data.length === 0 ? (
                <OperationalState
                  state="empty"
                  title="Sin ranking registrado"
                  message="Aún no se han publicado rankings para las evaluaciones de este alumno."
                />
              ) : (
                <div className="glass-panel-light p-6 rounded-2xl space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Ranking Académico Oficial</h3>
                  <div className="table-scroll border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 p-1">
                    <table className="data-table">
                      <thead>
                        <tr className="text-xs text-slate-500 uppercase font-extrabold border-b border-slate-200/50">
                          <th className="p-3 text-left">Evaluación</th>
                          <th className="p-3 text-center">Puntaje</th>
                          <th className="p-3 text-center">Posición (Puesto)</th>
                          <th className="p-3 text-center">Total Participantes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rankingsQuery.data.data.map((rank) => (
                          <tr key={rank.id} className="border-b border-slate-100/60 text-sm hover:bg-white transition-colors">
                            <td className="p-3 font-bold text-slate-900">{rank.assessment_title}</td>
                            <td className="p-3 text-center font-mono font-black text-slate-800">
                              {rank.score || 'Ausente/Exento'}
                            </td>
                            <td className="p-3 text-center">
                              <span className="inline-flex items-center justify-center bg-blue-50 text-blue-700 font-mono font-black rounded-lg text-sm w-8 h-8 border border-blue-100">
                                {rank.rank}
                              </span>
                            </td>
                            <td className="p-3 text-center font-semibold text-slate-500">
                              {rank.total_participants} alumnos
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DESCARGAR REPORTES */}
          {activeTab === 'reports' && (
            <div className="glass-panel-light p-6 rounded-2xl space-y-5">
              <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Centro de Reportes Académicos</h3>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!selectedPeriodId || !selectedSectionId) {
                    setDownloadError('Por favor seleccione el periodo académico y la sección')
                    return
                  }
                  generateReportMutation.mutate({
                    report_type: reportType,
                    format: reportFormat,
                    academic_period_id: selectedPeriodId,
                    section_id: selectedSectionId,
                    student_id: selectedId
                  })
                }}
                className="space-y-4 max-w-xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5 cursor-pointer">
                    Periodo Académico
                    <select
                      className="glass-input-light p-3 rounded-xl text-sm font-semibold cursor-pointer"
                      value={selectedPeriodId}
                      onChange={(e) => setSelectedPeriodId(e.target.value)}
                      required
                    >
                      <option value="">Seleccione periodo...</option>
                      {enrolledPeriods.map((per) => (
                        <option value={per.id} key={per.id}>
                          {per.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5 cursor-pointer">
                    Sección / Grado
                    <select
                      className="glass-input-light p-3 rounded-xl text-sm font-semibold cursor-pointer"
                      value={selectedSectionId}
                      onChange={(e) => setSelectedSectionId(e.target.value)}
                      required
                    >
                      <option value="">Seleccione sección...</option>
                      {enrolledSections.map((sec) => (
                        <option value={sec.id} key={sec.id}>
                          {getGradeName(sec.grade_id)} &quot;{sec.name}&quot;
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5 cursor-pointer">
                    Tipo de Reporte
                    <select
                      className="glass-input-light p-3 rounded-xl text-sm font-semibold cursor-pointer"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as 'report_card' | 'grade_summary' | 'ranking')}
                      required
                    >
                      <option value="report_card">Libreta Escolar de Notas</option>
                      <option value="grade_summary">Resumen de Calificaciones</option>
                      <option value="ranking">Ranking Académico</option>
                    </select>
                  </label>

                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex flex-col gap-1.5 cursor-pointer">
                    Formato de Descarga
                    <select
                      className="glass-input-light p-3 rounded-xl text-sm font-semibold cursor-pointer"
                      value={reportFormat}
                      onChange={(e) => setReportFormat(e.target.value as 'pdf' | 'xlsx')}
                      required
                    >
                      <option value="pdf">Documento PDF (.pdf)</option>
                      <option value="xlsx">Hoja de Cálculo Excel (.xlsx)</option>
                    </select>
                  </label>
                </div>

                {downloadSuccess && (
                  <p className="form-success bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle size={18} weight="fill" className="text-green-600" />
                    {downloadSuccess}
                  </p>
                )}

                {downloadError && (
                  <p className="form-error bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl font-bold flex items-center gap-2">
                    <Warning size={18} weight="fill" className="text-red-600" />
                    {downloadError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={generateReportMutation.isPending}
                  className="button button-primary bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm px-6 py-3 font-bold flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {generateReportMutation.isPending ? (
                    <>
                      <SpinnerGap className="spin" size={16} /> Generando Reporte...
                    </>
                  ) : (
                    <>
                      <Download size={16} weight="bold" /> Generar Reporte
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
