import api from "./axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getVehicles = async () => {
  const response = await api.get(API_ENDPOINTS.VEHICLES);
  return response.data.data.vehicles;
};