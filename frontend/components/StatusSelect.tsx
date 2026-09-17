import type { AppointmentStatus } from "@/types";

export const STATUS_OPTIONS: AppointmentStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

// Colour map used both for styling the select and for any badge-like rendering
export const statusColors: Record<AppointmentStatus, { background: string; color: string }> = {
  Pending:   { background: "#fef3c7", color: "#92400e" },
  Confirmed: { background: "#dbeafe", color: "#1e3a8a" },
  Completed: { background: "#dcfce7", color: "#14532d" },
  Cancelled: { background: "#fee2e2", color: "#7f1d1d" },
};

interface Props {
  id?: string;
  value: AppointmentStatus | "All";
  onChange: (value: AppointmentStatus | "All") => void;
  /** When true, prepends an "All statuses" option */
  includeAll?: boolean;
}

export default function StatusSelect({ id, value, onChange, includeAll = false }: Props) {
  const colors =
    value !== "All" ? statusColors[value] : { background: "#fff", color: "#374151" };

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as AppointmentStatus | "All")}
      style={{
        fontSize: 12,
        border: "1px solid #d1d5db",
        borderRadius: 5,
        padding: "3px 8px",
        background: colors.background,
        color: colors.color,
        fontWeight: 600,
        cursor: "pointer",
        outline: "none",
      }}
    >
      {includeAll && <option value="All">All statuses</option>}
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
