import { useState } from 'react'
import { Plus, WarningCircle } from '@phosphor-icons/react'
import { usePaymentConcepts } from './hooks'
import type { PaymentConcept } from './types'
import { PaymentConceptForm } from './PaymentConceptForm'

export function PaymentConceptsPage() {
  const [search, setSearch] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { data, isLoading, isError, error, refetch } = usePaymentConcepts(search)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conceptos de Pago</h1>
          <p className="text-muted-foreground mt-2">Configura los conceptos de cobro, montos y periodicidad.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus weight="bold" /> Nuevo Concepto
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Buscar por código o nombre..." 
          className="border rounded-md px-4 py-2 w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            <h3 className="font-semibold">Error al cargar conceptos</h3>
            <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Error desconocido'}</p>
            <button onClick={() => refetch()} className="mt-3 text-sm underline font-medium">Reintentar</button>
          </div>
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-500">
          <p className="text-lg">No hay conceptos de pago configurados.</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">Código</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Monto</th>
                <th className="px-6 py-3 font-semibold text-gray-700">Frecuencia</th>
                <th className="px-6 py-3 font-semibold text-gray-700 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.data.map((concept: PaymentConcept) => (
                <tr key={concept.id} className={`hover:bg-gray-50 ${concept.amount === '0.00' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4 font-mono text-xs">
                    {concept.code}
                    {concept.amount === '0.00' && <span className="ml-2 bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">Histórico</span>}
                  </td>
                  <td className="px-6 py-4 font-medium">{concept.name}</td>
                  <td className="px-6 py-4">S/ {concept.amount}</td>
                  <td className="px-6 py-4 capitalize">{concept.recurrence === 'single' ? 'Único' : concept.recurrence === 'monthly' ? 'Mensual' : 'Anual'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:underline text-sm disabled:text-gray-400" disabled={concept.amount === '0.00'}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <PaymentConceptForm 
          onSuccess={() => setIsFormOpen(false)} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  )
}
