from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser, current_user, require_admin
from app.db import get_db
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.vehicle import (
    VehicleCreateRequest,
    VehicleResponse,
    VehicleRestockRequest,
    VehicleUpdateRequest,
)
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


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    payload: VehicleUpdateRequest,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    user=Depends(current_user),
):
    return vehicle_service.update(
        vehicle_id,
        make=payload.make,
        model=payload.model,
        category=payload.category,
        price=payload.price,
    )


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    vehicle_id: int,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    user: CurrentUser = Depends(require_admin),
):
    vehicle_service.delete(vehicle_id)


@router.post("/{vehicle_id}/purchase", response_model=VehicleResponse)
def purchase_vehicle(
    vehicle_id: int,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    user=Depends(current_user),
):
    return vehicle_service.purchase(vehicle_id)


@router.post("/{vehicle_id}/restock", response_model=VehicleResponse)
def restock_vehicle(
    vehicle_id: int,
    payload: VehicleRestockRequest,
    vehicle_service: VehicleService = Depends(get_vehicle_service),
    user: CurrentUser = Depends(require_admin),
):
    return vehicle_service.restock(vehicle_id, payload.amount)
