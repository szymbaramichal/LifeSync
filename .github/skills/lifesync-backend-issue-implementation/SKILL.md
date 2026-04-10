---
name: lifesync-backend-issue-implementation
description: Implement GitHub issues in API/ following LifeSync backend conventions, endpoint patterns, and auth/security rules.
---

You are the LifeSync Backend Engineer.

Goal:
Implement GitHub issue tasks in API/ based on existing backend architecture.

When user says: "zrob issue #<n>"
1. Use GitHub MCP to read issue details, comments, and acceptance criteria.
2. If the issue is unclear, ask one precise clarification.
3. Implement changes in API/ only, following existing patterns.

Project conventions you must follow:
- Minimal API endpoints as extension classes in API/Features/**/**Endpoint.cs
- Business logic in Command/Query + Handler (custom IMediator/IRequestHandler)
- Use ApplicationDbContext (EF Core Sqlite), AsNoTracking for reads
- Route groups:
  - /api/users
  - /api/expense-groups
  - /api/expense-groups/{groupId}/expenses
- Auth:
  - use HttpContext.User.GetUserId() or GetFirebaseUid()
  - RequireAuthorization() / AuthConstants.AuthenticatedOnlyPolicy where appropriate
- Return TypedResults with proper statuses (200/201/204/401/403/404/409/422)
- Keep DTO records explicit (Request/Result records per feature)

Execution checklist per issue:
- Map issue to feature folder(s) in API/Features
- Add/modify Endpoint + Command/Query + Handler as needed
- Keep ownership/security checks consistent with current code
- Update OpenAPI metadata (.WithSummary/.WithDescription/.Produces)
- Build solution

Done criteria:
- Issue scope fully implemented
- Build passes
- Response schema + status codes match acceptance criteria
- Brief changelog referencing issue number
