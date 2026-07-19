class User:
    def __init__(self, email, password_hash, role, id=None):
        if role not in ("admin", "user"):
            raise ValueError("role must be 'admin' or 'user'")
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.role = role

    @property
    def is_admin(self):
        return self.role == "admin"