from fastapi import (
    APIRouter,
    Depends,
)

from app.api.auth import (
    router as auth_router,
)

from app.api.bookings import (
    router as bookings_router,
)

from app.api.clients import (
    router as clients_router,
)

from app.api.dashboard import (
    router as dashboard_router,
)

from app.api.expenses import (
    router as expenses_router,
)

from app.api.packages import (
    router as packages_router,
)

from app.api.payments import (
    router as payments_router,
)

from app.api.reports import (
    router as reports_router,
)

from app.api.services import (
    router as services_router,
)

from app.api.settings import (
    router as settings_router,
)

from app.core.auth import (
    get_current_user,
)

from app.api.public_site import (
    router as public_site_router,
)

api_router = APIRouter(prefix="/api")


# ============================
# RUTAS PÚBLICAS DE AUTENTICACIÓN
# ============================

api_router.include_router(auth_router)
api_router.include_router(public_site_router)


# ============================
# PANEL ADMINISTRATIVO PROTEGIDO
# ============================

admin_router = APIRouter(dependencies=[Depends(get_current_user)])


admin_router.include_router(dashboard_router)

admin_router.include_router(bookings_router)

admin_router.include_router(clients_router)

admin_router.include_router(packages_router)

admin_router.include_router(services_router)

admin_router.include_router(payments_router)

admin_router.include_router(expenses_router)

admin_router.include_router(reports_router)

admin_router.include_router(settings_router)


api_router.include_router(admin_router)
