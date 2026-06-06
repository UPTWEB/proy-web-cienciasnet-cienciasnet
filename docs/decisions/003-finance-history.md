# ADR-003: Finanzas e Históricos

**Estado:** Aceptado

- No existen pagos parciales en V1.
- Cada deuda se paga en una operación completa.
- Pronto pago depende de una fecha límite configurable.
- La cuenta específica con `gestionar_finanzas` puede ajustar deudas pendientes con motivo y auditoría.
- Deudas pagadas/anuladas y movimientos históricos son inmutables.

Permanece pendiente decidir si la entidad histórica `pagos` se renombrará a `obligaciones_pago` antes de las migraciones.

