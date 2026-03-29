# Verification Checklist

This guide documents the manual checks performed for the new dispute workflow and live navigation enhancements.

## 1. Dispute submission (user dashboard)
1. Log in as a regular user with at least one completed or active booking.
2. From **Dashboard → My Bookings**, choose a booking card and click **Report an Issue**.
3. Fill in the reason & desired outcome, submit, and confirm the success toast.
4. Check the browser network tab to ensure a `POST /api/disputes` request returns `200`.
5. Refresh the **Admin → Disputes** page and confirm the new entry is listed with status `OPEN`.

## 2. Dispute submission (tradesperson dashboard)
1. Log in as a tradesperson with an assigned booking.
2. Open the booking card and click **Report an Issue**.
3. Verify the modal submits successfully and the Admin disputes table refreshes with the added reporter ID.

## 3. Admin dispute management
1. Visit **Dashboard → Disputes** as an admin.
2. Confirm the table loads without errors and the status dropdown updates a dispute via `PATCH /api/disputes/{id}`.
3. Refresh to ensure persisted status updates match MongoDB documents.

## 4. Live navigation sharing (tradesperson)
1. Log in as a tradesperson with an `EN_ROUTE` booking and open the location panel.
2. Click **Use my GPS**, then **Start navigation sharing**.
3. Observe periodic `POST /bookings/{id}/location` calls every ~10 seconds and a route polyline rendered on the embedded map.
4. Stop sharing and confirm the status pill switches to "Stopped automatic sharing.".

## 5. User live tracking distance readout
1. Log in as the booking user while the tradesperson is sharing live location.
2. Ensure the live tracking card displays:
   - Updated map markers for tradesperson and destination.
   - A blue status pill when updates are fresh.
   - The distance badge text `≈ X.XX km away from your location` updating as new positions stream in.

All checks above passed locally on 2026-03-28.