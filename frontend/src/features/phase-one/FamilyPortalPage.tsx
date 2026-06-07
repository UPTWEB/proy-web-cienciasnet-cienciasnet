import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { OperationalState } from '@/components/shared/OperationalState'
import { useAuth } from '@/features/auth/AuthContext'
import { getStudentSummary, listLinkedStudents } from './api'

const contextKey = 'cienciasnet:selected-student-id'

export function FamilyPortalPage() {
  const { user } = useAuth()
  const isParent = user?.roles.includes('padre') === true
  const students = useQuery({ queryKey: ['linked-students'], queryFn: listLinkedStudents, enabled: isParent })
  const [selected, setSelected] = useState(() => sessionStorage.getItem(contextKey) ?? '')
  const selectedId = selected || students.data?.[0]?.id || ''
  const summary = useQuery({ queryKey: ['student-summary', selectedId], queryFn: () => getStudentSummary(selectedId), enabled: Boolean(selectedId) })

  if (!isParent) return <OperationalState state="success" title="Contexto propio" message="Tu portal es de solo lectura y no permite cambiar a otro alumno." />

  return (
    <section className="page-stack">
      <header><p className="eyebrow">Portal familiar</p><h1>Resumen del alumno</h1><p>Consulta únicamente información de alumnos vinculados.</p></header>
      {students.isLoading && <OperationalState state="loading" title="Cargando contextos" message="Buscando alumnos vinculados." />}
      {students.error && <OperationalState state="error" title="No se pudieron cargar los contextos" message={students.error.message} />}
      {students.data && students.data.length === 0 && <OperationalState state="empty" title="Sin alumnos vinculados" message="Solicita apoyo a administración." />}
      {students.data && students.data.length > 0 && <label className="panel">Alumno<select value={selectedId} onChange={(event) => { sessionStorage.setItem(contextKey, event.target.value); setSelected(event.target.value) }}>{students.data.map((student) => <option value={student.id} key={student.id}>{student.name}</option>)}</select></label>}
      {summary.isLoading && selectedId && <OperationalState state="loading" title="Cargando resumen" message="Preparando el contexto seleccionado." />}
      {summary.error && <OperationalState state="error" title="Acceso no disponible" message="No fue posible consultar este alumno." />}
      {summary.data && <div className="state-grid">
        <article className="panel"><h2>{summary.data.name}</h2><p>Estado biométrico: <strong>{summary.data.biometric_status === 'active' ? 'Activo' : 'Inactivo'}</strong></p><small>No se muestran fotos ni datos biométricos.</small></article>
        <article className="panel"><h2>Matrículas</h2>{summary.data.enrollments.map((item) => <p key={item.id}>{item.grade} {item.section} · {item.academic_period}</p>)}</article>
      </div>}
    </section>
  )
}
