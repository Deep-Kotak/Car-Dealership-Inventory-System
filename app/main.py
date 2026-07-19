from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.auth_routes import router as auth_router
from app.api.vehicle_routes import router as vehicle_router
from app.config import settings
from app.db import get_db
from app.domain.errors import DuplicateEmailError, InvalidCredentialsError, VehicleNotFoundError


def create_app() -> FastAPI:
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router)
    app.include_router(vehicle_router)

    @app.exception_handler(DuplicateEmailError)
    def handle_duplicate_email(request: Request, exc: DuplicateEmailError):
        return JSONResponse(status_code=409, content={"detail": "Email already registered"})

    @app.exception_handler(InvalidCredentialsError)
    def handle_invalid_credentials(request: Request, exc: InvalidCredentialsError):
        return JSONResponse(status_code=401, content={"detail": "Invalid credentials"})

    @app.exception_handler(VehicleNotFoundError)
    def handle_vehicle_not_found(request: Request, exc: VehicleNotFoundError):
        return JSONResponse(status_code=404, content={"detail": "Vehicle not found"})

    @app.get("/health")
    def health():
        return {"status": "ok"}

    @app.get("/health/ready")
    def health_ready(db: Session = Depends(get_db)):
        try:
            db.execute(text("SELECT 1"))
        except Exception:
            return JSONResponse(
                status_code=503,
                content={"status": "error", "database": "unreachable"},
            )
        return {"status": "ok", "database": "ok"}

    return app


app = create_app()
