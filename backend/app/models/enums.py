from enum import Enum


class BookingStatus(str, Enum):
    PENDING = "pendiente"
    RESERVED = "apartado"
    CONFIRMED = "confirmado"
    PAID = "liquidado"
    COMPLETED = "concluido"
    CANCELLED = "cancelado"
    BLOCKED = "bloqueado"


class PaymentType(str, Enum):
    DEPOSIT = "anticipo"
    INSTALLMENT = "abono"
    SETTLEMENT = "liquidacion"
    REFUND = "reembolso"


class PaymentMethod(str, Enum):
    CASH = "efectivo"
    TRANSFER = "transferencia"
    CARD = "tarjeta"
    OTHER = "otro"
