def test_register_creates_account(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "buyer@example.com",
            "password": "mypassword123",
        },
    )

    assert response.status_code == 201
    assert response.json()["email"] == "buyer@example.com"


def test_register_rejects_duplicate_email(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "buyer@example.com",
            "password": "mypassword123",
        },
    )

    response = client.post(
        "/api/auth/register",
        json={
            "email": "buyer@example.com",
            "password": "otherpassword",
        },
    )

    assert response.status_code == 409


def test_login_returns_access_token(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "buyer@example.com",
            "password": "mypassword123",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "buyer@example.com",
            "password": "mypassword123",
        },
    )

    response_data = response.json()

    assert response.status_code == 200
    assert "access_token" in response_data


def test_login_rejects_invalid_password(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "buyer@example.com",
            "password": "mypassword123",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "buyer@example.com",
            "password": "wrongpassword",
        },
    )

    assert response.status_code == 401