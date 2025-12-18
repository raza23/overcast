<!--
SYNC IMPACT REPORT
==================
Version Change: INITIAL → 1.0.0
Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (5 principles)
  - Code Quality Standards
  - Development Workflow
  - Governance
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - reviewed, Constitution Check section aligns
  ✅ spec-template.md - reviewed, requirements structure aligns
  ✅ tasks-template.md - reviewed, task organization aligns
Follow-up TODOs: None
-->

# Overcast Constitution

## Core Principles

### I. Simplicity First

Code MUST prioritize readability and maintainability over cleverness. Every solution MUST be the simplest approach that solves the problem. Complex patterns (repositories, factories, dependency injection containers) are FORBIDDEN unless explicitly justified in writing with documented alternatives that were rejected.

**Rationale**: The project targets newcomers to full-stack development. Code that is easy to read, understand, and modify reduces onboarding time and prevents bugs. Simple code is easier to debug, test, and extend.

### II. Single-File Organization

Related functionality MUST be consolidated into single files wherever practical. Creating multiple files for organizational purposes alone is FORBIDDEN. File splitting is ONLY permitted when:
- A single file exceeds 500 lines of substantive code (excluding comments)
- Clear functional boundaries exist (e.g., API routes vs. UI components)
- Reusability across multiple features is demonstrated

**Rationale**: Excessive file fragmentation forces developers to jump between files to understand functionality, increasing cognitive load. Single-file organization keeps related code together, making it easier to understand the full context of a feature.

### III. Comment-Driven Development (NON-NEGOTIABLE)

Every function, component, and non-trivial code block MUST include comments explaining:
- **What** it does (purpose)
- **Why** it exists (business/technical rationale)
- **How** it works (for non-obvious implementations)

Comments MUST be written for a reader with basic JavaScript/TypeScript knowledge but limited full-stack experience.

**Rationale**: Comments serve as inline documentation for newcomers. They explain not just the mechanics but the reasoning, helping developers understand the "why" behind decisions. This is critical for learning and maintaining the codebase.

### IV. Clean Code Standards

Code MUST follow these non-negotiable standards:
- Descriptive variable and function names (no abbreviations except common conventions like `id`, `url`)
- Maximum function length: 50 lines (excluding comments)
- Maximum nesting depth: 3 levels
- No magic numbers or strings (use named constants)
- Consistent formatting via automated tools (Prettier, ESLint)

**Rationale**: Clean code standards reduce the mental effort required to understand code. Descriptive names eliminate guesswork, short functions are easier to test and understand, and shallow nesting prevents complexity.

### V. Next.js Best Practices

Development MUST follow Next.js conventions and best practices:
- Use App Router (not Pages Router)
- Server Components by default, Client Components only when needed (`'use client'`)
- File-based routing in `app/` directory
- API routes in `app/api/` directory
- TypeScript for type safety
- Tailwind CSS for styling (utility-first approach)

**Rationale**: Following framework conventions reduces decision fatigue and ensures the codebase remains maintainable as Next.js evolves. It also makes it easier for newcomers to find resources and examples online.

## Code Quality Standards

### Documentation Requirements

- Every new feature MUST include inline comments explaining its purpose
- Complex algorithms or business logic MUST include step-by-step explanations
- API endpoints MUST document expected inputs, outputs, and error cases
- React components MUST document props and their purposes

### Type Safety

- TypeScript strict mode MUST be enabled
- `any` type is FORBIDDEN (use `unknown` with type guards if necessary)
- All function parameters and return types MUST be explicitly typed
- Interfaces MUST be preferred over type aliases for object shapes

### Error Handling

- All async operations MUST include error handling
- User-facing errors MUST be clear and actionable
- Technical errors MUST be logged with sufficient context for debugging
- Never fail silently (no empty catch blocks)

### Performance Considerations

- Images MUST use Next.js Image component for optimization
- Client-side JavaScript MUST be minimized (prefer Server Components)
- Database queries MUST be reviewed for N+1 problems
- Loading states MUST be implemented for async operations

## Development Workflow

### Feature Development Process

1. **Specification**: Write clear user stories and acceptance criteria
2. **Design**: Plan component structure and data flow (document in comments)
3. **Implementation**: Write code with inline comments explaining decisions
4. **Review**: Self-review for simplicity, clarity, and adherence to principles
5. **Testing**: Manual testing of all user scenarios
6. **Documentation**: Update README or relevant docs if needed

### Code Review Standards

All code changes MUST be reviewed for:
- Adherence to Simplicity First principle
- Presence and quality of comments
- Compliance with Clean Code Standards
- Proper use of Next.js patterns
- Type safety and error handling

### Refactoring Guidelines

Refactoring is REQUIRED when:
- A file exceeds 500 lines
- A function exceeds 50 lines
- Nesting depth exceeds 3 levels
- Code is duplicated in 3+ places

Refactoring MUST maintain or improve code clarity. Refactoring that introduces complexity without clear benefit is FORBIDDEN.

## Governance

### Amendment Process

This constitution can be amended when:
1. A principle is consistently blocking productivity without clear benefit
2. New framework capabilities make a principle obsolete
3. Team consensus identifies a missing critical principle

Amendments MUST:
- Be documented with rationale
- Include migration plan for existing code (if applicable)
- Be approved by project lead or team consensus
- Increment version number appropriately

### Versioning Policy

- **MAJOR** (X.0.0): Removal or fundamental redefinition of a core principle
- **MINOR** (1.X.0): Addition of new principle or major section
- **PATCH** (1.0.X): Clarifications, wording improvements, non-semantic changes

### Compliance Review

- All pull requests MUST verify compliance with this constitution
- Violations MUST be justified in writing or corrected before merge
- Complexity that violates Simplicity First MUST be documented in plan.md Complexity Tracking section
- Regular audits (monthly) MUST identify and address technical debt violating these principles

### Enforcement

- Automated linting enforces Clean Code Standards where possible
- Code review process enforces comment requirements and simplicity
- Project lead has final authority on principle interpretation
- Repeated violations require team discussion and potential constitution amendment

**Version**: 1.0.0 | **Ratified**: 2025-12-16 | **Last Amended**: 2025-12-16
