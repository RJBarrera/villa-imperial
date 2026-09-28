from datetime import date
from decimal import Decimal

from app.models.rental_package import RentalPackage


def get_day_price(
    rental_package: RentalPackage,
    target_date: date,
) -> Decimal | None:
    day_of_week = target_date.weekday()

    for day_price in rental_package.day_prices:
        if day_price.day_of_week == day_of_week:
            return day_price.price

    return None


def get_active_promotion(
    rental_package: RentalPackage,
    target_date: date,
):
    promotions = [
        promotion
        for promotion in rental_package.promotions
        if (
            promotion.is_active
            and promotion.starts_on <= target_date
            and promotion.ends_on >= target_date
        )
    ]

    if not promotions:
        return None

    return max(
        promotions,
        key=lambda promotion: promotion.starts_on,
    )


def calculate_package_price(
    rental_package: RentalPackage,
    target_date: date,
) -> dict:
    day_of_week = target_date.weekday()

    day_price = get_day_price(
        rental_package,
        target_date,
    )

    regular_price = day_price if day_price is not None else rental_package.base_price

    promotion = get_active_promotion(
        rental_package,
        target_date,
    )

    if promotion is not None:
        return {
            "package_id": rental_package.id,
            "target_date": target_date,
            "day_of_week": day_of_week,
            "base_price": rental_package.base_price,
            "day_price": day_price,
            "promotional_price": (promotion.promotional_price),
            "effective_price": (promotion.promotional_price),
            "source": "promotion",
            "promotion_name": promotion.name,
        }

    if day_price is not None:
        return {
            "package_id": rental_package.id,
            "target_date": target_date,
            "day_of_week": day_of_week,
            "base_price": rental_package.base_price,
            "day_price": day_price,
            "promotional_price": None,
            "effective_price": regular_price,
            "source": "day",
            "promotion_name": None,
        }

    return {
        "package_id": rental_package.id,
        "target_date": target_date,
        "day_of_week": day_of_week,
        "base_price": rental_package.base_price,
        "day_price": None,
        "promotional_price": None,
        "effective_price": rental_package.base_price,
        "source": "base",
        "promotion_name": None,
    }
