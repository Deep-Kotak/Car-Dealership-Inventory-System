from app.security import hash_password, verify_password


def test_password_hash_can_be_verified():
    hashed = hash_password("mypassword123")
    assert verify_password("mypassword123", hashed) is True


def test_wrong_password_fails_verification():
    hashed = hash_password("mypassword123")
    assert verify_password("wrongpassword", hashed) is False