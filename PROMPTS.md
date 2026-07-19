# PROMPTS.md — AI Usage Log

Log of AI (Claude Code) usage for this assignment. Prompts are recorded
verbatim, in order, each with one line on what was produced.

### 1.
> Create a file called primary_rules.md. This is our working agreement for this
> project — you'll follow it for every task in this repo.
>
> Start it with these rules:
>
>
> Work on ONE step at a time. Stop after each step and wait for me.
> Never create files I didn't explicitly ask for.
> Never run ahead to the next feature, even if it seems obvious.
> If you think I'm making a mistake, say so before writing code.
>
>
> Don't write any other code yet.

Produced: created `primary_rules.md` with the four listed rules, nothing else.

### 2.
> Append to primary_rules.md:
>
>
> I write every test myself. Do not write tests unless I explicitly ask.
> I write every domain entity and every domain method myself. Do not write
> domain code.
> You write: project scaffolding, config, ORM mappings, repository bodies,
> route wiring, pydantic schemas, and React components — only when asked, and
> only for the current step.

Produced: appended the division-of-labor rules to `primary_rules.md`.

### 3.
> Append to primary_rules.md:
>
>
> This project uses four layers: domain → services → adapters (api/,
> repositories/) → UI.
> Directory structure: app/domain/, app/services/, app/repositories/,
> app/api/, app/schemas/.

Produced: appended the layer/directory-structure rules to `primary_rules.md`.

### 4.
> Append to primary_rules.md:
>
>
> Dependencies point inward: adapters depend on services, services depend on
> domain. Never the reverse.
> app/domain/ imports NOTHING except the Python standard library. No FastAPI,
> no SQLAlchemy, no pydantic. If you need one of those in a domain file, stop
> and tell me — the design is wrong.

Produced: appended the dependency-direction rule to `primary_rules.md`.

### 5.
> Append to primary_rules.md:
>
>
> Business rules and invariants live as methods on domain entities — e.g.
> Vehicle.purchase() raises OutOfStockError when quantity is zero.
> Never put a business rule in a route handler, a service, or a serializer.
> Domain entities raise plain Python domain exceptions, never HTTP exceptions

Produced: appended the business-rules-live-on-entities rule to `primary_rules.md`.

### 6.
> Append to primary_rules.md:
>
>
> Domain methods mutate in-memory state only. They never call save() or touch
> a database session.
> Persistence is the service layer's responsibility.

Produced: appended the in-memory-only domain mutation rule to `primary_rules.md`.

### 7.
> Append to primary_rules.md:
>
>
> Services orchestrate a use case: load the entity, call its domain method,
> persist the result. That's all.
> Services contain no business rules and no HTTP concepts. They never build
> responses or status codes.

Produced: appended the service-orchestration rule to `primary_rules.md`.

### 8.
> Append to primary_rules.md:
>
>
> Routes are thin translators: parse the request, call a service, map the
> result or exception to an HTTP response. No calculations, no rules, no
> direct model mutations.
> Domain-error-to-HTTP-status mapping lives in ONE centralized exception
> handler, not repeated per route.

Produced: appended the thin-routes / centralized-exception-handler rule to `primary_rules.md`.

### 9.
> Append to primary_rules.md:
>
>
> Authorization is enforced by a reusable dependency (e.g. require_admin),
> never an inline if user.role == "admin" inside a handler.
> 401 means unauthenticated. 403 means authenticated but not permitted. Don't
> conflate them.

Produced: appended the authorization/401-vs-403 rule to `primary_rules.md`.

### 10.
> Append to primary_rules.md:
>
>
> All configuration comes from environment variables via pydantic-settings.
> Nothing hardcoded — no URLs, no secrets, no connection strings.
> DATABASE_URL drives the engine: SQLite for local and tests, Postgres in
> production. Use only standard SQLAlchemy constructs — no SQLite-specific SQL.
> CORS origins come from an environment variable, never a hardcoded localhost URL.
> Alembic migrations from the first table onward.

Produced: appended the configuration/environment-variable rules to `primary_rules.md`.

### 11.
> Append to primary_rules.md:
>
>
> Backend: Python 3.11+, FastAPI, SQLAlchemy 2.x, Alembic, pytest,
> python-jose, passlib[bcrypt], pydantic v2 + pydantic-settings.
> Frontend: React 18 + TypeScript + Vite, Tailwind, Vitest + React Testing Library.

Produced: appended the backend/frontend tech-stack list to `primary_rules.md`.

### 12.
> Create a CLAUDE.md containing only:
>
> Always follow the working agreement in @primary_rules.md.
>
> Then read primary_rules.md back to me and tell me: which parts of this build
> will you NOT write?

Produced: created `CLAUDE.md` with only the specified line; read `primary_rules.md` back in full; answered that tests and domain entities/methods are the parts not written by AI.

### 13.
> I've added ASSIGNMENT.md — the original requirements.
>
> Append to primary_rules.md: "ASSIGNMENT.md is context ONLY. Never implement
> anything from it that I haven't explicitly asked for in the current step."
>
> Don't read it as a work order.

Produced: appended the ASSIGNMENT.md-is-context-only rule to `primary_rules.md`. Did not open or read `ASSIGNMENT.md`.

### 14.
> Create PROMPTS.md in the project root — an AI usage log for this assignment,
> which requires full transparency about AI assistance.
>
> Then backfill it with everything from this session so far:
>
> 1. Go back through our conversation from the beginning.
> 2. Log every prompt I gave you, verbatim — don't clean up my wording,
>    condense it, or improve it. The raw phrasing is the evidence.
> 3. For each one, record in one line what you produced and what I did with it
>    (accepted / rejected / corrected / partially used).
> 4. Mark with ⚠️ any exchange where I rejected, corrected, or overruled your
>    output, and record my actual stated reason — not a flattering version.
> 5. Where I wrote something by hand rather than asking you, add a
>    "(no prompt)" entry noting what I wrote and why I didn't delegate it.
>    If you're not sure whether I wrote something by hand, ask me — don't guess.
> 6. Organize under a "## Phase 0" heading.
>
> Do not invent, embellish, or fill gaps. If you don't have a record of
> something, leave it out and tell me what's missing.
>
> From here on, append a new entry after every exchange where you generate
> code, and every time I push back on something you produced.

Produced: created `PROMPTS.md` with entries 1–13 backfilled under a "## Phase 0"
heading, plus notes on missing ⚠️ entries and a "(no prompt)" entry for
ASSIGNMENT.md. That file is no longer present on disk as of prompt 15 below.

### 15.
> Create PROMPTS.md in the project root — a log of AI usage for this assignment.
>
> Backfill it with every prompt I've given you this session, verbatim and in
> order, each with one line on what you produced. Don't invent anything.
>
> Then append each new prompt as we go.

Produced: found the prior `PROMPTS.md` was missing from disk; asked you how to
proceed rather than silently recreating it; you chose "Recreate it fresh"; this
file is that recreation, in the simpler format requested here (no ⚠️ marks or
"(no prompt)" entries this time, since those weren't asked for in this prompt).

### 16.
> Create the directory structure and empty __init__.py files for:
> app/domain/, app/services/, app/repositories/, app/api/, app/schemas/,
> tests/unit/, tests/service/, tests/api/
>
> Plus requirements.txt (fastapi, uvicorn, sqlalchemy, alembic, pytest, httpx,
> python-jose, passlib[bcrypt], pydantic-settings), pytest.ini pointing at
> tests/, and ruff + black config in pyproject.toml.
>
> No application code yet.

Produced: created the 8 listed directories with empty `__init__.py` files;
created `requirements.txt` with the 9 listed packages; `pytest.ini` with
`testpaths = tests`; `pyproject.toml` with `[tool.ruff]` and `[tool.black]`
sections (line-length 88). No application code written.

### 17.
> Set up the config and database connection.
>
> Create app/config.py using pydantic-settings. Read these environment variables:
> - DATABASE_URL (default: sqlite:///./dealership.db)
> - SECRET_KEY
> - CORS_ORIGINS
>
> Create app/db.py with a SQLAlchemy engine and session factory using DATABASE_URL from the config. Add a get_db function that provides a database session and closes it afterward.
>
> Keep the database configuration generic. Do not use SQLite-specific code so it can work with PostgreSQL later.
>
> Configure Alembic to use the same DATABASE_URL from the application config.
>
> Create a .env.example file with:
> - DATABASE_URL
> - SECRET_KEY
> - CORS_ORIGINS
>
> Add .env to .gitignore.
>
> Do not create any models, tables, or migrations yet.

Produced: `app/config.py` (pydantic-settings `Settings` class); `app/db.py`
(generic `create_engine`, `SessionLocal`, `get_db()`, no SQLite-specific
args); hand-written `alembic.ini`, `alembic/env.py` (reads
`settings.DATABASE_URL`), `alembic/script.py.mako` (alembic CLI wasn't
installed, so scaffolded by hand); `.env.example`; new `.gitignore` with
`.env`. Syntax-checked via `py_compile` only — dependencies aren't installed
yet so imports weren't runtime-verified. No models, tables, or migrations
created.

### 18.
> pip install -r requirements.txt

Produced: ran the install; `alembic`, `httpx`, `pydantic-settings`, `Mako`,
`httpcore` were newly installed, rest already present. Flagged an unrelated
pip warning about a corrupted `~ip` distribution in site-packages.

### 19.
> The tests in tests/api/test_health.py are failing because there's no
> client fixture and no app yet. Write just enough to make them pass.
>
> Create app/main.py with:
> - a function that builds and returns the FastAPI app
> - GET /health returning {"status": "ok"} — no database
> - GET /health/ready that runs SELECT 1 using get_db, then returns
>   {"status": "ok", "database": "ok"}. If the database fails, return 503
>   with {"status": "error", "database": "unreachable"}
>
> Add a client fixture in tests/conftest.py using FastAPI's TestClient with
> a temporary SQLite database.
>
> Set up CORS using CORS_ORIGINS from the config.
>
> Keep it minimal.

Produced: `app/main.py` with `create_app()` (CORS from `settings.CORS_ORIGINS`,
`/health`, `/health/ready`) and module-level `app = create_app()`;
`tests/conftest.py` with a `client` fixture (per-test temp SQLite file via
`tmp_path`, `get_db` overridden via `app.dependency_overrides`). Flagged that
`SECRET_KEY`/`CORS_ORIGINS` have no defaults and no `.env` exists yet, so set
them as env-var defaults inside `conftest.py` rather than creating a `.env`
file. Ran `pytest tests/api/test_health.py` — both tests pass. Did not touch
the test file itself.

### 20. ⚠️
> The tests in tests/unit/test_security.py are failing. Write app/security.py
> with hash_password and verify_password using passlib with bcrypt.
>
> Keep it minimal — just those two functions.

Before writing code: flagged that `.env.example` (not gitignored) contained a
real-looking Neon Postgres connection string and a real-looking `SECRET_KEY`
instead of placeholders, and asked how to handle it. Reason given: "They're
real — I'll fix it" — the human owns rotating/replacing those values; I left
`.env.example` untouched. Then produced: `app/security.py` with
`hash_password`/`verify_password` via `passlib.context.CryptContext(["bcrypt"])`,
nothing else. Ran `pytest tests/unit/test_security.py` — both tests pass.
Marked ⚠️ because this was a stop-and-flag exchange, not a straight accept,
though the flagged issue was in a config file, not in AI-generated code.

### 21.
> The token tests in tests/unit/test_security.py are failing. Add create_token
> and decode_token to app/security.py using python-jose.
>
> create_token takes user_id and role, and returns a signed JWT.
> decode_token takes a token and returns the data back.
>
> Use SECRET_KEY from the config. Give tokens an expiry time.
>
> Keep it minimal.

Produced: added `create_token(user_id, role)` / `decode_token(token)` to
`app/security.py` using `jose.jwt.encode`/`decode`, HS256, `settings.SECRET_KEY`,
30-minute `exp` claim. Ran `pytest tests/unit/test_security.py` — all 4 tests
pass.

### 22. ⚠️
> The tests in tests/service/test_auth_service.py are failing.
>
> Create app/domain/errors.py with a DuplicateEmailError exception. It should
> be a plain Python exception — no FastAPI imports.
>
> Create app/services/auth_service.py with an AuthService class. It takes a
> user repository in __init__. Give it a register method that:
> - checks if the email already exists, and raises DuplicateEmailError if so
> - hashes the password using hash_password from app.security
> - creates a User with role "user"
> - saves it through the repository and returns it
>
> Keep it minimal.

Produced: `app/domain/errors.py` (`DuplicateEmailError(Exception)`, plain
Python, no FastAPI); `app/services/auth_service.py` (`AuthService` wrapping a
user repository, `register()` checks `get_by_email`, raises
`DuplicateEmailError`, else hashes password via `hash_password` and builds a
`User(role="user")` from the pre-existing `app/domain/user.py`, saves via
`repository.add`). Ran `pytest tests/service/test_auth_service.py`:
`test_register_rejects_duplicate_email` passes;
`test_register_creates_user_with_hashed_password` fails with
`NameError: name 'service' is not defined` — a bug in the test itself (only
`auth_service` was assigned, never `service`), unrelated to the service code.
Flagged this rather than editing the test. Marked ⚠️ since it surfaces a defect
in human-owned test code, not a correction of AI output.

### 23.
> The login tests in tests/service/test_auth_service.py are failing, so please implement the missing login functionality.
>
> Update app/domain/errors.py and add a new InvalidCredentialsError exception.
>
> In app/services/auth_service.py, add a login method to AuthService that:
> - gets the user using the email
> - raises InvalidCredentialsError if the user is not found
> - verifies the password using verify_password from app.security
> - raises InvalidCredentialsError if the password does not match
> - creates and returns an authentication token using create_token with the user's id and role
>
> Keep the implementation simple and only add what is needed for the tests to pass.

Produced: added `InvalidCredentialsError(Exception)` to `app/domain/errors.py`;
added `login(email, password)` to `AuthService` (raises `InvalidCredentialsError`
on unknown email or bad password via `verify_password`, else returns
`create_token(user_id=user.id, role=user.role)`). Noted the earlier `service`
typo in the test file (entry 22) has since been fixed on the human's side. Ran
`pytest tests/service/test_auth_service.py` — all 5 tests pass.
