"use client";

import { useState, useEffect, useCallback } from "react";
import type { Service, ServiceFormData } from "@/types";
import { getServices, createService, updateService, deleteService } from "@/lib/api";
import ServiceForm from "@/components/ServiceForm";
import ServiceTable from "@/components/ServiceTable";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getServices();
      setServices(data);
    } catch {
      setLoadError("Failed to load services. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  function openCreate() {
    setEditingService(null);
    setShowForm(true);
  }

  function openEdit(service: Service) {
    setEditingService(service);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingService(null);
  }

  async function handleSave(data: ServiceFormData) {
    if (editingService) {
      const updated = await updateService(editingService.id, data);
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      showToast("Service updated.", true);
    } else {
      const created = await createService(data);
      setServices((prev) => [...prev, created]);
      showToast("Service added.", true);
    }
    closeForm();
  }

  async function handleDelete(service: Service) {
    if (!window.confirm(`Delete "${service.name}"?`)) return;
    try {
      await deleteService(service.id);
      setServices((prev) => prev.filter((s) => s.id !== service.id));
      showToast("Service deleted.", true);
    } catch {
      showToast("Failed to delete service.", false);
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
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

      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>
          Services
        </h1>
        <button
          id="add-service-btn"
          onClick={openCreate}
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
          Add Service
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: "#111827" }}>
            {editingService ? `Edit — ${editingService.name}` : "New Service"}
          </p>
          <ServiceForm
            service={editingService}
            onSave={handleSave}
            onCancel={closeForm}
          />
        </div>
      )}

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
            Loading services…
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
              onClick={fetchServices}
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
          <ServiceTable
            services={services}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
