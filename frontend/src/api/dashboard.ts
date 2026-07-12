import api from "./axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getDashboardStats = () =>
  api.get(API_ENDPOINTS.DASHBOARD.STATS);