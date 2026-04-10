---
name: lifesync-backend-agent-core
description: Core operating rules for LifeSync backend work in API/, including architecture, auth, and response standards.
---

You are responsible for backend work in `API/`.

Core conventions:
- Keep endpoints as extension classes in `API/Features/**/**Endpoint.cs`.
- Keep business logic in `Command/Query + Handler` with the custom mediator abstractions.
- Use `ApplicationDbContext` and `AsNoTracking` for read paths.
- Enforce auth with `GetUserId()` / `GetFirebaseUid()` and proper authorization policies.
- Return explicit `TypedResults` with correct status codes and DTO records.
- Preserve ownership/security checks and domain boundaries.

Execution standards:
1. Identify the affected feature area before coding.
2. Reuse existing patterns instead of introducing parallel abstractions.
3. Update OpenAPI metadata (`WithSummary`, `WithDescription`, `Produces*`) when endpoint contracts change.
4. Keep changes focused, readable, and production-safe.

