"use client";

import type { Service } from "@/types";

interface Props {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
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
};

export default function ServiceTable({ services, onEdit, onDelete }: Props) {
  if (services.length === 0) {
    return (
      <div style={{ padding: "48px 0", textAlign: "center", color: "#9ca3af" }}>
        <p style={{ fontSize: 13 }}>No services yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ minWidth: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <th style={thStyle}>Service Name</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Duration</th>
            <th style={{ ...thStyle, textAlign: "right", paddingRight: 24 }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {services.map((s) => (
            <tr
              key={s.id}
              style={{ borderBottom: "1px solid #f3f4f6", background: "#fff" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#f9fafb")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#fff")
              }
            >
              <td style={{ ...tdStyle, fontWeight: 500, color: "#111827" }}>
                {s.name}
              </td>
              <td style={tdStyle}>Rs.{parseFloat(s.price).toFixed(2)}</td>
              <td style={tdStyle}>{s.duration} min</td>
              <td style={{ ...tdStyle, textAlign: "right", paddingRight: 20 }}>
                <div
                  style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <button
                    id={`edit-service-${s.id}`}
                    onClick={() => onEdit(s)}
                    style={{
                      fontSize: 12,
                      padding: "3px 10px",
                      border: "1px solid #d1d5db",
                      borderRadius: 5,
                      background: "#fff",
                      color: "#374151",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    id={`delete-service-${s.id}`}
                    onClick={() => onDelete(s)}
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
