# add-academic-structure-management Specification

## Purpose
TBD - created by archiving change add-academic-structure-management. Update Purpose after archive.
## Requirements
### Requirement: 1

Coordinación SHALL gestionar estructura académica

#### Scenario: queda disponible para cargas

- GIVEN coordinador autorizado envía datos válidos
- WHEN crea la estructura
- THEN queda disponible para cargas

### Requirement: 2

Cambiar docente SHALL conservar cargas históricas

#### Scenario: la anterior conserva vigencia histórica

- GIVEN una carga vigente cambia
- WHEN se asigna nuevo docente
- THEN la anterior conserva vigencia histórica

