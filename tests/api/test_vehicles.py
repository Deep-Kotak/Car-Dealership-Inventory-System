def register_and_login(client, email="buyer@example.com"):
    """Create a user account and return the access token."""

    password = "mypassword123"

    client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": password,
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )

    response_data = response.json()

    return response_data["access_token"]


def auth_header(token):
    return {
        "Authorization": f"Bearer {token}"
    }


def add_vehicle(client, token, make, model, category, price, quantity=3):
    vehicle_data = {
        "make": make,
        "model": model,
        "category": category,
        "price": price,
        "quantity": quantity,
    }

    return client.post(
        "/api/vehicles",
        json=vehicle_data,
        headers=auth_header(token),
    )


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

    response_data = response.json()

    assert response.status_code == 201
    assert response_data["make"] == "Toyota"


def test_can_list_vehicles(client):
    token = register_and_login(client)

    add_vehicle(
        client,
        token,
        "Toyota",
        "Corolla",
        "sedan",
        20000,
    )

    response = client.get(
        "/api/vehicles",
        headers=auth_header(token),
    )

    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 1


def test_search_by_make(client):
    token = register_and_login(client)

    add_vehicle(
        client,
        token,
        "Toyota",
        "Corolla",
        "sedan",
        20000,
    )

    add_vehicle(
        client,
        token,
        "Honda",
        "Civic",
        "sedan",
        22000,
    )

    response = client.get(
        "/api/vehicles/search?make=Toyota",
        headers=auth_header(token),
    )

    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 1
    assert response_data[0]["make"] == "Toyota"


def test_search_by_price_range(client):
    token = register_and_login(client)

    add_vehicle(
        client,
        token,
        "Toyota",
        "Corolla",
        "sedan",
        20000,
    )

    add_vehicle(
        client,
        token,
        "BMW",
        "X5",
        "suv",
        60000,
    )

    response = client.get(
        "/api/vehicles/search?price_min=15000&price_max=30000",
        headers=auth_header(token),
    )

    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 1
    assert response_data[0]["make"] == "Toyota"


def test_search_by_make_and_category(client):
    token = register_and_login(client)

    add_vehicle(
        client,
        token,
        "Toyota",
        "Corolla",
        "sedan",
        20000,
    )

    add_vehicle(
        client,
        token,
        "Toyota",
        "RAV4",
        "suv",
        30000,
    )

    response = client.get(
        "/api/vehicles/search?make=Toyota&category=suv",
        headers=auth_header(token),
    )

    response_data = response.json()

    assert response.status_code == 200
    assert len(response_data) == 1
    assert response_data[0]["model"] == "RAV4"


def test_search_with_no_matches_returns_empty_list(client):
    token = register_and_login(client)

    add_vehicle(
        client,
        token,
        "Toyota",
        "Corolla",
        "sedan",
        20000,
    )

    response = client.get(
        "/api/vehicles/search?make=Ferrari",
        headers=auth_header(token),
    )

    response_data = response.json()

    assert response.status_code == 200
    assert response_data == []
def test_can_update_vehicle(client):
    token = register_and_login(client)
    created = add_vehicle(client, token, "Toyota", "Corolla", "sedan", 20000)
    vehicle_id = created.json()["id"]

    response = client.put(
        f"/api/vehicles/{vehicle_id}",
        json={"price": 18000},
        headers=auth_header(token),
    )

    assert response.status_code == 200
    assert response.json()["price"] == 18000


def test_update_missing_vehicle_returns_404(client):
    token = register_and_login(client)

    response = client.put(
        "/api/vehicles/999",
        json={"price": 18000},
        headers=auth_header(token),
    )

    assert response.status_code == 404