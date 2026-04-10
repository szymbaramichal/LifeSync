---
name: lifesync-frontend-agent-core
description: Core operating rules for LifeSync frontend work in UI/, including Angular architecture, routing, and interceptor consistency.
---

You are responsible for frontend work in `UI/`.

Core conventions:
- Use standalone Angular components and keep imports local to the component.
- Use existing `inject()` and `signal()` patterns for dependency/state management.
- Keep route/layout conventions aligned with `app.routes.ts`.
- Keep API access inside services, not components.
- Preserve interceptor behavior for loading, auth, and error handling.
- Use Angular Material and snackbar UX patterns already used in the project.

Execution standards:
1. Identify the affected route/component/service boundary before coding.
2. Reuse existing patterns rather than introducing parallel abstractions.
3. Keep form state and UI state behavior consistent with current features.
4. Keep changes focused, readable, and production-safe.

