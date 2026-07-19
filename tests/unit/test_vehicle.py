import pytest

from app.domain.vehicle import Vehicle


def test_vehicle_stores_basic_details():
    vehicle = Vehicle(
        make="Toyota",
        model="Corolla",
        category="sedan",
        price=20000,
        quantity=3,
    )

    assert vehicle.make == "Toyota"
    assert vehicle.quantity == 3


def test_vehicle_rejects_negative_price():
    with pytest.raises(ValueError):
        Vehicle(
            make="Toyota",
            model="Corolla",
            category="sedan",
            price=-100,
            quantity=3,
        )


def test_vehicle_rejects_negative_quantity():
    with pytest.raises(ValueError):
        Vehicle(
            make="Toyota",
            model="Corolla",
            category="sedan",
            price=20000,
            quantity=-1,
        )