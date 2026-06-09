export interface Ranking {
  id: string
  assessment_id: string
  assessment_title: string
  student_id: string
  student_name: string
  score: string | null
  rank: number
  total_participants: number
}

export interface GenerateAcademicReportInput {
  report_type: 'report_card' | 'grade_summary' | 'ranking'
  format: 'pdf' | 'xlsx'
  academic_period_id: string
  section_id: string
  student_id?: string
}

export interface SetAssessmentClosureInput {
  closed: boolean
}

export interface CorrectResultInput {
  score: string
  reason: string
}
