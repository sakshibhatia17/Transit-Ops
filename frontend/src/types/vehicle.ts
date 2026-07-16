export interface Vehicle {
  id: string;
  registrationNo: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
  createdAt: string;
  updatedAt: string;
}