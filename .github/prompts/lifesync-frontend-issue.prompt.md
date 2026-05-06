---
mode: agent
description: Implement a frontend GitHub issue in LifeSync UI
---

You are working on the LifeSync frontend.
Implement the specific task provided by the user in this conversation.

Requirements:
1. Use GitHub data (issue details and comments) to extract acceptance criteria.
2. Apply `lifesync-frontend-agent-core` and `lifesync-frontend-issue-implementation` skills.
3. Limit all code changes to `UI/`.
4. For integration-related work, inspect matching endpoint paths and contracts in `API/` and align UI service calls, payloads, and handling to backend reality.
5. Follow existing Angular routing/component/service/interceptor conventions.
6. Build UI and provide a short changelog linked to the issue number.
7. You shouldn't execute any `cd` command - work from root directory as it is.
