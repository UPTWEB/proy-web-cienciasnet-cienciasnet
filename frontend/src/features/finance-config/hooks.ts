import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from './api'
import type { PaymentConcept, StudentBenefit } from './types'

export function usePaymentConcepts(search = '') {
  return useQuery({
    queryKey: ['finance', 'concepts', search],
    queryFn: () => api.listPaymentConcepts(search),
  })
}

export function useCreatePaymentConcept() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<PaymentConcept>) => api.createPaymentConcept(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'concepts'] })
    },
  })
}

export function useUpdatePaymentConcept() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentConcept> }) => api.updatePaymentConcept(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'concepts'] })
    },
  })
}

export function useStudentBenefits() {
  return useQuery({
    queryKey: ['finance', 'benefits'],
    queryFn: () => api.listStudentBenefits(),
  })
}

export function useCreateStudentBenefit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<StudentBenefit>) => api.createStudentBenefit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'benefits'] })
    },
  })
}

export function useDeactivateStudentBenefit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => api.deactivateStudentBenefit(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'benefits'] })
    },
  })
}
