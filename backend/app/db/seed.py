from decimal import Decimal

from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.rental_package import RentalPackage
from app.models.service import Service

SERVICES = [
    "Alberca",
    "Asador",
    "Cocina",
    "Refrigerador",
    "Planta baja refrigerada",
    "Planta alta refrigerada",
]


PACKAGES = [
    {
        "code": "PKG-001",
        "name": "Alberca + Asador",
        "description": ("Renta de alberca y área de asador."),
        "base_price": Decimal("3000.00"),
        "duration_hours": 8,
        "services": [
            "Alberca",
            "Asador",
        ],
    },
    {
        "code": "PKG-002",
        "name": "Planta Baja Refrigerada",
        "description": ("Alberca, asador y planta baja refrigerada."),
        "base_price": Decimal("4500.00"),
        "duration_hours": 8,
        "services": [
            "Alberca",
            "Asador",
            "Planta baja refrigerada",
        ],
    },
    {
        "code": "PKG-003",
        "name": "Villa Imperial Completo",
        "description": ("Alberca, asador, planta baja y planta alta refrigeradas."),
        "base_price": Decimal("6000.00"),
        "duration_hours": 8,
        "services": [
            "Alberca",
            "Asador",
            "Planta baja refrigerada",
            "Planta alta refrigerada",
        ],
    },
]


def seed_database():
    with SessionLocal() as db:
        service_map = {}

        for service_name in SERVICES:
            service = db.scalar(select(Service).where(Service.name == service_name))

            if service is None:
                service = Service(
                    name=service_name,
                )

                db.add(service)
                db.flush()

            service_map[service_name] = service

        for package_data in PACKAGES:
            package = db.scalar(
                select(RentalPackage).where(RentalPackage.code == package_data["code"])
            )

            if package is None:
                package = RentalPackage(
                    code=package_data["code"],
                    name=package_data["name"],
                    description=package_data["description"],
                    base_price=package_data["base_price"],
                    duration_hours=package_data["duration_hours"],
                )

                package.services = [
                    service_map[name] for name in package_data["services"]
                ]

                db.add(package)

        db.commit()

        print("Villa Imperial: datos iniciales cargados correctamente.")


if __name__ == "__main__":
    seed_database()
