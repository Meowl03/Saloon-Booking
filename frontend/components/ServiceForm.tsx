"use client";

import { useState, useEffect, FormEvent } from "react";
import type { Service, ServiceFormData, ApiErrors } from "@/types";

interface Props {
  service?: Service | null;
  onSave: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
}

const empty: ServiceFormData = { name: "", price: "", duration: "" };

function getFieldErrors(apiErrors: ApiErrors, field: string): string {
  return apiErrors[field]?.join(" ") ?? "";
}

export default function ServiceForm({ service, onSave, onCancel }: Props) {
  const [form, setForm] = useState<ServiceFormData>(empty);
  const [errors, setErrors] = useState<Partial<ServiceFormData>>({});
  const [apiErrors, setApiErrors] = useState<ApiErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        price: service.price,
        duration: String(service.duration),
      });
    } else {
      setForm(empty);
    }
    setErrors({});
    setApiErrors({});
  }, [service]);

  function validate(): boolean {
    const errs: Partial<ServiceFormData> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    const price = parseFloat(form.price);
    if (!form.price || isNaN(price) || price <= 0)
      errs.price = "Price must be a positive number.";
    const dur = parseInt(form.duration, 10);
    if (!form.duration || isNaN(dur) || dur <= 0)
      errs.duration = "Duration must be greater than 0.";
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
        setApiErrors(apiErr.body);
      }
    } finally {
      setSaving(false);
    }
  }

  function field(key: keyof ServiceFormData, label: string, type = "text", placeholder = "") {
    const fieldError = errors[key] || getFieldErrors(apiErrors, key);
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        <input
          id={`service-${key}`}
          type={type}
          step={type === "number" ? "0.01" : undefined}
          min={type === "number" ? "0.01" : undefined}
          value={form[key]}
          placeholder={placeholder}
          onChange={(e) => {
            setForm((f) => ({ ...f, [key]: e.target.value }));
            if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
          }}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 transition ${
            fieldError ? "border-red-400" : "border-slate-300"
          }`}
        />
        {fieldError && (
          <p className="text-red-600 text-xs mt-1">{fieldError}</p>
        )}
      </div>
    );
  }

  // Top-level non-field DRF errors (e.g. non_field_errors)
  const topErrors =
    apiErrors["non_field_errors"] ??
    apiErrors["detail"] ??
    [];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {topErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
          {topErrors.join(" ")}
        </div>
      )}
      {field("name", "Service Name", "text", "e.g. Haircut")}
      {field("price", "Price (Rs.)", "number", "e.g. 25.00")}
      {field("duration", "Duration (minutes)", "number", "e.g. 30")}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          id="service-form-submit"
          className="px-4 py-2 text-white text-sm font-medium rounded-md disabled:opacity-60 transition"
          style={{ background: saving ? "#6b7280" : "#004a97" }}
        >
          {saving ? "Saving…" : service ? "Update Service" : "Add Service"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
