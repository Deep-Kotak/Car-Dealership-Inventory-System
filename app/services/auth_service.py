from app.domain.errors import DuplicateEmailError, InvalidCredentialsError
from app.domain.user import User
from app.security import create_token, hash_password, verify_password


class AuthService:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    def register(self, email, password):
        if self.user_repository.get_by_email(email) is not None:
            raise DuplicateEmailError(email)

        user = User(email=email, password_hash=hash_password(password), role="user")
        return self.user_repository.add(user)

    def login(self, email, password):
        user = self.user_repository.get_by_email(email)
        if user is None:
            raise InvalidCredentialsError(email)

        if not verify_password(password, user.password_hash):
            raise InvalidCredentialsError(email)

        return create_token(user_id=user.id, role=user.role)
