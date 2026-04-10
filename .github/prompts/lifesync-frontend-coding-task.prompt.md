---
mode: agent
description: Execute a generic frontend coding task in LifeSync UI
tools: ['codebase', 'editFiles', 'search', 'runCommands', 'githubRepo']
---

Execute the following frontend task in LifeSync:
**${input:task}**

Requirements:
1. Apply `lifesync-frontend-agent-core` and `lifesync-frontend-coding-assistant`.
2. Keep code changes in `UI/`.
3. For integration-related work, inspect matching endpoint contracts in `API/`.
4. Follow existing Angular routing/component/service/interceptor conventions.
5. Build UI and provide a short changelog of implemented work.

