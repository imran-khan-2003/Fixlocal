import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { bookingService } from "../api/bookingService";
import { useAuth } from "../context/AuthContext";

function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [worker, setWorker] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [geoStatus, setGeoStatus] = useState("");

  useEffect(() => {
    async function fetchWorker() {
      setError("");
      try {
        const res = await api.get(`/tradespersons/${id}`);
        setWorker(res.data);
      } catch (err) {
        setError("Failed to load tradesperson profile.");
      }
    }
    fetchWorker();
  }, [id]);

  const captureLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation not supported by this browser.");
      return;
    }
    setGeoStatus("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude.toFixed(5),
          lng: position.coords.longitude.toFixed(5),
        });
        setGeoStatus("Location captured. You can now book.");
      },
      () => {
        setGeoStatus("Could not retrieve GPS location. Please try again.");
      }
    );
  }, []);

  const parseCoord = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: `/worker/${id}` } });
      return;
    }
    if (user?.role !== "USER") {
      setError("Only customers can create bookings.");
      return;
    }
    const lat = parseCoord(coords.lat);
    const lng = parseCoord(coords.lng);

    if (lat === null || lng === null || !city.trim()) {
      setError("Please provide your city and latitude/longitude before booking.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      const now = new Date();
      const start = new Date(now.getTime() + 60 * 60 * 1000);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      await bookingService.create({
        tradespersonId: id,
        serviceAddress: worker?.workingCity || "Customer location",
        serviceDescription: `Booking with ${worker?.name || "tradesperson"}`,
        bookingStartTime: start.toISOString(),
        bookingEndTime: end.toISOString(),
        offerAmount: worker?.rate || worker?.baseRate || 1000,
        userCity: city,
        userLatitude: lat,
        userLongitude: lng,
      });
      setSuccess("Booking request sent! You can track it from your dashboard.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !worker) return <p className="p-10 text-red-500">{error}</p>;
  if (!worker) return <p className="p-10 text-text-secondary">Loading...</p>;

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow p-8 border border-gray-200 relative">
          <img
            src="/tradesperson.png"
            alt="Tradesperson badge"
            className="absolute top-1 right-1 object-contain"
            style={{ height: "150px", width: "150px" }}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase text-text-secondary">Tradesperson</p>
            <h1 className="text-4xl font-bold text-text-primary">{worker.name}</h1>
            <p className="text-lg text-text-secondary">{worker.occupation}</p>
          </div>
          <dl className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-text-primary">
            <div>
              <dt className="text-sm text-text-secondary">Location</dt>
              <dd className="text-base">📍 {worker.workingCity}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Experience</dt>
              <dd className="text-base">🧰 {worker.experience || 0} years</dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Rating</dt>
              <dd className="text-base">⭐ {worker.averageRating ?? "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-secondary">Status</dt>
              <dd>
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs rounded-full ${
                    worker.status === "AVAILABLE"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {worker.status}
                </span>
              </dd>
            </div>
          </dl>
          <div className="mt-6 grid gap-4">
            <div>
              <label className="text-sm text-text-secondary">Your city</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="mt-1 w-full border rounded-xl px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="border rounded-xl px-4 py-2 text-sm text-text-secondary transition hover:bg-gray-100"
                  onClick={captureLocation}
                >
                  {coords.lat ? "Refresh my location" : "Capture my location"}
                </button>
                {geoStatus && <p className="text-xs text-text-secondary">{geoStatus}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary">Latitude</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={coords.lat}
                    onChange={(e) =>
                      setCoords((prev) => ({ ...prev, lat: e.target.value }))
                    }
                    placeholder="e.g. 12.97160"
                    className="mt-1 w-full border rounded-xl px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary">Longitude</label>
                  <input
                    type="number"
                    step="0.00001"
                    value={coords.lng}
                    onChange={(e) =>
                      setCoords((prev) => ({ ...prev, lng: e.target.value }))
                    }
                    placeholder="e.g. 77.59460"
                    className="mt-1 w-full border rounded-xl px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
          <button
            className="mt-8 bg-accent text-white px-6 py-3 rounded-xl disabled:opacity-50 transition hover:bg-blue-800"
            onClick={handleBook}
            disabled={submitting || worker.status !== "AVAILABLE"}
          >
            {submitting ? "Sending request..." : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfile;
