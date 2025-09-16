import { useEffect, useState } from "react";
import { checkExists, getUserById, registerUser } from "../api";

export default function RegisterForm({ onSuccess }) {
  const [invitorId, setInvitorId] = useState("ROOT001");
  const [invitorName, setInvitorName] = useState("");
  const [yourId, setYourId] = useState("");
  const [yourName, setYourName] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fetch invitor name
  useEffect(() => {
    async function fetchInvitor() {
      if (!invitorId) {
        setInvitorName("");
        setErrors((e) => ({ ...e, invitorId: undefined })); // clear error when empty
        return;
      }
      try {
        const data = await getUserById(invitorId);
        if (data?.user) {
          setInvitorName(data.user.name);
          setErrors((e) => ({ ...e, invitorId: undefined }));
        } else {
          setInvitorName("");
          setErrors((e) => ({ ...e, invitorId: "Invitor not found" }));
        }
      } catch (err) {
        setInvitorName("");
        setErrors((e) => ({ ...e, invitorId: "Invitor not found" }));
      }
    }
    fetchInvitor();
  }, [invitorId]);

  // Check uniqueness of yourId
  useEffect(() => {
    async function check() {
      if (!yourId) {
        setErrors((e) => ({ ...e, yourId: undefined }));
        return;
      }
      const { exists } = await checkExists(yourId);
      setErrors((e) => ({
        ...e,
        yourId: exists ? "User ID already exists" : undefined,
      }));
    }
    check();
  }, [yourId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});
    setLoading(true);
    try {
      if (!yourId || !yourName) throw new Error("All fields are required");

      const res = await registerUser({
        invitor_id: invitorId,
        invitor_name: invitorName,
        user_id: yourId,
        name: yourName,
      });

      setMessage("✅ Registered successfully!");
      setYourId("");
      setYourName("");
      onSuccess?.(res.user);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h4 className="mb-3">Register User</h4>
      {errors.form && <div className="alert alert-danger">{errors.form}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Invitor ID */}
        <div className="mb-3">
          <label className="form-label">Invitor ID</label>
          <input
            type="text"
            className="form-control"
            value={invitorId}
            onChange={(e) => setInvitorId(e.target.value.trim())}
          />
          {invitorName && (
            <small className="text-success">Invitor: {invitorName}</small>
          )}
          {errors.invitorId && (
            <small className="text-danger">{errors.invitorId}</small>
          )}
        </div>

        {/* Your ID */}
        <div className="mb-3">
          <label className="form-label">Your ID</label>
          <input
            type="text"
            className="form-control"
            value={yourId}
            onChange={(e) => setYourId(e.target.value.trim())}
          />
          {errors.yourId && <small className="text-danger">{errors.yourId}</small>}
        </div>

        {/* Your Name */}
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            type="text"
            className="form-control"
            value={yourName}
            onChange={(e) => setYourName(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
