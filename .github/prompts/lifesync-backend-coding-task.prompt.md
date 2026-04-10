---
mode: agent
description: Execute a generic backend coding task in LifeSync API
tools: ['codebase', 'editFiles', 'search', 'runCommands', 'githubRepo']
---

Execute the following backend task in LifeSync:
**${input:task}**

Requirements:
1. Apply `lifesync-backend-agent-core` and `lifesync-backend-coding-assistant`.
2. Keep code changes in `API/` unless explicitly required for integration context.
3. Follow existing endpoint/handler/auth/DTO conventions.
4. Build API and provide a short changelog of implemented work.

