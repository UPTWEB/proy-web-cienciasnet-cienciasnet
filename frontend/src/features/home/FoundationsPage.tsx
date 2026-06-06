import { OperationalState } from '@/components/shared/OperationalState'

export function FoundationsPage({ context }: { context: string }) {
  return (
    <section className="page-stack">
      <div><span className="eyebrow">Fundación ejecutable</span><h1>{context}</h1><p>Este layout está preparado para las capacidades del producto.</p></div>
      <div className="state-grid">
        <OperationalState state="loading" title="Cargando" message="Preparando información actualizada." />
        <OperationalState state="empty" title="Sin resultados" message="No existen registros para mostrar." />
        <OperationalState state="error" title="No se pudo cargar" message="Intenta nuevamente en unos segundos." />
        <OperationalState state="forbidden" title="Sin permiso" message="Tu cuenta no puede consultar este recurso." />
      </div>
    </section>
  )
}
