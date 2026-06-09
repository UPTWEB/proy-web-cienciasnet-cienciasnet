export interface PaymentConcept {
  id: string
  code: string
  name: string
  amount: string
  due_day?: number
  recurrence?: 'single' | 'monthly' | 'annual'
  early_payment_discount?: string
  early_payment_deadline?: string
  created_at: string
  updated_at: string
}

export interface StudentBenefit {
  id: string
  student_id: string
  benefit_type: 'percentage' | 'fixed' | 'waiver'
  value: string | null
  concept_ids?: string[]
  stackable_with_early_payment: boolean
  starts_on: string
  ends_on?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Page<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
