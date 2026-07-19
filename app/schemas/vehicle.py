from pydantic import BaseModel, ConfigDict


class VehicleCreateRequest(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    make: str
    model: str
    category: str
    price: float
    quantity: int
