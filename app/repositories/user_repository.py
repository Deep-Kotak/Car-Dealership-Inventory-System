from app.domain.user import User
from app.repositories.models import UserModel


class UserRepository:
    def __init__(self, db):
        self.db = db

    def get_by_email(self, email):
        model = self.db.query(UserModel).filter(UserModel.email == email).first()
        if model is None:
            return None
        return self._to_domain(model)

    def add(self, user):
        model = UserModel(
            email=user.email,
            password_hash=user.password_hash,
            role=user.role,
        )
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_domain(model)

    def _to_domain(self, model):
        return User(
            id=model.id,
            email=model.email,
            password_hash=model.password_hash,
            role=model.role,
        )
