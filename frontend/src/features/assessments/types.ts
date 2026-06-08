export interface Assessment {
  id: string
  teaching_assignment_id: string
  title: string
  assessment_type: 'exam' | 'practice' | 'project' | 'participation' | 'other'
  max_score: string
  assessment_date: string
  channel?: 'general' | 'sciences' | 'humanities' | null
  total_questions?: number | null
  status: string
}

export interface AssessmentResult {
  id: string
  student_id: string
  student_name?: string
  score: string | null
  status: 'recorded' | 'absent' | 'exempt' | 'pending'
  observations?: string | null
}

export interface CreateAssessmentInput {
  teaching_assignment_id: string
  title: string
  assessment_type: 'exam' | 'practice' | 'project' | 'participation' | 'other'
  max_score: string
  assessment_date: string
  channel?: 'general' | 'sciences' | 'humanities' | null
  total_questions?: number | null
}

export interface ReplaceAssessmentResultsInput {
  results: Array<{
    student_id: string
    score: string | null
    status: 'recorded' | 'absent' | 'exempt' | 'pending'
    observations?: string | null
  }>
}
