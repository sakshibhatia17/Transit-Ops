export type TripStatus =
  | "DRAFT"
  | "DISPATCHED"
  | "COMPLETED"
  | "CANCELLED";

export interface Trip {
  id: string;

  source: string;
  destination: string;

  cargoWeight: number;
  plannedDistance: number;
  actualDistance?: number | null;
  fuelConsumed?: number | null;

  status: TripStatus;

  driver: {
    id: string;
    name: string;
  };

  vehicle: {
    id: string;
    registrationNo: string;
  };

  createdAt: string;
  updatedAt: string;
}