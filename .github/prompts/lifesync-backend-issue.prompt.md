---
mode: agent
description: Implement a backend GitHub issue in LifeSync API
tools: ['codebase', 'editFiles', 'search', 'runCommands', 'githubRepo']
---

Implement backend issue **#${input:issueNumber}** in the LifeSync repository.

Requirements:
1. Use GitHub data (issue details and comments) to extract acceptance criteria.
2. Apply `lifesync-backend-agent-core` and `lifesync-backend-issue-implementation` skills.
3. Limit all code changes to `API/`.
4. Follow existing endpoint/handler/auth conventions.
5. Build API and provide a short changelog linked to the issue number.

