from app.domain.vehicle import Vehicle
from app.repositories.models import VehicleModel


class VehicleRepository:
    def __init__(self, db):
        self.db = db

    def add(self, vehicle):
        model = VehicleModel(
            make=vehicle.make,
            model=vehicle.model,
            category=vehicle.category,
            price=vehicle.price,
            quantity=vehicle.quantity,
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_domain(model)

    def list_all(self):
        models = self.db.query(VehicleModel).all()
        return [self._to_domain(model) for model in models]

    def _to_domain(self, model):
        return Vehicle(
            id=model.id,
            make=model.make,
            model=model.model,
            category=model.category,
            price=model.price,
            quantity=model.quantity,
        )
