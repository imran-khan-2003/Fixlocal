"""Utility script to generate the FixLocal Postman collection."""

from __future__ import annotations

import json
from collections import OrderedDict
from pathlib import Path
from typing import Any, Dict, List


Endpoint = Dict[str, Any]


ENDPOINTS: List[Endpoint] = [
    {"folder": "Auth", "name": "Register", "method": "POST", "path": "/api/v1/auth/register", "body": {"name": "Demo User", "email": "{{registerEmail}}", "password": "{{registerPassword}}", "phone": "+911234567890", "role": "USER", "workingCity": "Bengaluru"}},
    {"folder": "Auth", "name": "Login", "method": "POST", "path": "/api/v1/auth/login", "body": {"email": "{{loginEmail}}", "password": "{{loginPassword}}"}},
    {"folder": "Users & Tradespersons", "name": "Get My Profile", "method": "GET", "path": "/api/v1/users/me", "auth": "user"},
    {"folder": "Users & Tradespersons", "name": "Update Profile", "method": "PUT", "path": "/api/v1/users/me", "auth": "user", "body": {"name": "Updated Demo", "bio": "Automation run", "workingCity": "Bengaluru", "experience": 5}},
    {"folder": "Users & Tradespersons", "name": "Toggle Availability", "method": "PATCH", "path": "/api/v1/users/me/availability?available=true", "auth": "user"},
    {"folder": "Users & Tradespersons", "name": "Update Skill Tags", "method": "PUT", "path": "/api/v1/users/me/skill-tags", "auth": "user", "body": {"tags": ["wiring", "ac repair", "safety audit"]}},
    {"folder": "Users & Tradespersons", "name": "Add Service Offering", "method": "POST", "path": "/api/v1/users/me/services", "auth": "user", "body": {"name": "Ceiling Fan Repair", "description": "Inspect + replace capacitor", "basePrice": 500, "durationMinutes": 60}},
    {"folder": "Users & Tradespersons", "name": "Update Service Offering", "method": "PUT", "path": "/api/v1/users/me/services/{{serviceId}}", "auth": "user", "body": {"name": "Premium Fan Repair", "description": "Includes regulator fix", "basePrice": 700, "durationMinutes": 75}},
    {"folder": "Users & Tradespersons", "name": "Delete Service Offering", "method": "DELETE", "path": "/api/v1/users/me/services/{{serviceId}}", "auth": "user"},
    {"folder": "Users & Tradespersons", "name": "Search Tradespersons", "method": "GET", "path": "/api/v1/tradespersons/search?city={{searchCity}}&occupation={{searchOccupation}}&page=0&size=5"},
    {"folder": "Users & Tradespersons", "name": "Get Tradesperson Public Profile", "method": "GET", "path": "/api/v1/tradespersons/{{tradespersonId}}"},
    {"folder": "Bookings", "name": "Create Booking", "method": "POST", "path": "/api/v1/bookings", "auth": "user", "body": {"tradespersonId": "{{tradespersonId}}", "serviceDescription": "Fix living room fan", "serviceAddress": "221B Baker Street", "userCity": "Bengaluru", "userLatitude": 12.9716, "userLongitude": 77.5946, "offerAmount": 600}},
    {"folder": "Bookings", "name": "Submit Counter Offer", "method": "POST", "path": "/api/v1/bookings/{{bookingId}}/offers", "auth": "user", "body": {"amount": 650, "message": "Includes wiring check"}},
    {"folder": "Bookings", "name": "Accept Offer", "method": "PATCH", "path": "/api/v1/bookings/{{bookingId}}/offers/{{offerId}}/accept", "auth": "user"},
    {"folder": "Bookings", "name": "Accept Booking (Tradesperson)", "method": "PATCH", "path": "/api/v1/bookings/{{bookingId}}/accept", "auth": "user"},
    {"folder": "Bookings", "name": "Reject Booking", "method": "PATCH", "path": "/api/v1/bookings/{{bookingId}}/reject", "auth": "user"},
    {"folder": "Bookings", "name": "Complete Booking", "method": "PATCH", "path": "/api/v1/bookings/{{bookingId}}/complete", "auth": "user"},
    {"folder": "Bookings", "name": "Start Trip", "method": "PATCH", "path": "/api/v1/bookings/{{bookingId}}/start-trip", "auth": "user"},
    {"folder": "Bookings", "name": "Mark Arrived", "method": "PATCH", "path": "/api/v1/bookings/{{bookingId}}/arrived", "auth": "user"},
    {"folder": "Bookings", "name": "Update Live Location", "method": "POST", "path": "/api/v1/bookings/{{bookingId}}/location", "auth": "user", "body": {"latitude": 12.972, "longitude": 77.597}},
    {"folder": "Bookings", "name": "Get Live Location", "method": "GET", "path": "/api/v1/bookings/{{bookingId}}/location", "auth": "user"},
    {"folder": "Bookings", "name": "Cancel Booking", "method": "PATCH", "path": "/api/v1/bookings/{{bookingId}}/cancel", "auth": "user", "body": {"reason": "User unavailable"}},
    {"folder": "Bookings", "name": "Get Booking", "method": "GET", "path": "/api/v1/bookings/{{bookingId}}", "auth": "user"},
    {"folder": "Bookings", "name": "User Bookings", "method": "GET", "path": "/api/v1/bookings/user?status=&page=0&size=10", "auth": "user"},
    {"folder": "Bookings", "name": "Tradesperson Bookings", "method": "GET", "path": "/api/v1/bookings/tradesperson?status=&page=0&size=10", "auth": "user"},
    {"folder": "Bookings", "name": "Booking Stats", "method": "GET", "path": "/api/v1/bookings/stats", "auth": "user"},
    {"folder": "Bookings", "name": "Payment Initiate", "method": "POST", "path": "/api/v1/bookings/{{bookingId}}/payments/initiate?amount=650", "auth": "user"},
    {"folder": "Bookings", "name": "Payment Authorize", "method": "POST", "path": "/api/v1/bookings/{{bookingId}}/payments/authorize", "auth": "user"},
    {"folder": "Bookings", "name": "Payment Capture", "method": "POST", "path": "/api/v1/bookings/{{bookingId}}/payments/capture", "auth": "user"},
    {"folder": "Bookings", "name": "Payment Refund", "method": "POST", "path": "/api/v1/bookings/{{bookingId}}/payments/refund", "auth": "user"},
    {"folder": "Dashboards", "name": "User Dashboard", "method": "GET", "path": "/api/v1/dashboard/user", "auth": "user"},
    {"folder": "Dashboards", "name": "Tradesperson Dashboard", "method": "GET", "path": "/api/v1/dashboard/tradesperson", "auth": "user"},
    {"folder": "Disputes", "name": "Create Dispute", "method": "POST", "path": "/api/v1/disputes", "auth": "user", "body": {"bookingId": "{{bookingId}}", "reason": "Workmanship issue", "details": "Paint peeled"}},
    {"folder": "Disputes", "name": "List All Disputes (Admin)", "method": "GET", "path": "/api/v1/disputes", "auth": "admin"},
    {"folder": "Disputes", "name": "Get Dispute", "method": "GET", "path": "/api/v1/disputes/{{disputeId}}", "auth": "user"},
    {"folder": "Disputes", "name": "Booking Disputes", "method": "GET", "path": "/api/v1/disputes/booking/{{bookingId}}", "auth": "user"},
    {"folder": "Disputes", "name": "My Disputes", "method": "GET", "path": "/api/v1/disputes/mine", "auth": "user"},
    {"folder": "Disputes", "name": "Update Dispute (Admin)", "method": "PUT", "path": "/api/v1/disputes/{{disputeId}}", "auth": "admin", "body": {"status": "RESOLVED", "resolutionNotes": "Refund issued"}},
    {"folder": "Disputes", "name": "Add Dispute Message", "method": "POST", "path": "/api/v1/disputes/{{disputeId}}/messages", "auth": "user", "body": {"message": "Sharing additional evidence"}},
    {"folder": "Notifications", "name": "List Notifications", "method": "GET", "path": "/api/v1/notifications?page=0&size=20", "auth": "user"},
    {"folder": "Notifications", "name": "Mark Notification Read", "method": "PUT", "path": "/api/v1/notifications/{{notificationId}}/read", "auth": "user"},
    {"folder": "Notifications", "name": "Mark All Notifications Read", "method": "PUT", "path": "/api/v1/notifications/read-all", "auth": "user"},
    {"folder": "Chat", "name": "Get Conversation", "method": "GET", "path": "/api/v1/chat/conversations/{{bookingId}}", "auth": "user"},
    {"folder": "Chat", "name": "Get Conversation Messages", "method": "GET", "path": "/api/v1/chat/conversations/{{conversationId}}/messages?page=0&size=20", "auth": "user"},
    {"folder": "Chat", "name": "Send Chat Message", "method": "POST", "path": "/api/v1/chat/bookings/{{bookingId}}/messages", "auth": "user", "body": {"content": "Automation ping"}},
    {"folder": "Reviews & Testimonials", "name": "Add Review", "method": "POST", "path": "/api/v1/reviews/{{reviewBookingId}}", "auth": "user", "body": {"rating": 5, "comment": "Great work"}},
    {"folder": "Reviews & Testimonials", "name": "Get Tradesperson Reviews", "method": "GET", "path": "/api/v1/reviews/tradesperson/{{tradespersonId}}"},
    {"folder": "Reviews & Testimonials", "name": "List Testimonials", "method": "GET", "path": "/api/v1/testimonials?limit=6"},
    {"folder": "Reviews & Testimonials", "name": "Submit Testimonial", "method": "POST", "path": "/api/v1/testimonials", "auth": "user", "body": {"name": "Automation User", "city": "Bengaluru", "role": "Homeowner", "quote": "Great experience"}},
    {"folder": "Admin", "name": "List Users", "method": "GET", "path": "/api/v1/admin/users?page=0&size=10", "auth": "admin"},
    {"folder": "Admin", "name": "List Tradespersons", "method": "GET", "path": "/api/v1/admin/tradespersons?page=0&size=10", "auth": "admin"},
    {"folder": "Admin", "name": "Block User", "method": "PATCH", "path": "/api/v1/admin/users/{{userId}}/block", "auth": "admin"},
    {"folder": "Admin", "name": "Unblock User", "method": "PATCH", "path": "/api/v1/admin/users/{{userId}}/unblock", "auth": "admin"},
    {"folder": "Admin", "name": "Verify Tradesperson", "method": "PATCH", "path": "/api/v1/admin/tradespersons/{{tradespersonId}}/verify", "auth": "admin"},
    {"folder": "Admin", "name": "List All Bookings", "method": "GET", "path": "/api/v1/admin/bookings?page=0&size=10", "auth": "admin"},
    {"folder": "Admin", "name": "Admin Stats", "method": "GET", "path": "/api/v1/admin/stats", "auth": "admin"},
    {"folder": "Misc", "name": "Health Ping", "method": "GET", "path": "/api/v1/test/ping"},
    {"folder": "Misc", "name": "Secure Ping", "method": "GET", "path": "/api/v1/test/secure", "auth": "user"},
]


def build_collection() -> Dict[str, Any]:
    folders: "OrderedDict[str, List[Dict[str, Any]]]" = OrderedDict()
    for ep in ENDPOINTS:
        folders.setdefault(ep["folder"], [])
        headers: List[Dict[str, str]] = []
        auth = ep.get("auth")
        if auth == "user":
            headers.append({"key": "Authorization", "value": "Bearer {{authToken}}"})
        elif auth == "admin":
            headers.append({"key": "Authorization", "value": "Bearer {{adminToken}}"})

        body_block = None
        if "body" in ep:
            body_block = {"mode": "raw", "raw": json.dumps(ep["body"], indent=2)}
            headers.append({"key": "Content-Type", "value": "application/json"})

        request = {
            "name": ep["name"],
            "request": {
                "method": ep["method"],
                "header": headers,
                "url": {"raw": "{{baseUrl}}" + ep["path"]},
            },
        }
        if body_block:
            request["request"]["body"] = body_block

        folders[ep["folder"]].append(request)

    return {
        "info": {
            "name": "FixLocal API Collection",
            "description": "Automation-ready suite hitting every FixLocal endpoint. Set collection variables before running.",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        "item": [{"name": folder, "item": items} for folder, items in folders.items()],
        "variable": [
            {"key": "baseUrl", "value": "http://localhost:8080"},
            {"key": "registerEmail", "value": "newuser@example.com"},
            {"key": "registerPassword", "value": "Password123"},
            {"key": "loginEmail", "value": "demo@example.com"},
            {"key": "loginPassword", "value": "Password123"},
            {"key": "authToken", "value": ""},
            {"key": "adminToken", "value": ""},
            {"key": "serviceId", "value": "SERVICE_ID"},
            {"key": "tradespersonId", "value": "TRADESPERSON_ID"},
            {"key": "searchCity", "value": "Bengaluru"},
            {"key": "searchOccupation", "value": "electrician"},
            {"key": "bookingId", "value": "BOOKING_ID"},
            {"key": "offerId", "value": "OFFER_ID"},
            {"key": "disputeId", "value": "DISPUTE_ID"},
            {"key": "notificationId", "value": "NOTIFICATION_ID"},
            {"key": "conversationId", "value": "CONVERSATION_ID"},
            {"key": "reviewBookingId", "value": "BOOKING_ID"},
            {"key": "userId", "value": "USER_ID"},
        ],
    }


def main() -> None:
    collection = build_collection()
    output_path = Path("docs/api/fixlocal-api.postman_collection.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(collection, indent=2))
    print(f"Wrote Postman collection with {len(ENDPOINTS)} endpoints to {output_path}")


if __name__ == "__main__":
    main()