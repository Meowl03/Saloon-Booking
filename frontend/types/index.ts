// Types matching the Django backend models exactly

export interface Service {
  id: number;
  name: string;
  price: string; // Django DecimalField serializes as string
  duration: number; // minutes
}

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Appointment {
  id: number;
  customer_name: string;
  customer_phone: string;
  service: number; // FK id
  appointment_date: string; // ISO date string (DateTimeField)
  appointment_time: string; // "HH:MM:SS"
  notes: string;
  status: AppointmentStatus;
  created_at: string;
}

// Form data types

export interface ServiceFormData {
  name: string;
  price: string;
  duration: string;
}

export interface AppointmentFormData {
  customer_name: string;
  customer_phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
}

// API error shape from DRF
export type ApiErrors = Record<string, string[]>;
