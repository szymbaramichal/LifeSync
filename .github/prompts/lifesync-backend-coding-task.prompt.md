---
mode: agent
description: Execute a generic backend coding task in LifeSync API
---

You are working on the LifeSync backend.
Execute the specific task provided by the user in this conversation.

Requirements:
1. Apply `lifesync-backend-agent-core` and `lifesync-backend-coding-assistant`.
2. Keep code changes in `API/` unless explicitly required for integration context.
3. Follow existing endpoint/handler/auth/DTO conventions.
4. Provide a short changelog of implemented work.
5. You shouldn't execute any `cd` command - work from root directory as it is.
