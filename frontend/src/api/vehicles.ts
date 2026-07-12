import api from "./axios";

export const getVehicles = () => api.get("/vehicles");
export const getVehicleById = (id: string) =>
  api.get(`/vehicles/${id}`);

export const createVehicle = (data: unknown) =>
  api.post("/vehicles", data);

export const updateVehicle = (id: string, data: unknown) =>
  api.put(`/vehicles/${id}`, data);

export const deleteVehicle = (id: string) =>
  api.delete(`/vehicles/${id}`);