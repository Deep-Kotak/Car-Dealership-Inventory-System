class Vehicle:
    def __init__(
        self,
        make,
        model,
        category,
        price,
        quantity,
        id=None,
    ):
        if price < 0:
            raise ValueError("price cannot be negative")
        if quantity < 0:
            raise ValueError("quantity cannot be negative")
        self.id = id
        self.make = make
        self.model = model
        self.category = category
        self.price = price
        self.quantity = quantity

    def update_details(self, make=None, model=None, category=None, price=None):
        if price is not None:
            if price < 0:
                raise ValueError("price cannot be negative")
            self.price = price
        if make is not None:
            self.make = make
        if model is not None:
            self.model = model
        if category is not None:
            self.category = category