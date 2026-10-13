
import { useState } from "react";
import { CheckCircle, PackagePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyForm = {
  sender_name: "",
  sender_phone: "",
  sender_address: "",
  receiver_name: "",
  receiver_phone: "",
  receiver_email: "",
  receiver_address: "",
  parcel_type: "Package",
  weight: "",
};

export default function RegisterParcel() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdParcel, setCreatedParcel] = useState(null);

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setCreatedParcel(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("campus_token");

      if (!token) {
        throw new Error("Please log in again before registering a parcel.");
      }

      const response = await fetch(`${API_BASE}/parcels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          sender_name: form.sender_name.trim(),
          sender_phone: form.sender_phone.trim(),
          sender_address: form.sender_address.trim(),
          receiver_name: form.receiver_name.trim(),
          receiver_phone: form.receiver_phone.trim(),
          receiver_email: form.receiver_email.trim().toLowerCase(),
          receiver_address: form.receiver_address.trim(),
          parcel_type: form.parcel_type.trim(),
          weight: Number(form.weight),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to register parcel. Please try again."
        );
      }

      setCreatedParcel(data.parcel);
      setForm({ ...emptyForm });
    } catch (err) {
      setError(err.message || "Unable to register parcel.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setForm({ ...emptyForm });
    setError("");
    setCreatedParcel(null);
  }

  return (
    <div className="page narrow-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PARCEL OPERATIONS</span>
          <h1>Register New Parcel</h1>
          <p>
            Record a parcel received at the campus parcel desk.
          </p>
        </div>
      </div>

      {createdParcel && (
        <div className="success-message">
          <CheckCircle size={20} />

          <div>
            <strong>Parcel registered successfully!</strong>
            <p>
              Tracking number: {createdParcel.tracking_number}
            </p>
            <p>
              Receiver: {form.receiver_email === ""
                ? "Parcel saved successfully"
                : form.receiver_email}
            </p>
          </div>

          <button
            type="button"
            className="text-link"
            onClick={() => navigate("/manager/parcels")}
          >
            View parcels
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="content-card form-stack"
      >
        <div className="form-title">
          <PackagePlus size={22} />

          <div>
            <h2>Parcel Details</h2>
            <p>Fields marked with * are required.</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="sender_name">Sender Name *</label>
            <input
              id="sender_name"
              name="sender_name"
              value={form.sender_name}
              onChange={handleChange}
              placeholder="Enter sender name"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="sender_phone">Sender Phone *</label>
            <input
              id="sender_phone"
              name="sender_phone"
              type="tel"
              value={form.sender_phone}
              onChange={handleChange}
              placeholder="Enter sender phone"
              required
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="sender_address">Sender Address *</label>
            <textarea
              id="sender_address"
              name="sender_address"
              value={form.sender_address}
              onChange={handleChange}
              placeholder="Enter sender address"
              rows={3}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="receiver_name">Receiver Name *</label>
            <input
              id="receiver_name"
              name="receiver_name"
              value={form.receiver_name}
              onChange={handleChange}
              placeholder="Enter receiver name"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="receiver_phone">Receiver Phone *</label>
            <input
              id="receiver_phone"
              name="receiver_phone"
              type="tel"
              value={form.receiver_phone}
              onChange={handleChange}
              placeholder="Enter receiver phone"
              required
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="receiver_email">
              Receiver Registered Email *
            </label>
            <input
              id="receiver_email"
              name="receiver_email"
              type="email"
              value={form.receiver_email}
              onChange={handleChange}
              placeholder="Enter the email used by the recipient to log in"
              required
            />
            <small>
              Enter the email address of the existing ParcelNest User
              who should see this parcel.
            </small>
          </div>

          <div className="form-field full-width">
            <label htmlFor="receiver_address">
              Receiver Address *
            </label>
            <textarea
              id="receiver_address"
              name="receiver_address"
              value={form.receiver_address}
              onChange={handleChange}
              placeholder="Enter receiver address"
              rows={3}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="parcel_type">Parcel Type *</label>
            <select
              id="parcel_type"
              name="parcel_type"
              value={form.parcel_type}
              onChange={handleChange}
              required
            >
              <option value="Package">Package</option>
              <option value="Document">Document</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="weight">Weight (kg) *</label>
            <input
              id="weight"
              name="weight"
              type="number"
              min="0.01"
              step="0.01"
              value={form.weight}
              onChange={handleChange}
              placeholder="e.g. 1.5"
              required
            />
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleClear}
            disabled={loading}
          >
            Clear Form
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            <PackagePlus size={17} />
            {loading ? "Registering..." : "Register Parcel"}
          </button>
        </div>
      </form>
    </div>
  );
}
