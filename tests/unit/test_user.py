import pytest

from app.domain.user import User


def test_admin_user_is_admin():
    user = User(email="boss@example.com", password_hash="hashed", role="admin")
    assert user.is_admin is True


def test_normal_user_is_not_admin():
    user = User(email="buyer@example.com", password_hash="hashed", role="user")
    assert user.is_admin is False


def test_role_must_be_valid():
    with pytest.raises(ValueError):
        User(email="someone@example.com", password_hash="hashed", role="wizard")