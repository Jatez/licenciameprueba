"""Tests for app.core.security — passwords, JWT, Fernet, hashing."""
from datetime import datetime, timedelta, timezone

import pytest

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    create_refresh_token,
    hash_token,
    encrypt_token,
    decrypt_token,
)


# ── Password hashing ────────────────────────────────────────

class TestPasswordHashing:
    def test_hash_and_verify_correct(self):
        h = hash_password("Secret123!")
        assert verify_password("Secret123!", h) is True

    def test_verify_wrong_password(self):
        h = hash_password("Secret123!")
        assert verify_password("WrongPass", h) is False

    def test_hash_is_not_plaintext(self):
        h = hash_password("Secret123!")
        assert h != "Secret123!"
        assert len(h) > 30

    def test_different_hashes_for_same_password(self):
        """Argon2 uses random salt -> each hash differs."""
        h1 = hash_password("SamePass")
        h2 = hash_password("SamePass")
        assert h1 != h2

    def test_empty_password_hashes(self):
        h = hash_password("")
        assert isinstance(h, str)
        assert verify_password("", h) is True

    def test_unicode_password(self):
        h = hash_password("contraseña123!")
        assert verify_password("contraseña123!", h) is True
        assert verify_password("contrasena123!", h) is False


# ── JWT access tokens ───────────────────────────────────────

class TestJWT:
    def test_create_and_decode(self):
        token = create_access_token("user-uuid-123", "admin", "company-uuid-456")
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "user-uuid-123"
        assert payload["role"] == "admin"
        assert payload["company_id"] == "company-uuid-456"
        assert payload["type"] == "access"

    def test_decode_invalid_token(self):
        assert decode_access_token("invalid.token.here") is None

    def test_decode_empty_string(self):
        assert decode_access_token("") is None

    def test_company_id_none(self):
        token = create_access_token("user-1", "superadmin", None)
        payload = decode_access_token(token)
        assert payload["company_id"] is None

    def test_token_has_expiration(self):
        token = create_access_token("u", "admin", None)
        payload = decode_access_token(token)
        assert "exp" in payload

    def test_token_expired(self):
        """A token with negative expiry should fail to decode."""
        from jose import jwt
        from app.core.config import get_settings
        settings = get_settings()
        now = datetime.now(timezone.utc)
        payload = {
            "sub": "user-1",
            "role": "admin",
            "company_id": None,
            "type": "access",
            "iat": now - timedelta(hours=2),
            "exp": now - timedelta(hours=1),
        }
        expired_token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")
        assert decode_access_token(expired_token) is None

    def test_tampered_token_fails(self):
        token = create_access_token("user-1", "admin", None)
        # tamper by modifying a character in the signature
        parts = token.split(".")
        tampered = parts[0] + "." + parts[1] + "." + parts[2][:-3] + "XXX"
        assert decode_access_token(tampered) is None


# ── Refresh tokens ───────────────────────────────────────────

class TestRefreshToken:
    def test_create_returns_tuple(self):
        raw, hashed = create_refresh_token()
        assert isinstance(raw, str)
        assert isinstance(hashed, str)
        assert len(raw) == 64  # 2x uuid4 hex (32+32)
        assert len(hashed) == 64  # SHA-256 hex

    def test_hash_matches(self):
        raw, hashed = create_refresh_token()
        assert hash_token(raw) == hashed

    def test_different_each_call(self):
        r1, _ = create_refresh_token()
        r2, _ = create_refresh_token()
        assert r1 != r2


# ── Generic hash_token ───────────────────────────────────────

class TestHashToken:
    def test_deterministic(self):
        assert hash_token("abc") == hash_token("abc")

    def test_different_inputs(self):
        assert hash_token("abc") != hash_token("def")

    def test_returns_64_char_hex(self):
        result = hash_token("test_input")
        assert len(result) == 64
        assert all(c in "0123456789abcdef" for c in result)


# ── Fernet encryption ────────────────────────────────────────

class TestFernetEncryption:
    def test_round_trip(self):
        plaintext = "oauth2_access_token_value_12345"
        encrypted = encrypt_token(plaintext)
        assert encrypted != plaintext
        assert decrypt_token(encrypted) == plaintext

    def test_different_ciphertexts(self):
        """Fernet includes a timestamp → same cleartext produces different ciphertext."""
        e1 = encrypt_token("same")
        e2 = encrypt_token("same")
        assert e1 != e2

    def test_decrypt_wrong_ciphertext_raises(self):
        with pytest.raises(Exception):
            decrypt_token("not-a-valid-fernet-token")

    def test_encrypt_unicode(self):
        plaintext = "tóken_con_ñ_y_émojis_🎵"
        assert decrypt_token(encrypt_token(plaintext)) == plaintext
