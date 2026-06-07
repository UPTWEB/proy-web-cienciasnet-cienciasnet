import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DataTable } from '@/components/shared/DataTable'
import { getApiError } from '@/lib/api/client'
import { createFamilyLink, listFamilyLinks, removeFamilyLink } from './api'

const schema = z.object({
  parent_account_id: z.uuid(),
  student_id: z.uuid(),
  relationship: z.enum(['padre', 'madre', 'apoderado']),
})
type Form = z.infer<typeof schema>

export function FamilyAdminPage() {
  const client = useQueryClient()
  const links = useQuery({ queryKey: ['family-links'], queryFn: listFamilyLinks })
  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { parent_account_id: '', student_id: '', relationship: 'padre' } })
  const invalidate = async () => client.invalidateQueries({ queryKey: ['family-links'] })
  const create = useMutation({ mutationFn: createFamilyLink, onSuccess: async () => { form.reset(); await invalidate() } })
  const remove = useMutation({ mutationFn: removeFamilyLink, onSuccess: invalidate })

  return (
    <section className="page-stack">
      <header><p className="eyebrow">Familias</p><h1>Vínculos familiares</h1><p>Relaciona cuentas de padres con uno o varios alumnos. No existe autorregistro.</p></header>
      <form className="panel form-grid" onSubmit={form.handleSubmit((values) => create.mutate(values))}>
        <h2>Nuevo vínculo</h2>
        <label>ID de cuenta padre<input {...form.register('parent_account_id')} /></label>
        <label>ID de alumno<input {...form.register('student_id')} /></label>
        <label>Relación<select {...form.register('relationship')}><option>padre</option><option>madre</option><option>apoderado</option></select></label>
        <button className="button button-primary" disabled={create.isPending}>Vincular</button>
        {create.error && <p className="form-error">{getApiError(create.error).message}</p>}
      </form>
      <div className="panel">
        <DataTable rows={links.data?.data} isLoading={links.isLoading} error={links.error} columns={[
          { label: 'Alumno', render: (link) => link.student_name },
          { label: 'Familiar', render: (link) => link.parent_name },
          { label: 'Relación', render: (link) => link.relationship },
          { label: 'Acción', render: (link) => <button className="button button-secondary" onClick={() => confirm('¿Retirar este vínculo? La acción quedará auditada.') && remove.mutate(link.id)}>Desvincular</button> },
        ]} />
      </div>
    </section>
  )
}
