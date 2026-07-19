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
