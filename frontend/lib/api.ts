import type {
  Service,
  Appointment,
  ServiceFormData,
  AppointmentFormData,
  AppointmentStatus,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not set.");
}

// ─── Helpers ────────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json();

  if (!res.ok) {
    // Attach parsed error body so callers can display DRF validation errors
    const err = new Error("API request failed") as Error & { body: unknown; status: number };
    err.body = data;
    err.status = res.status;
    throw err;
  }

  return data as T;
}

// ─── Services ───────────────────────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  return request<Service[]>("/services");
}

export async function createService(data: ServiceFormData): Promise<Service> {
  return request<Service>("/services", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      price: data.price,
      duration: Number(data.duration),
    }),
  });
}

export async function updateService(id: number, data: ServiceFormData): Promise<Service> {
  return request<Service>(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      price: data.price,
      duration: Number(data.duration),
    }),
  });
}

export async function deleteService(id: number): Promise<void> {
  return request<void>(`/services/${id}`, { method: "DELETE" });
}

// ─── Appointments ────────────────────────────────────────────────────────────

export async function getAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/appointments");
}

export async function createAppointment(data: AppointmentFormData): Promise<Appointment> {
  return request<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify({
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      service: Number(data.service),
      appointment_date: data.appointment_date, // "YYYY-MM-DD"
      appointment_time: data.appointment_time, // "HH:MM"
      notes: data.notes,
    }),
  });
}

export async function updateAppointmentStatus(
  id: number,
  status: AppointmentStatus
): Promise<Appointment> {
  return request<Appointment>(`/appointments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteAppointment(id: number): Promise<void> {
  return request<void>(`/appointments/${id}`, { method: "DELETE" });
}
