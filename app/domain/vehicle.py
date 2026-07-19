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
            raise ValueError("Price cannot be negative.")

        if quantity < 0:
            raise ValueError("Quantity cannot be negative.")

        self.id = id
        self.make = make
        self.model = model
        self.category = category
        self.price = price
        self.quantity = quantity