export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  contactNumber: string;
  safetyScore: number;
  status: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY";
  createdAt: string;
  updatedAt: string;
}