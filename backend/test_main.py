from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"


def test_analyze_valid_request():
    response = client.post("/analyze", json={"majors": ["Computer Science"]})
    assert response.status_code == 200
    body = response.json()
    assert "Computer Science" in body
    assert isinstance(body["Computer Science"], list)
    assert len(body["Computer Science"]) > 0


def test_analyze_rejects_empty_majors():
    response = client.post("/analyze", json={"majors": []})
    assert response.status_code == 422


def test_country_score_breakdown_endpoint():
    response = client.get("/api/agent1/score/VN")
    assert response.status_code == 200
    body = response.json()
    assert body["country"] == "Vietnam"
    assert body["major"] == "Computer Science"
    assert body["breakdown"]["mobility"] == 25


def test_fair_recommendation_endpoint():
    response = client.get("/api/agent2/fairs/VN")
    assert response.status_code == 200
    body = response.json()
    assert len(body) > 0
    assert body[0]["type"] in {
        "Education Fair",
        "School Visit",
        "Embassy Seminar",
        "Diaspora Engagement",
        "Digital-only Campaign",
    }


def test_callback_insights_endpoint():
    response = client.get("/api/admin/callback-insights")
    assert response.status_code == 200
    body = response.json()
    assert body["housing"] == 35
    assert body["visa"] == 22
    assert body["tuition"] == 18
    assert body["competitor"] == 12


def test_create_lead_validates_email():
    bad_payload = {
        "full_name": "Test User",
        "nationality": "India",
        "desired_major": "Engineering",
        "degree_level": "Bachelor",
        "start_date": "Autumn 2025",
        "email": "invalid-email",
        "phone": "+358401234567",
    }
    response = client.post("/leads", json=bad_payload)
    assert response.status_code == 422


def test_create_lead_accepts_valid_payload_and_lists_lead():
    payload = {
        "full_name": "Valid User",
        "nationality": "India",
        "desired_major": "Engineering",
        "degree_level": "Bachelor",
        "start_date": "Autumn 2025",
        "email": "valid@example.com",
        "phone": "+358401234567",
    }
    create_response = client.post("/leads", json=payload)
    assert create_response.status_code == 200
    lead = create_response.json()["lead"]
    assert lead["full_name"] == "Valid User"
    assert lead["desired_major"] == "Engineering"

    list_response = client.get("/leads")
    assert list_response.status_code == 200
    leads = list_response.json()
    assert any(item["full_name"] == "Valid User" for item in leads)
