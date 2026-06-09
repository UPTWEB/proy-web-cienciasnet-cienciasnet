import { apiClient } from '@/lib/api/client'
import type { Page } from '@/features/phase-one/types'
import type {
  Ranking,
  GenerateAcademicReportInput,
  SetAssessmentClosureInput,
  CorrectResultInput
} from './types'

const data = <T>(response: { data: { data: T } }) => response.data.data

export async function publishAssessment(assessmentId: string, idempotencyKey?: string): Promise<{ id: string }> {
  const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined
  return data(await apiClient.post(`/api/v1/assessments/${assessmentId}/publication`, {}, { headers }))
}

export async function setAssessmentClosure(
  assessmentId: string,
  input: SetAssessmentClosureInput
): Promise<{ id: string }> {
  return data(await apiClient.put(`/api/v1/assessments/${assessmentId}/closure`, input))
}

export async function correctPublishedResult(
  resultId: string,
  input: CorrectResultInput
): Promise<{ id: string }> {
  return data(await apiClient.post(`/api/v1/assessment-results/${resultId}/corrections`, input))
}

export async function listRankings(params?: {
  page?: number
  per_page?: number
  student_id?: string
}): Promise<Page<Ranking>> {
  return (await apiClient.get<Page<Ranking>>('/api/v1/rankings', { params })).data
}

export async function generateAcademicReport(
  input: GenerateAcademicReportInput,
  idempotencyKey?: string
): Promise<{ id: string }> {
  const headers = idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined
  return data(await apiClient.post('/api/v1/academic-reports', input, { headers }))
}
