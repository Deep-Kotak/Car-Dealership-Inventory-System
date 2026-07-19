class OutOfStockError(Exception):
    def __init__(self, vehicle_id):
        self.vehicle_id = vehicle_id
        super().__init__(f"Vehicle {vehicle_id} is out of stock")


class DuplicateEmailError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


class VehicleNotFoundError(Exception):
    pass
