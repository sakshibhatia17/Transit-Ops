import type { Trip } from "./types";

interface DeleteTripModalProps {
  open: boolean;
  trip: Trip | null;
  loading?: boolean;

  onClose: () => void;
  onConfirm: (trip: Trip) => void;
}

function DeleteTripModal({
  open,
  trip,
  loading = false,
  onClose,
  onConfirm,
}: DeleteTripModalProps) {
  if (!open || !trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-red-600">
            Delete Trip
          </h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-slate-700">
            Are you sure you want to delete this trip?
          </p>

          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
            <p>
              <strong>Route:</strong> {trip.source} → {trip.destination}
            </p>

            <p>
              <strong>Driver:</strong> {trip.driver.name}
            </p>

            <p>
              <strong>Vehicle:</strong> {trip.vehicle.registrationNo}
            </p>
          </div>

          <p className="mt-4 text-sm text-red-500">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(trip)}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTripModal;