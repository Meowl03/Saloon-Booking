"use client";

import { useState, useEffect, useCallback } from "react";
import type { Appointment, AppointmentStatus, Service, AppointmentFormData } from "@/types";
import {
  getAppointments,
  getServices,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/lib/api";
import AppointmentForm from "@/components/AppointmentForm";
import AppointmentTable from "@/components/AppointmentTable";
import StatusSelect from "@/components/StatusSelect";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AppointmentStatus | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [appts, svcs] = await Promise.all([getAppointments(), getServices()]);
      setAppointments(appts);
      setServices(svcs);
    } catch {
      setLoadError("Failed to load data. Is the Django backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleCreate(data: AppointmentFormData) {
    const created = await createAppointment(data);
    setAppointments((prev) => [created, ...prev]);
    setShowForm(false);
    showToast("Appointment booked.", true);
  }

  async function handleStatusChange(id: number, status: AppointmentStatus) {
    try {
      const updated = await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      showToast(`Status updated to ${status}.`, true);
    } catch {
      showToast("Failed to update status.", false);
    }
  }

  async function handleDelete(appt: Appointment) {
    if (!window.confirm(`Delete appointment for "${appt.customer_name}"?`)) return;
    try {
      await deleteAppointment(appt.id);
      setAppointments((prev) => prev.filter((a) => a.id !== appt.id));
      showToast("Appointment deleted.", true);
    } catch {
      showToast("Failed to delete appointment.", false);
    }
  }

  const filtered =
    filter === "All" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 100,
            padding: "10px 16px",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500,
            background: toast.ok ? "#16a34a" : "#dc2626",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <AppointmentForm
          services={services}
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>
            Appointments
          </h1>
          {!loading && (
            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>
              {appointments.length} total
            </p>
          )}
        </div>
        <button
          id="new-appointment-btn"
          onClick={() => setShowForm(true)}
          style={{
            padding: "7px 14px",
            background: "#004a97",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          New Appointment
        </button>
      </div>

      {/* Status filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <label
          htmlFor="status-filter"
          style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}
        >
          Filter by status
        </label>
        <StatusSelect
          id="status-filter"
          value={filter}
          onChange={(v) => setFilter(v)}
          includeAll
        />
        {filter !== "All" && (
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            {appointments.filter((a) => a.status === filter).length} result{appointments.filter((a) => a.status === filter).length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Table card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
        }}
      >
        {loading ? (
          <p style={{ padding: "48px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
            Loading appointments…
          </p>
        ) : loadError ? (
          <div
            style={{
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#dc2626",
              fontSize: 13,
            }}
          >
            <span>{loadError}</span>
            <button
              onClick={fetchAll}
              style={{
                marginLeft: "auto",
                fontSize: 12,
                color: "#004a97",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <AppointmentTable
            appointments={filtered}
            services={services}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
