from getpass import getpass

from sqlalchemy import select

from app.core.security import (
    hash_password,
)

from app.db.session import (
    SessionLocal,
)

from app.models.admin_user import (
    AdminUser,
)


def create_admin():
    print("\n=== Villa Imperial ===")

    print("Creación de administrador\n")

    username = input("Usuario: ").strip().lower()

    full_name = input("Nombre completo: ").strip()

    password = getpass("Contraseña: ")

    confirmation = getpass("Confirmar contraseña: ")

    if len(username) < 3:
        print("El usuario debe tener " "al menos 3 caracteres.")

        return

    if not full_name:
        print("Debes indicar un nombre.")

        return

    if len(password) < 10:
        print("La contraseña debe tener " "al menos 10 caracteres.")

        return

    if password != confirmation:
        print("Las contraseñas no coinciden.")

        return

    with SessionLocal() as db:
        existing = db.scalar(select(AdminUser).where(AdminUser.username == username))

        if existing:
            print("Ese usuario ya existe.")

            return

        user = AdminUser(
            username=username,
            full_name=full_name,
            password_hash=(hash_password(password)),
            role="admin",
        )

        db.add(user)

        db.commit()

        print("\nAdministrador creado " "correctamente.")


if __name__ == "__main__":
    create_admin()
