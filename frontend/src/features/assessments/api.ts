import { apiClient } from '@/lib/api/client'
import type { Page } from '@/features/phase-one/types'
import type { Assessment, AssessmentResult, CreateAssessmentInput, ReplaceAssessmentResultsInput } from './types'

const data = <T>(response: { data: { data: T } }) => response.data.data

export async function listAssessments(params?: {
  page?: number
  per_page?: number
  search?: string
  active?: boolean
  teaching_assignment_id?: string
}): Promise<Page<Assessment>> {
  return (await apiClient.get<Page<Assessment>>('/api/v1/assessments', { params })).data
}

export async function createAssessment(input: CreateAssessmentInput): Promise<Assessment> {
  return data(await apiClient.post('/api/v1/assessments', input))
}

export async function listAssessmentResults(assessmentId: string): Promise<Page<AssessmentResult>> {
  return (await apiClient.get<Page<AssessmentResult>>(`/api/v1/assessments/${assessmentId}/results`)).data
}

export async function replaceAssessmentResults(
  assessmentId: string,
  input: ReplaceAssessmentResultsInput,
  idempotencyKey?: string
): Promise<AssessmentResult[]> {
  const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined
  return data(await apiClient.put(`/api/v1/assessments/${assessmentId}/results`, input, { headers }))
}

export async function importAssessmentResults(
  file: File,
  idempotencyKey?: string
): Promise<{ message: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const headers = {
    'Content-Type': 'multipart/form-data',
    ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {})
  }
  return data(await apiClient.post('/api/v1/assessment-result-imports', formData, { headers }))
}
