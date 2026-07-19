from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import current_user
from app.db import get_db
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle import VehicleCreateRequest, VehicleResponse
from app.services.vehicle_service import VehicleService

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


def get_vehicle_service(db: Session = Depends(get_db)) -> VehicleService:
    return VehicleService(VehicleRepository(db))


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    payload: VehicleCreateRequest,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    user=Depends(current_user),
):
    return vehicle_service.create(
        payload.make, payload.model, payload.category, payload.price, payload.quantity
    )


@router.get("/search", response_model=list[VehicleResponse])
def search_vehicles(
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    price_min: float | None = None,
    price_max: float | None = None,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    user=Depends(current_user),
):
    return vehicle_service.search(
        make=make,
        model=model,
        category=category,
        price_min=price_min,
        price_max=price_max,
    )


@router.get("", response_model=list[VehicleResponse])
def list_vehicles(
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    user=Depends(current_user),
):
    return vehicle_service.list_all()
