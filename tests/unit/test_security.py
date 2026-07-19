import pytest
from jose import JWTError

from app.security import (
    hash_password,
    verify_password,
    create_token,
    decode_token,
)

def test_password_hash_can_be_verified():
    hashed = hash_password("mypassword123")
    assert verify_password("mypassword123", hashed) is True


def test_wrong_password_fails_verification():
    hashed = hash_password("mypassword123")
    assert verify_password("wrongpassword", hashed) is False


def test_token_stores_user_id_and_role():
    token = create_token(user_id=1, role="admin")
    data = decode_token(token)

    assert data["user_id"] == 1
    assert data["role"] == "admin"


def test_bad_token_is_rejected():
    with pytest.raises(JWTError):
        decode_token("this-is-not-a-real-token")