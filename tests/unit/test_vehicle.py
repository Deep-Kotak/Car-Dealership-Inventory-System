import pytest

from app.domain.errors import OutOfStockError
from app.domain.vehicle import Vehicle
from app.domain.errors import InvalidRestockError


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


def test_update_changes_vehicle_details():
    vehicle = Vehicle(
        make="Toyota",
        model="Corolla",
        category="sedan",
        price=20000,
        quantity=3,
    )

    vehicle.update_details(
        price=18000,
        category="hatchback",
    )

    assert vehicle.price == 18000
    assert vehicle.category == "hatchback"
    assert vehicle.make == "Toyota"


def test_update_does_not_change_quantity():
    vehicle = Vehicle(
        make="Toyota",
        model="Corolla",
        category="sedan",
        price=20000,
        quantity=3,
    )

    vehicle.update_details(
        price=18000,
    )

    assert vehicle.quantity == 3


def test_update_rejects_negative_price():
    vehicle = Vehicle(
        make="Toyota",
        model="Corolla",
        category="sedan",
        price=20000,
        quantity=3,
    )

    with pytest.raises(ValueError):
        vehicle.update_details(
            price=-500,
        )

def test_purchase_reduces_stock_by_one():
    vehicle = Vehicle(
        make="Toyota",
        model="Corolla",
        category="sedan",
        price=20000,
        quantity=3,
    )

    vehicle.purchase()

    assert vehicle.quantity == 2


def test_cannot_purchase_when_out_of_stock():
    vehicle = Vehicle(
        make="Toyota",
        model="Corolla",
        category="sedan",
        price=20000,
        quantity=0,
    )

    with pytest.raises(OutOfStockError):
        vehicle.purchase()

from app.domain.errors import InvalidRestockError


def test_restock_increases_stock():
    vehicle = Vehicle(
        make="Toyota",
        model="Corolla",
        category="sedan",
        price=20000,
        quantity=2,
    )

    vehicle.restock(5)

    assert vehicle.quantity == 7


def test_restock_amount_must_be_positive():
    vehicle = Vehicle(
        make="Toyota",
        model="Corolla",
        category="sedan",
        price=20000,
        quantity=2,
    )

    with pytest.raises(InvalidRestockError):
        vehicle.restock(0)