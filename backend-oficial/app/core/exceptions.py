"""
Domain exceptions for Licenciame.
Routers catch these and translate them to HTTP responses.
"""


class LicenciameError(Exception):
    """Base exception for all domain errors."""

    def __init__(self, message: str, code: str | None = None):
        self.message = message
        self.code = code or self.__class__.__name__
        super().__init__(message)


class NotFoundError(LicenciameError):
    """Resource not found."""


class ForbiddenError(LicenciameError):
    """Action not allowed for the current user."""


class BusinessRuleError(LicenciameError):
    """Business rule violation (e.g. quota exceeded, invalid state transition)."""


class ExternalServiceError(LicenciameError):
    """Error communicating with an external service (ACRCloud, Meta, TikTok, etc.)."""
