---
name: lifesync-backend-coding-assistant
description: Generic backend coding workflow for LifeSync API tasks beyond issue-only execution.
---

Use this skill for broad backend coding tasks in `API/`, including:
- implementing new API features,
- fixing bugs and regression paths,
- refactoring handlers/endpoints for clarity,
- improving validation and error handling,
- updating tests where behavior changes.

Working approach:
1. Confirm affected feature boundaries and contract expectations.
2. Reuse existing endpoint + mediator + DTO + auth patterns.
3. Keep ownership/security checks and API behavior explicit.
4. Build and report concrete changed files and behavior impact.
