import pytest

from app.domain.errors import DuplicateEmailError
from app.services.auth_service import AuthService


class FakeUserRepository:
    """Pretend database that keeps users in a list."""

    def __init__(self):
        self.users = []

    def get_by_email(self, email):
        for user in self.users:
            if user.email == email:
                return user
        return None

    def add(self, user):
        user.id = len(self.users) + 1
        self.users.append(user)
        return user


def test_register_creates_user_with_hashed_password():    
    repository = FakeUserRepository()
    auth_service = AuthService(repository)

    user = service.register("buyer@example.com", "mypassword123")

    assert user.email == "buyer@example.com"
    assert user.password_hash != "mypassword123"


def test_register_rejects_duplicate_email():
    service = AuthService(FakeUserRepository())
    service.register("buyer@example.com", "mypassword123")

    with pytest.raises(DuplicateEmailError):
        service.register("buyer@example.com", "differentpassword")