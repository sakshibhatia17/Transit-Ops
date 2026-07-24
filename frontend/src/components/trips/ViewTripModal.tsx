import { X } from "lucide-react";
import type { Trip } from "./types";
import { formatDistance, formatWeight, getStatusColor } from "./tripUtils";

interface ViewTripModalProps {
  open: boolean;
  trip: Trip | null;

  onClose: () => void;

  onDispatch: (trip: Trip) => void;
  onComplete: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between border-b py-3">
      <span className="font-medium text-slate-600">{label}</span>

      <span className="text-right">{value}</span>
    </div>
  );
}

function ViewTripModal({
  open,
  trip,
  onClose,
  onDispatch,
  onComplete,
  onCancel,
}: ViewTripModalProps) {
  if (!open || !trip) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Trip Details</h2>

          <button
            onClick={onClose}
            className="rounded-md p-2 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-2 p-6">
          <DetailRow label="Trip ID" value={trip.id.slice(0, 8)} />

          <DetailRow label="Driver" value={trip.driver.name} />

          <DetailRow label="Vehicle" value={trip.vehicle.registrationNo} />

          <DetailRow
            label="Route"
            value={`${trip.source} → ${trip.destination}`}
          />

          <DetailRow
            label="Cargo Weight"
            value={formatWeight(trip.cargoWeight)}
          />

          <DetailRow
            label="Planned Distance"
            value={formatDistance(trip.plannedDistance)}
          />

          <DetailRow
            label="Actual Distance"
            value={
              trip.actualDistance ? formatDistance(trip.actualDistance) : "-"
            }
          />

          <DetailRow
            label="Fuel Consumed"
            value={trip.fuelConsumed ? `${trip.fuelConsumed} L` : "-"}
          />

          <DetailRow
            label="Status"
            value={
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                  trip.status,
                )}`}
              >
                {trip.status}
              </span>
            }
          />
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-end gap-3 border-t px-6 py-4">
          {trip.status === "DRAFT" && (
            <button
              onClick={() => onDispatch(trip)}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Dispatch
            </button>
          )}

          {trip.status === "DISPATCHED" && (
            <>
              <button
                onClick={() => onComplete(trip)}
                className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
              >
                Complete
              </button>

              <button
                onClick={() => onCancel(trip)}
                className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewTripModal;
