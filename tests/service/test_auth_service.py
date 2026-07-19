import pytest

from app.domain.errors import (
    DuplicateEmailError,
    InvalidCredentialsError,
)
from app.security import decode_token
from app.services.auth_service import AuthService


class FakeUserRepository:
    """
    Simple in-memory repository used for unit tests.
    This avoids using a real database.
    """

    def __init__(self):
        self.users = []

    def get_by_email(self, email):
        for existing_user in self.users:
            if existing_user.email == email:
                return existing_user
        return None

    def add(self, user):
        user.id = len(self.users) + 1
        self.users.append(user)
        return user


def test_register_creates_user_with_hashed_password():
    repository = FakeUserRepository()
    auth_service = AuthService(repository)

    user = auth_service.register(
        "buyer@example.com",
        "mypassword123",
    )

    assert user.email == "buyer@example.com"
    assert user.password_hash != "mypassword123"


def test_register_rejects_duplicate_email():
    repository = FakeUserRepository()
    auth_service = AuthService(repository)

    auth_service.register(
        "buyer@example.com",
        "mypassword123",
    )

    with pytest.raises(DuplicateEmailError):
        auth_service.register(
            "buyer@example.com",
            "differentpassword",
        )


def test_login_returns_token_for_correct_password():
    repository = FakeUserRepository()
    auth_service = AuthService(repository)

    auth_service.register(
        "buyer@example.com",
        "mypassword123",
    )

    token = auth_service.login(
        "buyer@example.com",
        "mypassword123",
    )

    token_data = decode_token(token)

    assert token_data["role"] == "user"


def test_login_rejects_wrong_password():
    repository = FakeUserRepository()
    auth_service = AuthService(repository)

    auth_service.register(
        "buyer@example.com",
        "mypassword123",
    )

    with pytest.raises(InvalidCredentialsError):
        auth_service.login(
            "buyer@example.com",
            "wrongpassword",
        )


def test_login_rejects_unknown_email():
    repository = FakeUserRepository()
    auth_service = AuthService(repository)

    with pytest.raises(InvalidCredentialsError):
        auth_service.login(
            "nobody@example.com",
            "mypassword123",
        )