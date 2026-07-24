import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Trip } from "./types";

type DriverOption = {
  id: string;
  name: string;
};

type VehicleOption = {
  id: string;
  registrationNo: string;
};

export interface TripFormData {
  source: string;
  destination: string;
  driverId: string;
  vehicleId: string;
  cargoWeight: number;
  plannedDistance: number;
}

interface TripFormModalProps {
  open: boolean;
  mode: "add" | "edit";

  trip?: Trip | null;

  drivers: DriverOption[];
  vehicles: VehicleOption[];

  loading?: boolean;

  onClose: () => void;
  onSubmit: (data: TripFormData) => void;
}

interface InputFieldProps {
  label: string;
  name: keyof TripFormData;
  type?: string;
  value: string | number;
  error?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

interface SelectFieldProps {
  label: string;
  name: keyof TripFormData;
  value: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

function InputField({
  label,
  name,
  type = "text",
  value,
  error,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
          error ? "border-red-500" : "border-slate-300 focus:border-[#22577A]"
        }`}
      />

      <div className="mt-1 h-5">
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  error,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
          error ? "border-red-500" : "border-slate-300 focus:border-[#22577A]"
        }`}
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="mt-1 h-5">
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

function TripFormModal({
  open,
  mode,
  trip,
  drivers,
  vehicles,
  loading = false,
  onClose,
  onSubmit,
}: TripFormModalProps) {
  const [formData, setFormData] = useState<TripFormData>({
    source: "",
    destination: "",
    driverId: "",
    vehicleId: "",
    cargoWeight: 0,
    plannedDistance: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TripFormData, string>>
  >({});

  useEffect(() => {
    if (mode === "edit" && trip) {
      setFormData({
        source: trip.source,
        destination: trip.destination,
        driverId: trip.driver.id,
        vehicleId: trip.vehicle.id,
        cargoWeight: trip.cargoWeight,
        plannedDistance: trip.plannedDistance,
      });
    } else {
      setFormData({
        source: "",
        destination: "",
        driverId: "",
        vehicleId: "",
        cargoWeight: 0,
        plannedDistance: 0,
      });
    }

    setErrors({});
  }, [mode, trip, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cargoWeight" || name === "plannedDistance"
          ? Number(value)
          : value,
    }));

    if (errors[name as keyof TripFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof TripFormData, string>> = {};

    if (!formData.source.trim()) newErrors.source = "Source is required.";

    if (!formData.destination.trim())
      newErrors.destination = "Destination is required.";

    if (!formData.driverId) newErrors.driverId = "Select a driver.";

    if (!formData.vehicleId) newErrors.vehicleId = "Select a vehicle.";

    if (formData.cargoWeight <= 0)
      newErrors.cargoWeight = "Cargo weight must be greater than 0.";

    if (formData.plannedDistance <= 0)
      newErrors.plannedDistance = "Distance must be greater than 0.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit(formData);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {mode === "add" ? "Create Trip" : "Edit Trip"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          <InputField
            label="Source"
            name="source"
            value={formData.source}
            error={errors.source}
            onChange={handleChange}
          />

          <InputField
            label="Destination"
            name="destination"
            value={formData.destination}
            error={errors.destination}
            onChange={handleChange}
          />

          <SelectField
            label="Driver"
            name="driverId"
            value={formData.driverId}
            error={errors.driverId}
            onChange={handleChange}
            options={drivers.map((driver) => ({
              value: driver.id,
              label: driver.name,
            }))}
          />

          <SelectField
            label="Vehicle"
            name="vehicleId"
            value={formData.vehicleId}
            error={errors.vehicleId}
            onChange={handleChange}
            options={vehicles.map((vehicle) => ({
              value: vehicle.id,
              label: vehicle.registrationNo,
            }))}
          />

          <InputField
            label="Cargo Weight (kg)"
            name="cargoWeight"
            type="number"
            value={formData.cargoWeight}
            error={errors.cargoWeight}
            onChange={handleChange}
          />

          <InputField
            label="Planned Distance (km)"
            name="plannedDistance"
            type="number"
            value={formData.plannedDistance}
            error={errors.plannedDistance}
            onChange={handleChange}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-5 py-2 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-[#22577A] px-5 py-2 font-medium text-white transition hover:bg-[#1B4560] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? mode === "add"
                ? "Creating..."
                : "Saving..."
              : mode === "add"
                ? "Create Trip"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripFormModal;
