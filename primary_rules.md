# Primary Rules

Work on ONE step at a time. Stop after each step and wait for me.
Never create files I didn't explicitly ask for.
Never run ahead to the next feature, even if it seems obvious.
If you think I'm making a mistake, say so before writing code.

I write every test myself. Do not write tests unless I explicitly ask.
I write every domain entity and every domain method myself. Do not write
domain code.
You write: project scaffolding, config, ORM mappings, repository bodies,
route wiring, pydantic schemas, and React components — only when asked, and
only for the current step.

This project uses four layers: domain → services → adapters (api/,
repositories/) → UI.
Directory structure: app/domain/, app/services/, app/repositories/,
app/api/, app/schemas/.

Dependencies point inward: adapters depend on services, services depend on
domain. Never the reverse.
app/domain/ imports NOTHING except the Python standard library. No FastAPI,
no SQLAlchemy, no pydantic. If you need one of those in a domain file, stop
and tell me — the design is wrong.

Business rules and invariants live as methods on domain entities — e.g.
Vehicle.purchase() raises OutOfStockError when quantity is zero.
Never put a business rule in a route handler, a service, or a serializer.
Domain entities raise plain Python domain exceptions, never HTTP exceptions

Domain methods mutate in-memory state only. They never call save() or touch
a database session.
Persistence is the service layer's responsibility.

Services orchestrate a use case: load the entity, call its domain method,
persist the result. That's all.
Services contain no business rules and no HTTP concepts. They never build
responses or status codes.

Routes are thin translators: parse the request, call a service, map the
result or exception to an HTTP response. No calculations, no rules, no
direct model mutations.
Domain-error-to-HTTP-status mapping lives in ONE centralized exception
handler, not repeated per route.

Authorization is enforced by a reusable dependency (e.g. require_admin),
never an inline if user.role == "admin" inside a handler.
401 means unauthenticated. 403 means authenticated but not permitted. Don't
conflate them.

All configuration comes from environment variables via pydantic-settings.
Nothing hardcoded — no URLs, no secrets, no connection strings.
DATABASE_URL drives the engine: SQLite for local and tests, Postgres in
production. Use only standard SQLAlchemy constructs — no SQLite-specific SQL.
CORS origins come from an environment variable, never a hardcoded localhost URL.
Alembic migrations from the first table onward.

Backend: Python 3.11+, FastAPI, SQLAlchemy 2.x, Alembic, pytest,
python-jose, passlib[bcrypt], pydantic v2 + pydantic-settings.
Frontend: React 18 + TypeScript + Vite, Tailwind, Vitest + React Testing Library.

ASSIGNMENT.md is context ONLY. Never implement anything from it that I
haven't explicitly asked for in the current step.
