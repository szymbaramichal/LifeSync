---
name: lifesync-frontend-coding-assistant
description: Generic frontend coding workflow for LifeSync UI tasks beyond issue-only execution.
---

Use this skill for broad frontend coding tasks in `UI/`, including:
- implementing new screens/components/flows,
- fixing UI and integration bugs,
- refactoring components/services for maintainability,
- improving form handling and validation UX,
- updating tests where behavior changes.

Working approach:
1. Confirm route/component/service boundaries and expected UI behavior.
2. Reuse existing Angular, Material, and state-management patterns.
3. For integration tasks, verify endpoint contracts in `API/` before wiring UI calls.
4. Build and report concrete changed files and behavior impact.
