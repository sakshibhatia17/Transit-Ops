import {
  ClipboardList,
  FileEdit,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Trip } from "./types";

interface TripStatsProps {
  trips: Trip[];
}

function TripStats({ trips }: TripStatsProps) {
  const totalTrips = trips.length;

  const draftTrips = trips.filter(
    (trip) => trip.status === "DRAFT"
  ).length;

  const dispatchedTrips = trips.filter(
    (trip) => trip.status === "DISPATCHED"
  ).length;

  const completedTrips = trips.filter(
    (trip) => trip.status === "COMPLETED"
  ).length;

  const cancelledTrips = trips.filter(
    (trip) => trip.status === "CANCELLED"
  ).length;

  const cards = [
    {
      title: "Total Trips",
      value: totalTrips,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Draft",
      value: draftTrips,
      icon: FileEdit,
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
    {
      title: "Dispatched",
      value: dispatchedTrips,
      icon: Truck,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Completed",
      value: completedTrips,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Cancelled",
      value: cancelledTrips,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {card.value}
                </h2>
              </div>

              <div className={`${card.bg} rounded-full p-3`}>
                <Icon
                  size={24}
                  className={card.color}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TripStats;