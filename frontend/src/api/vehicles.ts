import api from "./axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getVehicles = async (
  page = 1,
  limit = 5,
  search = "",
  status = "",
  type = "",
) => { 
  const response = await api.get(API_ENDPOINTS.VEHICLES, {
    params: {
  page,
  limit,
  search,
  status,
  type,
},
  });

  return response.data.data;
};

export const deleteVehicle = async (id: string) => {
  const response = await api.delete(`${API_ENDPOINTS.VEHICLES}/${id}`);
  return response.data;
};

export const updateVehicle = async (
  id: string,
  data: {
    registrationNo: string;
    model: string;
    type: string;
    maxLoadCapacity: number;
    status: string;
  }
) => {
  const response = await api.put(
    `${API_ENDPOINTS.VEHICLES}/${id}`,
    data
  );

  return response.data.data;
};

export const createVehicle = async (data: {
  registrationNo: string;
  model: string;
  type: string;
  maxLoadCapacity: number;
  odometer: number;
  acquisitionCost: number;
  status: string;
}) => {
  const response = await api.post(API_ENDPOINTS.VEHICLES, data);

  return response.data.data;
};

export const getVehicleById = async (id: string) => {
  const response = await api.get(`${API_ENDPOINTS.VEHICLES}/${id}`);
  return response.data.data;
};