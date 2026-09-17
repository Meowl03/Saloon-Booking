"use client";

import type { Appointment, AppointmentStatus, Service } from "@/types";
import StatusSelect from "@/components/StatusSelect";

interface Props {
  appointments: Appointment[];
  services: Service[];
  onStatusChange: (id: number, status: AppointmentStatus) => void;
  onDelete: (appointment: Appointment) => void;
}



function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string): string {
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10);
  const m = parts[1] ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

const thStyle: React.CSSProperties = {
  padding: "10px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
  background: "#f9fafb",
};

const tdStyle: React.CSSProperties = {
  padding: "11px 16px",
  fontSize: 13,
  color: "#374151",
  whiteSpace: "nowrap",
};

export default function AppointmentTable({
  appointments,
  services,
  onStatusChange,
  onDelete,
}: Props) {
  const serviceMap = new Map(services.map((s) => [s.id, s.name]));

  if (appointments.length === 0) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "#9ca3af" }}>
        <p style={{ fontSize: 13 }}>No appointments found.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          minWidth: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Phone</th>
            <th style={thStyle}>Service</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Status</th>
            <th style={{ ...thStyle, textAlign: "right", paddingRight: 24 }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appt) => (
            <tr
              key={appt.id}
              style={{ borderBottom: "1px solid #f3f4f6", background: "#fff" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#f9fafb")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#fff")
              }
            >
              <td style={{ ...tdStyle, fontWeight: 500, color: "#111827" }}>
                {appt.customer_name}
              </td>
              <td style={tdStyle}>{appt.customer_phone}</td>
              <td style={tdStyle}>
                {serviceMap.get(appt.service) ?? `#${appt.service}`}
              </td>
              <td style={tdStyle}>{formatDate(appt.appointment_date)}</td>
              <td style={tdStyle}>{formatTime(appt.appointment_time)}</td>
              <td style={tdStyle}>
                <StatusSelect
                  id={`appt-status-${appt.id}`}
                  value={appt.status}
                  onChange={(v) => onStatusChange(appt.id, v as AppointmentStatus)}
                />
              </td>
              <td style={{ ...tdStyle, textAlign: "right", paddingRight: 20 }}>
                <button
                  id={`delete-appt-${appt.id}`}
                  onClick={() => onDelete(appt)}
                  style={{
                    fontSize: 12,
                    padding: "3px 10px",
                    border: "1px solid #fca5a5",
                    borderRadius: 5,
                    background: "#fff5f5",
                    color: "#dc2626",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
