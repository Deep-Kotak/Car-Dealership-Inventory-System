from app.domain.errors import DuplicateEmailError
from app.domain.user import User
from app.security import hash_password


class AuthService:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    def register(self, email, password):
        if self.user_repository.get_by_email(email) is not None:
            raise DuplicateEmailError(email)

        user = User(email=email, password_hash=hash_password(password), role="user")
        return self.user_repository.add(user)
