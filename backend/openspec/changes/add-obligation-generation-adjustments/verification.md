# Verification: add-obligation-generation-adjustments

## Automated and Manual Checks

**Generation & Snapshots:**
- [ ] Obligation generation creates correct snapshot values
- [ ] Snapshots are immutable after creation
- [ ] Bulk generation is all-or-nothing (transactional rollback works)
- [ ] Idempotency key prevents duplicates

**Adjustment:**
- [ ] Pending obligations can be adjusted
- [ ] Paid/voided obligations cannot be adjusted (409 Conflict)
- [ ] Reason is required and audited
- [ ] Before/after values recorded in audit_logs
- [ ] Notifications dispatched

**Authorization:**
- [ ] User without `gestionar_finanzas` receives 403
- [ ] User with permission can generate/adjust
- [ ] Permission checks enforce at controller level

**Filtering & Listing:**
- [ ] List accepts student_id filter
- [ ] List accepts concept_id filter
- [ ] List accepts estado filter
- [ ] List accepts date range filters
- [ ] Pagination works correctly

## Required Evidence

- [ ] Test output: `php artisan test tests/Feature/PaymentObligationGenerationTest.php`
- [ ] Test output: `php artisan test tests/Feature/PaymentObligationAdjustmentTest.php`
- [ ] Test output: `php artisan test tests/Feature/PaymentObligationBulkAdjustmentTest.php`
- [ ] Test output: `php artisan test tests/Feature/PaymentObligationAuthorizationTest.php`
- [ ] Scribe output: `php artisan scribe:generate`
- [ ] OpenAPI comparison: `diff docs/api/openapi.yaml backend/public/docs/openapi.yaml`
- [ ] Database EXPLAIN: Queries on obligaciones_pago with expected indexes
- [ ] Code review: Design review session with Jefferson
- [ ] All delta spec scenarios (spec.md) demonstrated in tests

## Checklist: Specification Scenarios

- [ ] 1.1 - Snapshot calculation with benefit applied
- [ ] 1.2 - Transactional rollback on generation error
- [ ] 1.3 - Idempotency key prevents duplicates
- [ ] 1.4 - Only enrolled students in period get obligations
- [ ] 2.1 - Paid obligation cannot be adjusted
- [ ] 2.2 - Voided obligation cannot be adjusted
- [ ] 3.1 - Individual adjustment with motif and audit
- [ ] 3.2 - Bulk adjustment by concept filter
- [ ] 3.3 - Permission check enforced (403 without gestionar_finanzas)
- [ ] 4.1 - Single benefit per obligation
- [ ] 4.2 - Early payment acumulation logic
- [ ] 5.1 - List filter by student and estado
- [ ] 5.2 - List filter by date range

## Results

**Pending during execution.** Evidence will be gathered as tasks complete and added below.

---

### Test Execution Results
(To be filled during Phase 4)

### Scribe vs OpenAPI Comparison
(To be filled during Phase 4)

### Database Performance Analysis
(To be filled during Phase 4)
