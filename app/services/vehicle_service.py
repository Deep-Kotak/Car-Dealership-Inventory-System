from app.domain.errors import VehicleNotFoundError
from app.domain.vehicle import Vehicle


class VehicleService:
    def __init__(self, vehicle_repository):
        self.vehicle_repository = vehicle_repository

    def create(self, make, model, category, price, quantity):
        vehicle = Vehicle(
            make=make,
            model=model,
            category=category,
            price=price,
            quantity=quantity,
        )
        return self.vehicle_repository.add(vehicle)

    def list_all(self):
        return self.vehicle_repository.list_all()

    def search(self, make=None, model=None, category=None, price_min=None, price_max=None):
        return self.vehicle_repository.search(
            make=make,
            model=model,
            category=category,
            price_min=price_min,
            price_max=price_max,
        )

    def update(self, vehicle_id, make=None, model=None, category=None, price=None):
        vehicle = self.vehicle_repository.get(vehicle_id)
        if vehicle is None:
            raise VehicleNotFoundError(vehicle_id)

        vehicle.update_details(make=make, model=model, category=category, price=price)
        return self.vehicle_repository.update(vehicle)

    def delete(self, vehicle_id):
        vehicle = self.vehicle_repository.get(vehicle_id)
        if vehicle is None:
            raise VehicleNotFoundError(vehicle_id)

        self.vehicle_repository.delete(vehicle_id)

    def purchase(self, vehicle_id):
        vehicle = self.vehicle_repository.get(vehicle_id)
        if vehicle is None:
            raise VehicleNotFoundError(vehicle_id)

        vehicle.purchase()
        return self.vehicle_repository.update(vehicle)
