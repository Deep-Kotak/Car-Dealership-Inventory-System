"""Seed the database with demo users and vehicle inventory.

Run against a local SQLite database:

    python -m scripts.seed

Run against the deployed Neon database:

    DATABASE_URL="postgresql://..." python -m scripts.seed

The script is idempotent. If the admin user already exists it exits
without writing anything, so it is safe to run more than once.
"""

from app.db import SessionLocal
from app.repositories.user_repository import UserRepository
from app.repositories.vehicle_repository import VehicleRepository
from app.services.auth_service import AuthService
from app.services.vehicle_service import VehicleService

ADMIN_EMAIL = "admin@dealership.com"
ADMIN_PASSWORD = "Admin@1234"

CUSTOMER_EMAIL = "customer@dealership.com"
CUSTOMER_PASSWORD = "Customer@1234"

# (make, model, category, price, quantity)
VEHICLES = [
    # Hatchback
    ("Maruti Suzuki", "Swift", "Hatchback", 649000, 8),
    ("Maruti Suzuki", "Baleno", "Hatchback", 712000, 5),
    ("Hyundai", "i20", "Hatchback", 745000, 4),
    ("Tata", "Altroz", "Hatchback", 689000, 6),
    ("Toyota", "Glanza", "Hatchback", 701000, 0),
    # Sedan
    ("Honda", "City", "Sedan", 1215000, 4),
    ("Hyundai", "Verna", "Sedan", 1105000, 3),
    ("Maruti Suzuki", "Ciaz", "Sedan", 963000, 2),
    ("Skoda", "Slavia", "Sedan", 1189000, 3),
    ("Volkswagen", "Virtus", "Sedan", 1156000, 1),
    # SUV
    ("Mahindra", "XUV700", "SUV", 1499000, 6),
    ("Tata", "Harrier", "SUV", 1535000, 4),
    ("Hyundai", "Creta", "SUV", 1108000, 7),
    ("Kia", "Seltos", "SUV", 1099000, 5),
    ("Mahindra", "Thar", "SUV", 1145000, 0),
    ("Toyota", "Fortuner", "SUV", 3345000, 2),
    # MUV
    ("Toyota", "Innova Crysta", "MUV", 1985000, 3),
    ("Maruti Suzuki", "Ertiga", "MUV", 899000, 5),
    ("Kia", "Carens", "MUV", 1052000, 4),
    ("Renault", "Triber", "MUV", 638000, 2),
    # Electric
    ("Tata", "Nexon EV", "Electric", 1449000, 4),
    ("MG", "ZS EV", "Electric", 1898000, 2),
    ("Hyundai", "Kona Electric", "Electric", 2379000, 1),
    ("Mahindra", "XUV400", "Electric", 1649000, 0),
    # Luxury
    ("BMW", "3 Series", "Luxury", 4525000, 2),
    ("Mercedes-Benz", "C-Class", "Luxury", 5980000, 1),
    ("Audi", "Q3", "Luxury", 4695000, 2),
    ("Volvo", "XC40", "Luxury", 4425000, 1),
    # Pickup
    ("Isuzu", "D-Max V-Cross", "Pickup", 2065000, 3),
    ("Toyota", "Hilux", "Pickup", 3040000, 2),
]


def seed():
    db = SessionLocal()

    try:
        user_repository = UserRepository(db)
        auth_service = AuthService(user_repository)

        if user_repository.get_by_email(ADMIN_EMAIL) is not None:
            print("Admin user already exists. Database looks seeded, nothing to do.")
            return

        auth_service.register(ADMIN_EMAIL, ADMIN_PASSWORD, role="admin")
        print(f"Created admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")

        auth_service.register(CUSTOMER_EMAIL, CUSTOMER_PASSWORD, role="user")
        print(f"Created customer: {CUSTOMER_EMAIL} / {CUSTOMER_PASSWORD}")

        vehicle_service = VehicleService(VehicleRepository(db))

        for make, model, category, price, quantity in VEHICLES:
            vehicle_service.create(
                make=make,
                model=model,
                category=category,
                price=price,
                quantity=quantity,
            )

        categories = sorted({vehicle[2] for vehicle in VEHICLES})
        print(f"Created {len(VEHICLES)} vehicles across {len(categories)} categories:")
        print("  " + ", ".join(categories))

    finally:
        db.close()


if __name__ == "__main__":
    seed()
