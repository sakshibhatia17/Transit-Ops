import type { Trip, TripStatus } from "./types";

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatWeight(weight: number) {
  return `${weight.toFixed(1)} kg`;
}

export function formatDistance(distance: number) {
  return `${distance.toFixed(1)} km`;
}

export function getStatusColor(status: TripStatus) {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-700";

    case "DISPATCHED":
      return "bg-blue-100 text-blue-700";

    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function filterTrips(
  trips: Trip[],
  search: string,
  status: string,
  driver: string,
  vehicle: string
) {
  return trips.filter((trip) => {
    const matchesSearch =
      trip.source.toLowerCase().includes(search.toLowerCase()) ||
      trip.destination.toLowerCase().includes(search.toLowerCase()) ||
      trip.driver.name.toLowerCase().includes(search.toLowerCase()) ||
      trip.vehicle.registrationNo
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      !status || trip.status === status;

    const matchesDriver =
      !driver || trip.driver.id === driver;

    const matchesVehicle =
      !vehicle || trip.vehicle.id === vehicle;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDriver &&
      matchesVehicle
    );
  });
}