import type { ReactNode } from 'react'
import { OperationalState } from './OperationalState'

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  isLoading,
  error,
}: {
  rows?: T[]
  columns: Array<{ label: string; render: (row: T) => ReactNode }>
  isLoading: boolean
  error: Error | null
}) {
  if (isLoading) return <OperationalState state="loading" title="Cargando" message="Consultando información actualizada." />
  if (error) return <OperationalState state="error" title="No se pudo cargar" message={error.message} />
  if (!rows?.length) return <OperationalState state="empty" title="Sin registros" message="Aún no hay información para mostrar." />

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead><tr>{columns.map((column) => <th key={column.label}>{column.label}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.label}>{column.render(row)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
