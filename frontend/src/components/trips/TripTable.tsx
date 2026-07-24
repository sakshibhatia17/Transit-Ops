import { Eye, Pencil, Trash2, type LucideIcon } from "lucide-react";
import type { Trip } from "./types";
import {
  formatDistance,
  formatWeight,
  getStatusColor,
} from "./tripUtils";

interface TripTableProps {
  trips: Trip[];
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
}

interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  color: string;
  onClick: () => void;
}

function ActionButton({
  icon: Icon,
  title,
  color,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`rounded-md p-2 transition hover:bg-slate-100 ${color}`}
    >
      <Icon size={18} />
    </button>
  );
}

function TripTable({
  trips,
  onView,
  onEdit,
  onDelete,
}: TripTableProps) {
  if (trips.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
        <div className="text-5xl">🚚</div>

        <h2 className="mt-4 text-xl font-semibold text-slate-700">
          No trips found
        </h2>

        <p className="mt-2 text-slate-500">
          Try changing the search or filters,
          or create your first trip.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr className="text-left text-sm font-semibold text-slate-600">
            <th className="px-5 py-4">Trip ID</th>
            <th className="px-5 py-4">Driver</th>
            <th className="px-5 py-4">Vehicle</th>
            <th className="px-5 py-4">Route</th>
            <th className="px-5 py-4">Cargo</th>
            <th className="px-5 py-4">Distance</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => (
            <tr
              key={trip.id}
              className="border-t transition hover:bg-slate-50"
            >
              <td className="px-5 py-4 font-medium">
                {trip.id.slice(0, 8)}
              </td>

              <td className="px-5 py-4">
                {trip.driver.name}
              </td>

              <td className="px-5 py-4">
                {trip.vehicle.registrationNo}
              </td>

              <td className="px-5 py-4">
                <div className="flex flex-col">
                  <span>{trip.source}</span>

                  <span className="text-slate-400">
                    →
                  </span>

                  <span>{trip.destination}</span>
                </div>
              </td>

              <td className="px-5 py-4">
                {formatWeight(trip.cargoWeight)}
              </td>

              <td className="px-5 py-4">
                {formatDistance(trip.plannedDistance)}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                    trip.status
                  )}`}
                >
                  {trip.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-center gap-2">
                  <ActionButton
                    icon={Eye}
                    title="View Trip"
                    color="text-blue-600"
                    onClick={() => onView(trip)}
                  />

                  <ActionButton
                    icon={Pencil}
                    title="Edit Trip"
                    color="text-amber-600"
                    onClick={() => onEdit(trip)}
                  />

                  <ActionButton
                    icon={Trash2}
                    title="Delete Trip"
                    color="text-red-600"
                    onClick={() => onDelete(trip)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TripTable;