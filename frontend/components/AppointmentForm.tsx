"use client";

import { useState, useEffect, FormEvent } from "react";
import type { Service, AppointmentFormData, ApiErrors } from "@/types";

interface Props {
  services: Service[];
  onSave: (data: AppointmentFormData) => Promise<void>;
  onCancel: () => void;
}

const empty: AppointmentFormData = {
  customer_name: "",
  customer_phone: "",
  service: "",
  appointment_date: "",
  appointment_time: "",
  notes: "",
};

function getApiMsg(apiErrors: ApiErrors, key: string): string {
  return apiErrors[key]?.join(" ") ?? "";
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "7px 10px",
  fontSize: 13,
  border: `1px solid ${hasError ? "#f87171" : "#d1d5db"}`,
  borderRadius: 6,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  color: "#111827",
});

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#374151",
  marginBottom: 5,
};

const errStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#dc2626",
  marginTop: 3,
};

export default function AppointmentForm({ services, onSave, onCancel }: Props) {
  const [form, setForm] = useState<AppointmentFormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentFormData, string>>>({});
  const [apiErrors, setApiErrors] = useState<ApiErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(empty);
    setErrors({});
    setApiErrors({});
  }, []);

  function validate(): boolean {
    const errs: Partial<Record<keyof AppointmentFormData, string>> = {};
    if (!form.customer_name.trim()) errs.customer_name = "Customer name is required.";
    if (!form.customer_phone.trim()) errs.customer_phone = "Phone number is required.";
    if (!form.service) errs.service = "Please select a service.";
    if (!form.appointment_date) errs.appointment_date = "Date is required.";
    if (!form.appointment_time) errs.appointment_time = "Time is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setApiErrors({});
    try {
      await onSave(form);
    } catch (err: unknown) {
      const apiErr = err as { body: ApiErrors };
      if (apiErr?.body && typeof apiErr.body === "object") {
        setApiErrors(apiErr.body as ApiErrors);
      }
    } finally {
      setSaving(false);
    }
  }

  function update(key: keyof AppointmentFormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  }

  const topErrors: string[] = [
    ...(apiErrors["non_field_errors"] ?? []),
    ...(apiErrors["detail"] ? [apiErrors["detail"] as unknown as string] : []),
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appt-modal-title"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            width: "100%",
            maxWidth: 480,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h2
              id="appt-modal-title"
              style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}
            >
              New Appointment
            </h2>
            <button
              onClick={onCancel}
              aria-label="Close"
              style={{
                background: "none",
                border: "none",
                fontSize: 20,
                color: "#9ca3af",
                cursor: "pointer",
                lineHeight: 1,
                padding: 0,
              }}
            >
              ×
            </button>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} noValidate style={{ padding: "18px 20px 20px" }}>
            {/* Conflict / top-level errors */}
            {topErrors.length > 0 && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  borderRadius: 6,
                  padding: "10px 12px",
                  marginBottom: 14,
                  fontSize: 13,
                  color: "#dc2626",
                }}
              >
                {topErrors.map((msg, i) => (
                  <p key={i} style={{ margin: 0 }}>{msg}</p>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Customer name */}
              <div>
                <label htmlFor="appt-customer-name" style={labelStyle}>
                  Customer Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="appt-customer-name"
                  type="text"
                  value={form.customer_name}
                  placeholder="e.g. Jane Smith"
                  onChange={(e) => update("customer_name", e.target.value)}
                  style={inputStyle(!!(errors.customer_name || getApiMsg(apiErrors, "customer_name")))}
                />
                {(errors.customer_name || getApiMsg(apiErrors, "customer_name")) && (
                  <p style={errStyle}>{errors.customer_name || getApiMsg(apiErrors, "customer_name")}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="appt-customer-phone" style={labelStyle}>
                  Phone <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  id="appt-customer-phone"
                  type="tel"
                  value={form.customer_phone}
                  placeholder="e.g. 07700 900000"
                  onChange={(e) => update("customer_phone", e.target.value)}
                  style={inputStyle(!!(errors.customer_phone || getApiMsg(apiErrors, "customer_phone")))}
                />
                {(errors.customer_phone || getApiMsg(apiErrors, "customer_phone")) && (
                  <p style={errStyle}>{errors.customer_phone || getApiMsg(apiErrors, "customer_phone")}</p>
                )}
              </div>

              {/* Service */}
              <div>
                <label htmlFor="appt-service" style={labelStyle}>
                  Service <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  id="appt-service"
                  value={form.service}
                  onChange={(e) => update("service", e.target.value)}
                  style={{
                    ...inputStyle(!!(errors.service || getApiMsg(apiErrors, "service"))),
                    cursor: "pointer",
                  }}
                >
                  <option value="">— Select a service —</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — Rs.{parseFloat(s.price).toFixed(2)} ({s.duration} min)
                    </option>
                  ))}
                </select>
                {(errors.service || getApiMsg(apiErrors, "service")) && (
                  <p style={errStyle}>{errors.service || getApiMsg(apiErrors, "service")}</p>
                )}
              </div>

              {/* Date + Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label htmlFor="appt-date" style={labelStyle}>
                    Date <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="appt-date"
                    type="date"
                    value={form.appointment_date}
                    onChange={(e) => update("appointment_date", e.target.value)}
                    style={inputStyle(!!(errors.appointment_date || getApiMsg(apiErrors, "appointment_date")))}
                  />
                  {(errors.appointment_date || getApiMsg(apiErrors, "appointment_date")) && (
                    <p style={errStyle}>{errors.appointment_date || getApiMsg(apiErrors, "appointment_date")}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="appt-time" style={labelStyle}>
                    Time <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    id="appt-time"
                    type="time"
                    value={form.appointment_time}
                    onChange={(e) => update("appointment_time", e.target.value)}
                    style={inputStyle(!!(errors.appointment_time || getApiMsg(apiErrors, "appointment_time")))}
                  />
                  {(errors.appointment_time || getApiMsg(apiErrors, "appointment_time")) && (
                    <p style={errStyle}>{errors.appointment_time || getApiMsg(apiErrors, "appointment_time")}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="appt-notes" style={labelStyle}>
                  Notes{" "}
                  <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  id="appt-notes"
                  rows={2}
                  value={form.notes}
                  placeholder="Any special requests…"
                  onChange={(e) => update("notes", e.target.value)}
                  style={{
                    ...inputStyle(false),
                    resize: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                id="appt-form-submit"
                type="submit"
                disabled={saving}
                style={{
                  padding: "7px 16px",
                  background: saving ? "#6b7280" : "#004a97",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Booking…" : "Book Appointment"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: "7px 14px",
                  background: "none",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#374151",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
