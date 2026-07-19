def register_and_login(client, email="buyer@example.com"):
    """Helper: make an account and return its token."""
    client.post(
        "/api/auth/register",
        json={"email": email, "password": "mypassword123"},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": "mypassword123"},
    )
    return response.json()["access_token"]


def auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def test_cannot_add_vehicle_without_login(client):
    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "sedan",
            "price": 20000,
            "quantity": 3,
        },
    )
    assert response.status_code == 401


def test_can_add_vehicle_after_login(client):
    token = register_and_login(client)

    response = client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "sedan",
            "price": 20000,
            "quantity": 3,
        },
        headers=auth_header(token),
    )

    assert response.status_code == 201
    response_data = response.json()
    assert response_data["make"] == "Toyota"

def test_can_list_vehicles(client):
    token = register_and_login(client)
    client.post(
        "/api/vehicles",
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "sedan",
            "price": 20000,
            "quantity": 3,
        },
        headers=auth_header(token),
    )

    response = client.get("/api/vehicles", headers=auth_header(token))

    assert response.status_code == 200
    assert len(response.json()) == 1