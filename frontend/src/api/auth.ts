import api from "./axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const login = (email: string, password: string) =>
  api.post(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });

export const getProfile = () =>
  api.get(API_ENDPOINTS.AUTH.ME);