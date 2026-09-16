import { useEffect, useMemo, useState } from "react";
import "./App.css";

/* =========================================================
   INITIAL DEMO DATA
========================================================= */

const initialMedicines = [
  {
    id: 1,
    name: "Paracetamol",
    batch: "PCM2026A",
    category: "Tablet",
    quantity: 50,
    manufacturingDate: "2026-01-10",
    expiryDate: "2026-10-20",
    notes: "Store in a cool and dry place.",
  },
  {
    id: 2,
    name: "Amoxicillin",
    batch: "AMX2026B",
    category: "Capsule",
    quantity: 30,
    manufacturingDate: "2026-02-15",
    expiryDate: "2027-01-15",
    notes: "Keep away from direct sunlight.",
  },
  {
    id: 3,
    name: "Ibuprofen",
    batch: "IBU2026C",
    category: "Tablet",
    quantity: 20,
    manufacturingDate: "2025-09-02",
    expiryDate: "2026-10-02",
    notes: "",
  },
  {
    id: 4,
    name: "Cough Syrup",
    batch: "CS2026D",
    category: "Syrup",
    quantity: 15,
    manufacturingDate: "2026-03-01",
    expiryDate: "2026-09-25",
    notes: "Refrigerate after opening.",
  },
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getToday() {
  return new Date();
}

function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const difference = expiry - today;

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
}

function getMedicineStatus(expiryDate) {
  const days = getDaysUntilExpiry(expiryDate);

  if (days < 0) {
    return "Expired";
  }

  if (days <= 30) {
    return "Expiring Soon";
  }

  return "Safe";
}

function formatDate(date) {
  if (!date) return "-";

  const d = new Date(date);

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   LOGIN PAGE
========================================================= */

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("Checking login details...");
    setSuccess(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      setMessage(data.message);
      setSuccess(data.success);

      if (data.success) {
        localStorage.setItem("medExpiryLoggedIn", "true");
        localStorage.setItem("medExpiryUser", email);

        setTimeout(() => {
          onLogin();
        }, 500);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="welcome-section">

          <div className="logo-circle">
            💊
          </div>

          <h1>Medical Expiry</h1>
          <h1>Reminder System</h1>

          <p>
            Manage medicines, track expiry dates,
            and reduce unnecessary medical wastage.
          </p>

          <div className="login-features">

            <div>
              <span>✓</span>
              Track medicine expiry dates
            </div>

            <div>
              <span>✓</span>
              Get timely notifications
            </div>

            <div>
              <span>✓</span>
              Reduce medicine wastage
            </div>

          </div>

        </div>

        <div className="login-section">

          <div className="login-card">

            <h2>Welcome Back</h2>

            <p className="login-subtitle">
              Login to manage your medicines
            </p>

            <form onSubmit={handleLogin}>

              <div className="input-group">

                <label>Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

              <div className="input-group">

                <label>Password</label>

                <div className="password-container">

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

              <div className="login-options">

                <label>
                  <input type="checkbox" />
                  Remember me
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert(
                      "Password recovery will be connected to the backend later."
                    )
                  }
                >
                  Forgot Password?
                </button>

              </div>

              <button
                type="submit"
                className="login-button"
              >
                Login
              </button>

            </form>

            {message && (
              <p
                className={`login-message ${
                  success ? "success-message" : "error-message"
                }`}
              >
                {message}
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({ page, setPage, onLogout }) {
  const menuItems = [
    ["dashboard", "🏠", "Dashboard"],
    ["medicines", "💊", "Medicines"],
    ["add", "➕", "Add Medicine"],
    ["expiring", "⏰", "Expiring Soon"],
    ["notifications", "🔔", "Notifications"],
    ["reports", "📊", "Reports"],
    ["settings", "⚙️", "Settings"],
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="logo-icon">
          💊
        </div>

        <div>
          <h2>MedExpiry</h2>
          <span>Reminder System</span>
        </div>

      </div>

      <nav className="sidebar-nav">

        <p className="nav-title">
          MAIN MENU
        </p>

        {menuItems.slice(0, 5).map(([id, icon, text]) => (
          <button
            key={id}
            className={`nav-item ${
              page === id ? "active" : ""
            }`}
            onClick={() => setPage(id)}
          >
            <span>{icon}</span>
            {text}
          </button>
        ))}

        <p className="nav-title">
          MANAGEMENT
        </p>

        {menuItems.slice(5).map(([id, icon, text]) => (
          <button
            key={id}
            className={`nav-item ${
              page === id ? "active" : ""
            }`}
            onClick={() => setPage(id)}
          >
            <span>{icon}</span>
            {text}
          </button>
        ))}

      </nav>

      <div className="sidebar-bottom">

        <div className="profile-mini">

          <div className="profile-avatar">
            SK
          </div>

          <div>
            <strong>User</strong>
            <span>Administrator</span>
          </div>

        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          ↪ Logout
        </button>

      </div>

    </aside>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({
  search,
  setSearch,
  setPage,
  notificationCount,
}) {
  return (
    <header className="topbar">

      <div className="search-box">

        <span>🔍</span>

        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="topbar-right">

        <button
          className="notification-button"
          onClick={() => setPage("notifications")}
        >
          🔔

          {notificationCount > 0 && (
            <span>
              {notificationCount}
            </span>
          )}

        </button>

        <div className="user-profile">

          <div className="profile-avatar">
            SK
          </div>

          <div>
            <strong>Welcome!</strong>
            <span>Medicine Manager</span>
          </div>

        </div>

      </div>

    </header>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({
  medicines,
  setPage,
  setEditingMedicine,
}) {
  const total = medicines.length;

  const safe = medicines.filter(
    (m) => getMedicineStatus(m.expiryDate) === "Safe"
  ).length;

  const expiring = medicines.filter(
    (m) => getMedicineStatus(m.expiryDate) === "Expiring Soon"
  ).length;

  const expired = medicines.filter(
    (m) => getMedicineStatus(m.expiryDate) === "Expired"
  ).length;

  const recent = [...medicines]
    .sort(
      (a, b) =>
        new Date(b.expiryDate) -
        new Date(a.expiryDate)
    )
    .slice(0, 5);

  return (
    <>

      <section className="welcome-banner">

        <div>

          <p className="welcome-small">
            GOOD EVENING 👋
          </p>

          <h1>
            Welcome to your Dashboard
          </h1>

          <p>
            Keep track of your medicines and
            never miss an expiry date.
          </p>

        </div>

        <div className="welcome-icon">
          💊
        </div>

      </section>

      <section className="summary-section">

        <SummaryCard
          icon="💊"
          title="Total Medicines"
          value={total}
          text="Currently registered"
          type="blue"
        />

        <SummaryCard
          icon="✓"
          title="Safe Medicines"
          value={safe}
          text="Not expiring soon"
          type="green"
        />

        <SummaryCard
          icon="⏰"
          title="Expiring Soon"
          value={expiring}
          text="Within 30 days"
          type="orange"
        />

        <SummaryCard
          icon="!"
          title="Expired"
          value={expired}
          text="Needs attention"
          type="red"
        />

      </section>

      <section className="dashboard-grid">

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Expiry Overview</h2>
              <p>Medicine expiry status</p>
            </div>

            <button
              onClick={() => setPage("expiring")}
            >
              View Details →
            </button>

          </div>

          <div className="expiry-chart">

            <div className="chart-circle">

              <strong>
                {total === 0
                  ? 0
                  : Math.round((safe / total) * 100)}
                %
              </strong>

              <span>Safe</span>

            </div>

            <div className="chart-legend">

              <LegendItem
                type="safe"
                name="Safe"
                value={safe}
              />

              <LegendItem
                type="soon"
                name="Expiring Soon"
                value={expiring}
              />

              <LegendItem
                type="expired"
                name="Expired"
                value={expired}
              />

            </div>

          </div>

        </div>

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>
              <h2>Quick Actions</h2>
              <p>Manage your medicines</p>
            </div>

          </div>

          <div className="quick-actions">

            <button
              className="quick-action blue-action"
              onClick={() => setPage("add")}
            >

              <span>➕</span>

              <div>
                <strong>Add Medicine</strong>
                <small>
                  Register a new medicine
                </small>
              </div>

            </button>

            <button
              className="quick-action purple-action"
              onClick={() => setPage("medicines")}
            >

              <span>📋</span>

              <div>
                <strong>View Medicines</strong>
                <small>
                  Manage your medicine list
                </small>
              </div>

            </button>

            <button
              className="quick-action orange-action"
              onClick={() => setPage("expiring")}
            >

              <span>⏰</span>

              <div>
                <strong>Check Expiry</strong>
                <small>
                  View upcoming expiries
                </small>
              </div>

            </button>

          </div>

        </div>

      </section>

      <section className="dashboard-panel recent-panel">

        <div className="panel-header">

          <div>
            <h2>Recent Medicines</h2>
            <p>Recently registered medicines</p>
          </div>

          <button
            onClick={() => setPage("medicines")}
          >
            View All →
          </button>

        </div>

        <MedicineTable
          medicines={recent}
          onEdit={(medicine) => {
            setEditingMedicine(medicine);
            setPage("add");
          }}
        />

      </section>

    </>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  title,
  value,
  text,
  type,
}) {
  return (
    <div className="summary-card">

      <div className={`summary-icon ${type}`}>
        {icon}
      </div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{text}</span>
      </div>

    </div>
  );
}

/* =========================================================
   LEGEND
========================================================= */

function LegendItem({ type, name, value }) {
  return (
    <div>

      <span className={`legend-dot ${type}`}></span>

      {name}

      <strong>{value}</strong>

    </div>
  );
}

/* =========================================================
   MEDICINE TABLE
========================================================= */

function MedicineTable({
  medicines,
  onEdit,
  onDelete,
}) {
  if (medicines.length === 0) {
    return (
      <div className="empty-state">
        <div>💊</div>
        <h3>No medicines found</h3>
        <p>
          Add a medicine to start tracking expiry dates.
        </p>
      </div>
    );
  }

  return (
    <div className="medicine-table">

      <div className="table-header">

        <span>Medicine</span>
        <span>Category</span>
        <span>Quantity</span>
        <span>Expiry Date</span>
        <span>Status</span>
        <span>Actions</span>

      </div>

      {medicines.map((medicine) => {

        const status = getMedicineStatus(
          medicine.expiryDate
        );

        return (
          <div
            className="medicine-row"
            key={medicine.id}
          >

            <div className="medicine-name">

              <div className="medicine-icon">
                💊
              </div>

              <div>
                <strong>
                  {medicine.name}
                </strong>

                <small>
                  Batch: {medicine.batch || "N/A"}
                </small>
              </div>

            </div>

            <span>
              {medicine.category}
            </span>

            <span>
              {medicine.quantity}
            </span>

            <span>
              {formatDate(medicine.expiryDate)}
            </span>

            <span
              className={`status ${status
                .toLowerCase()
                .replace(" ", "-")}-status`}
            >
              {status}
            </span>

            <div className="table-actions">

              {onEdit && (
                <button
                  className="edit-button"
                  onClick={() => onEdit(medicine)}
                >
                  ✏️
                </button>
              )}

              {onDelete && (
                <button
                  className="delete-button"
                  onClick={() => onDelete(medicine.id)}
                >
                  🗑️
                </button>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}

/* =========================================================
   MEDICINES PAGE
========================================================= */

function MedicinesPage({
  medicines,
  onEdit,
  onDelete,
  setPage,
}) {
  return (
    <PageContainer
      title="Medicines"
      subtitle="View and manage all registered medicines."
      action={
        <button
          className="primary-button"
          onClick={() => setPage("add")}
        >
          + Add Medicine
        </button>
      }
    >

      <div className="stats-mini">

        <div>
          <strong>{medicines.length}</strong>
          <span>Total</span>
        </div>

        <div>
          <strong>
            {
              medicines.filter(
                (m) =>
                  getMedicineStatus(m.expiryDate) ===
                  "Safe"
              ).length
            }
          </strong>
          <span>Safe</span>
        </div>

        <div>
          <strong>
            {
              medicines.filter(
                (m) =>
                  getMedicineStatus(m.expiryDate) ===
                  "Expiring Soon"
              ).length
            }
          </strong>
          <span>Expiring Soon</span>
        </div>

        <div>
          <strong>
            {
              medicines.filter(
                (m) =>
                  getMedicineStatus(m.expiryDate) ===
                  "Expired"
              ).length
            }
          </strong>
          <span>Expired</span>
        </div>

      </div>

      <div className="dashboard-panel">

        <MedicineTable
          medicines={medicines}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      </div>

    </PageContainer>
  );
}

/* =========================================================
   ADD / EDIT MEDICINE
========================================================= */

function AddMedicinePage({
  onSave,
  setPage,
  editingMedicine,
}) {
  const [form, setForm] = useState({
    name: "",
    batch: "",
    category: "",
    quantity: "",
    manufacturingDate: "",
    expiryDate: "",
    notes: "",
  });

  useEffect(() => {

    if (editingMedicine) {
      setForm(editingMedicine);
    } else {
      setForm({
        name: "",
        batch: "",
        category: "",
        quantity: "",
        manufacturingDate: "",
        expiryDate: "",
        notes: "",
      });
    }

  }, [editingMedicine]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (
      !form.name ||
      !form.category ||
      !form.quantity ||
      !form.expiryDate
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    if (
      form.manufacturingDate &&
      new Date(form.expiryDate) <
        new Date(form.manufacturingDate)
    ) {
      alert(
        "Expiry date cannot be before manufacturing date."
      );
      return;
    }

    onSave({
      ...form,
      quantity: Number(form.quantity),
    });

    setPage("medicines");
  };

  const handleOCR = () => {

    alert(
      "OCR Scanner UI opened.\n\nIn the next step, we will connect Tesseract OCR to automatically extract the medicine name, batch number and expiry date."
    );

  };

  return (
    <PageContainer
      title={
        editingMedicine
          ? "Edit Medicine"
          : "Add Medicine"
      }
      subtitle={
        editingMedicine
          ? "Update the medicine information."
          : "Add medicine details to start tracking its expiry."
      }
      action={
        <button
          className="secondary-button"
          onClick={() => setPage("dashboard")}
        >
          ← Back to Dashboard
        </button>
      }
    >

      <div className="medicine-form-card">

        <div className="form-heading">

          <div className="form-heading-icon">
            💊
          </div>

          <div>
            <h2>Medicine Information</h2>

            <p>
              Enter the details mentioned on the medicine package.
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <FormInput
              label="Medicine Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Paracetamol"
              required
            />

            <FormInput
              label="Batch Number"
              name="batch"
              value={form.batch}
              onChange={handleChange}
              placeholder="e.g. PCM2026A"
            />

            <div className="form-group">

              <label>
                Category <span>*</span>
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select category
                </option>

                <option>Tablet</option>
                <option>Capsule</option>
                <option>Syrup</option>
                <option>Injection</option>
                <option>Cream</option>
                <option>Ointment</option>
                <option>Drops</option>
                <option>Powder</option>
                <option>Other</option>

              </select>

            </div>

            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
            />

            <FormInput
              label="Manufacturing Date"
              name="manufacturingDate"
              type="date"
              value={form.manufacturingDate}
              onChange={handleChange}
            />

            <FormInput
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group full-width">

            <label>Notes</label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any additional information..."
              rows="4"
            />

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() => setPage("dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
            >
              💊{" "}
              {editingMedicine
                ? "Update Medicine"
                : "Save Medicine"}
            </button>

          </div>

        </form>

      </div>

      <div className="ocr-card">

        <div className="ocr-icon">
          📷
        </div>

        <div className="ocr-content">

          <h3>
            Want to enter details automatically?
          </h3>

          <p>
            Scan the medicine package and automatically
            extract information such as medicine name,
            batch number and expiry date.
          </p>

        </div>

        <button
          className="scan-button"
          onClick={handleOCR}
        >
          📷 Scan Medicine
        </button>

      </div>

    </PageContainer>
  );
}

/* =========================================================
   FORM INPUT
========================================================= */

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  min,
}) {
  return (
    <div className="form-group">

      <label>
        {label}

        {required && <span> *</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
      />

    </div>
  );
}

/* =========================================================
   EXPIRING PAGE
========================================================= */

function ExpiringPage({
  medicines,
  setPage,
}) {
  const expiring = medicines
    .filter(
      (medicine) =>
        getMedicineStatus(medicine.expiryDate) !==
        "Safe"
    )
    .sort(
      (a, b) =>
        new Date(a.expiryDate) -
        new Date(b.expiryDate)
    );

  return (
    <PageContainer
      title="Expiry Tracking"
      subtitle="Medicines that require your attention."
      action={
        <button
          className="secondary-button"
          onClick={() => setPage("medicines")}
        >
          View All Medicines
        </button>
      }
    >

      <div className="expiry-alert">

        <span>⚠️</span>

        <div>
          <strong>
            Expiry monitoring
          </strong>

          <p>
            Medicines within 30 days of expiry
            are shown as "Expiring Soon".
          </p>
        </div>

      </div>

      <div className="dashboard-panel">

        {expiring.length === 0 ? (
          <div className="empty-state">
            <div>🎉</div>
            <h3>No medicines require attention</h3>
            <p>
              There are currently no expired or
              soon-to-expire medicines.
            </p>
          </div>
        ) : (
          <MedicineTable
            medicines={expiring}
          />
        )}

      </div>

    </PageContainer>
  );
}

/* =========================================================
   NOTIFICATIONS
========================================================= */

function NotificationsPage({
  medicines,
}) {
  const notifications = medicines
    .map((medicine) => ({
      medicine,
      days: getDaysUntilExpiry(
        medicine.expiryDate
      ),
    }))
    .filter(({ days }) => days <= 30)
    .sort((a, b) => a.days - b.days);

  return (
    <PageContainer
      title="Notifications"
      subtitle="Expiry alerts and medicine reminders."
    >

      <div className="notification-list">

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div>🔔</div>
            <h3>No notifications</h3>
            <p>
              You are all caught up.
            </p>
          </div>
        ) : (

          notifications.map(
            ({ medicine, days }) => {

              let message;

              if (days < 0) {
                message = `Expired ${Math.abs(days)} day(s) ago.`;
              } else if (days === 0) {
                message = "Expires today!";
              } else {
                message = `Expires in ${days} day(s).`;
              }

              return (
                <div
                  className={`notification-card ${
                    days < 0
                      ? "notification-danger"
                      : "notification-warning"
                  }`}
                  key={medicine.id}
                >

                  <div className="notification-icon">
                    {days < 0 ? "❌" : "⏰"}
                  </div>

                  <div>

                    <h3>
                      {medicine.name}
                    </h3>

                    <p>
                      {message}
                    </p>

                    <small>
                      Expiry:{" "}
                      {formatDate(
                        medicine.expiryDate
                      )}
                    </small>

                  </div>

                </div>
              );
            }
          )

        )}

      </div>

    </PageContainer>
  );
}

/* =========================================================
   REPORTS
========================================================= */

function ReportsPage({
  medicines,
}) {
  const total = medicines.length;

  const safe = medicines.filter(
    (m) =>
      getMedicineStatus(m.expiryDate) ===
      "Safe"
  ).length;

  const expiring = medicines.filter(
    (m) =>
      getMedicineStatus(m.expiryDate) ===
      "Expiring Soon"
  ).length;

  const expired = medicines.filter(
    (m) =>
      getMedicineStatus(m.expiryDate) ===
      "Expired"
  ).length;

  const categories = {};

  medicines.forEach((medicine) => {
    categories[medicine.category] =
      (categories[medicine.category] || 0) + 1;
  });

  return (
    <PageContainer
      title="Reports"
      subtitle="Overview of your medicine inventory."
    >

      <div className="report-grid">

        <ReportCard
          icon="💊"
          title="Total Medicines"
          value={total}
        />

        <ReportCard
          icon="✓"
          title="Safe"
          value={safe}
        />

        <ReportCard
          icon="⏰"
          title="Expiring Soon"
          value={expiring}
        />

        <ReportCard
          icon="❌"
          title="Expired"
          value={expired}
        />

      </div>

      <div className="dashboard-panel">

        <div className="panel-header">

          <div>
            <h2>Medicine Categories</h2>
            <p>
              Distribution of registered medicines
            </p>
          </div>

        </div>

        <div className="category-report">

          {Object.keys(categories).length === 0 ? (
            <div className="empty-state">
              No medicine data available.
            </div>
          ) : (

            Object.entries(categories).map(
              ([category, count]) => {

                const percentage =
                  total === 0
                    ? 0
                    : Math.round(
                        (count / total) * 100
                      );

                return (
                  <div
                    className="category-item"
                    key={category}
                  >

                    <div className="category-title">

                      <span>
                        {category}
                      </span>

                      <strong>
                        {count}
                      </strong>

                    </div>

                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <small>
                      {percentage}% of medicines
                    </small>

                  </div>
                );
              }
            )

          )}

        </div>

      </div>

    </PageContainer>
  );
}

/* =========================================================
   REPORT CARD
========================================================= */

function ReportCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="report-card">

      <div className="report-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  darkMode,
  setDarkMode,
}) {
  const [notifications, setNotifications] =
    useState(true);

  const [days, setDays] = useState(30);

  return (
    <PageContainer
      title="Settings"
      subtitle="Customize your Medical Expiry Reminder System."
    >

      <div className="settings-card">

        <div className="settings-section">

          <h2>Notification Settings</h2>

          <div className="setting-row">

            <div>
              <strong>
                Expiry Notifications
              </strong>

              <p>
                Receive alerts for medicines
                approaching their expiry date.
              </p>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) =>
                  setNotifications(
                    e.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>

          <div className="setting-row">

            <div>
              <strong>
                Alert Before Expiry
              </strong>

              <p>
                Number of days before expiry
                to display an alert.
              </p>
            </div>

            <select
              value={days}
              onChange={(e) =>
                setDays(e.target.value)
              }
            >
              <option value="7">
                7 days
              </option>

              <option value="15">
                15 days
              </option>

              <option value="30">
                30 days
              </option>

              <option value="60">
                60 days
              </option>
            </select>

          </div>

        </div>

        <div className="settings-section">

          <h2>Appearance</h2>

          <div className="setting-row">

            <div>
              <strong>
                Dark Mode
              </strong>

              <p>
                Change the appearance of the dashboard.
              </p>
            </div>

            <label className="switch">

              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) =>
                  setDarkMode(
                    e.target.checked
                  )
                }
              />

              <span></span>

            </label>

          </div>

        </div>

        <div className="settings-section">

          <h2>System Information</h2>

          <div className="system-info">

            <div>
              <span>Application</span>
              <strong>
                Medical Expiry Reminder System
              </strong>
            </div>

            <div>
              <span>Frontend</span>
              <strong>
                React + Vite
              </strong>
            </div>

            <div>
              <span>Backend</span>
              <strong>
                FastAPI
              </strong>
            </div>

            <div>
              <span>Database</span>
              <strong>
                PostgreSQL
              </strong>
            </div>

            <div>
              <span>OCR</span>
              <strong>
                Tesseract OCR
              </strong>
            </div>

          </div>

        </div>

      </div>

    </PageContainer>
  );
}

/* =========================================================
   PAGE CONTAINER
========================================================= */

function PageContainer({
  title,
  subtitle,
  action,
  children,
}) {
  return (
    <div>

      <div className="page-header">

        <div>

          <p className="page-label">
            MEDICINE MANAGEMENT
          </p>

          <h1>{title}</h1>

          <p>{subtitle}</p>

        </div>

        {action}

      </div>

      {children}

    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  const [page, setPage] =
    useState("dashboard");

  const [search, setSearch] =
    useState("");

  const [editingMedicine, setEditingMedicine] =
    useState(null);

  const [darkMode, setDarkMode] =
    useState(
      localStorage.getItem(
        "medExpiryDarkMode"
      ) === "true"
    );

  const [medicines, setMedicines] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "medExpiryMedicines"
        );

      return saved
        ? JSON.parse(saved)
        : initialMedicines;

    });

  /* Save medicines to browser */

  useEffect(() => {

    localStorage.setItem(
      "medExpiryMedicines",
      JSON.stringify(medicines)
    );

  }, [medicines]);

  /* Save dark mode */

  useEffect(() => {

    localStorage.setItem(
      "medExpiryDarkMode",
      darkMode
    );

  }, [darkMode]);

  /* Filter medicines */

  const filteredMedicines = useMemo(() => {

    if (!search.trim()) {
      return medicines;
    }

    const query =
      search.toLowerCase();

    return medicines.filter(
      (medicine) =>
        medicine.name
          .toLowerCase()
          .includes(query) ||
        medicine.batch
          ?.toLowerCase()
          .includes(query) ||
        medicine.category
          ?.toLowerCase()
          .includes(query)
    );

  }, [medicines, search]);

  /* Notification count */

  const notificationCount =
    medicines.filter(
      (medicine) =>
        getDaysUntilExpiry(
          medicine.expiryDate
        ) <= 30
    ).length;

  /* Login */

  if (!loggedIn) {

    return (
      <LoginPage
        onLogin={() => setLoggedIn(true)}
      />
    );

  }

  /* Save / update medicine */

  const handleSaveMedicine = (medicine) => {

    if (medicine.id) {

      setMedicines((previous) =>
        previous.map((item) =>
          item.id === medicine.id
            ? medicine
            : item
        )
      );

    } else {

      const newMedicine = {
        ...medicine,
        id: Date.now(),
      };

      setMedicines((previous) => [
        ...previous,
        newMedicine,
      ]);

    }

    setEditingMedicine(null);

  };

  /* Edit */

  const handleEdit = (medicine) => {

    setEditingMedicine(medicine);
    setPage("add");

  };

  /* Delete */

  const handleDelete = (id) => {

    const medicine =
      medicines.find(
        (item) => item.id === id
      );

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${medicine?.name}?`
      );

    if (!confirmDelete) return;

    setMedicines((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );

  };

  /* Logout */

  const handleLogout = () => {

    localStorage.removeItem(
      "medExpiryLoggedIn"
    );

    setLoggedIn(false);
    setPage("dashboard");

  };

  /* Export CSV */

  const exportCSV = () => {

    if (medicines.length === 0) {
      alert("No medicine data to export.");
      return;
    }

    const headers = [
      "Medicine Name",
      "Batch Number",
      "Category",
      "Quantity",
      "Manufacturing Date",
      "Expiry Date",
      "Status",
      "Notes",
    ];

    const rows = medicines.map(
      (medicine) => [
        medicine.name,
        medicine.batch,
        medicine.category,
        medicine.quantity,
        medicine.manufacturingDate,
        medicine.expiryDate,
        getMedicineStatus(
          medicine.expiryDate
        ),
        medicine.notes,
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "medicine-report.csv";

    link.click();

    URL.revokeObjectURL(url);

  };

  return (
    <div
      className={`app ${
        darkMode ? "dark-mode" : ""
      }`}
    >

      <Sidebar
        page={page}
        setPage={(newPage) => {

          if (newPage === "add") {
            setEditingMedicine(null);
          }

          setPage(newPage);

        }}
        onLogout={handleLogout}
      />

      <main className="main-content">

        <Topbar
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          notificationCount={
            notificationCount
          }
        />

        <div className="content-area">

          {page === "dashboard" && (

            <Dashboard
              medicines={medicines}
              setPage={setPage}
              setEditingMedicine={
                setEditingMedicine
              }
            />

          )}

          {page === "medicines" && (

            <MedicinesPage
              medicines={filteredMedicines}
              onEdit={handleEdit}
              onDelete={handleDelete}
              setPage={setPage}
            />

          )}

          {page === "add" && (

            <AddMedicinePage
              onSave={handleSaveMedicine}
              setPage={setPage}
              editingMedicine={
                editingMedicine
              }
            />

          )}

          {page === "expiring" && (

            <ExpiringPage
              medicines={medicines}
              setPage={setPage}
            />

          )}

          {page === "notifications" && (

            <NotificationsPage
              medicines={medicines}
            />

          )}

          {page === "reports" && (

            <ReportsPage
              medicines={medicines}
            />

          )}

          {page === "settings" && (

            <SettingsPage
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />

          )}

          {page === "reports" && (
            <div className="export-container">

              <button
                className="export-button"
                onClick={exportCSV}
              >
                📥 Export Medicine Report
              </button>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default App;