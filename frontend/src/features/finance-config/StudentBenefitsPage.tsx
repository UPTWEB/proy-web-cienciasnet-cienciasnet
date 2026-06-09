import { useState } from 'react'
import { Plus, WarningCircle } from '@phosphor-icons/react'
import { useStudentBenefits } from './hooks'
import type { StudentBenefit } from './types'
import { StudentBenefitForm } from './StudentBenefitForm'

export function StudentBenefitsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { data, isLoading, isError, error, refetch } = useStudentBenefits()

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beneficios Estudiantiles</h1>
          <p className="text-muted-foreground mt-2">Gestiona becas, descuentos y exoneraciones asignadas a los estudiantes.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus weight="bold" /> Nuevo Beneficio
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-start gap-3">
          <WarningCircle size={24} className="mt-0.5" />
          <div>
            <h3 className="font-semibold">Error al cargar beneficios</h3>
            <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Error desconocido'}</p>
            <button onClick={() => refetch()} className="mt-3 text-sm underline font-medium">Reintentar</button>
          </div>
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-500">
          <p className="text-lg">No hay beneficios asignados activos actualmente.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Estudiante ID</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Tipo</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Valor</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.data.map((benefit: StudentBenefit) => (
                <tr key={benefit.id} className={`hover:bg-gray-50 ${!benefit.active ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 font-mono text-xs">
                    {benefit.student_id.split('-')[0]}...
                    {!benefit.active && <span className="ml-2 bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">Histórico</span>}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {benefit.benefit_type === 'percentage' ? 'Descuento (%)' : benefit.benefit_type === 'fixed' ? 'Monto Fijo' : 'Exoneración'}
                  </td>
                  <td className="px-6 py-4">{benefit.value ? `${benefit.benefit_type === 'percentage' ? '%' : 'S/'} ${benefit.value}` : 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${benefit.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {benefit.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {benefit.active && <button className="text-red-600 hover:underline text-sm">Desactivar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <StudentBenefitForm 
          onSuccess={() => setIsFormOpen(false)} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  )
}
