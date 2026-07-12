import api from "./axios";

export const getDrivers = () => api.get("/drivers");

export const getDriverById = (id: string) =>
  api.get(`/drivers/${id}`);

export const createDriver = (data: unknown) =>
  api.post("/drivers", data);

export const updateDriver = (id: string, data: unknown) =>
  api.put(`/drivers/${id}`, data);

export const deleteDriver = (id: string) =>
  api.delete(`/drivers/${id}`);