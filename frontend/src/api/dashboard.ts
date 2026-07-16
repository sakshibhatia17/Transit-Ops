import api from "./axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getDashboardData = async () => {
  const response = await api.get(API_ENDPOINTS.DASHBOARD.STATS);
  return response.data.data;
};
