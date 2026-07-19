from pydantic import BaseModel, ConfigDict


class VehicleCreateRequest(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


class VehicleUpdateRequest(BaseModel):
    make: str | None = None
    model: str | None = None
    category: str | None = None
    price: float | None = None


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    make: str
    model: str
    category: str
    price: float
    quantity: int
