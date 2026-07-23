import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Truck,
  CheckCircle,
  Route,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Vehicle } from "../../types/vehicle";
import {
  getVehicles,
  getVehicleById,
  deleteVehicle,
  updateVehicle,
  createVehicle,
} from "../../api/vehicles";

function badge(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700";

    case "ON_TRIP":
      return "bg-blue-100 text-blue-700";

    case "IN_SHOP":
      return "bg-yellow-100 text-yellow-700";

    case "RETIRED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

const allowedTransitions: Record<string, string[]> = {
  AVAILABLE: ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"],
  ON_TRIP: ["ON_TRIP", "AVAILABLE"],
  IN_SHOP: ["IN_SHOP", "AVAILABLE", "RETIRED"],
  RETIRED: ["RETIRED"],
};

function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [stats, setStats] = useState({
    totalFleet: 0,
    available: 0,
    onTrip: 0,
    inShop: 0,
    retired: 0,
  });

  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    registrationNo: "",
    model: "",
    type: "",
    maxLoadCapacity: 0,
    odometer: 0,
    acquisitionCost: 0,
    status: "AVAILABLE",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles(
        currentPage,
        vehiclesPerPage,
        search,
        statusFilter,
        typeFilter,
      );

      setVehicles(data.vehicles);
      setTotalPages(data.pagination.totalPages);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };
  useEffect(() => {
    fetchVehicles();
  }, [currentPage, search, statusFilter, typeFilter]);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmed) return;

    try {
      await deleteVehicle(id);

      if (vehicles.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchVehicles();
      }

      alert("Vehicle deleted successfully.");
    } catch (error: any) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to delete vehicle.");
    }
  };

  const handleView = async (id: string) => {
    try {
      const data = await getVehicleById(id);

      setSelectedVehicle(data);

      setEditData({
        registrationNo: data.vehicle.registrationNo,
        model: data.vehicle.model,
        type: data.vehicle.type,
        maxLoadCapacity: data.vehicle.maxLoadCapacity,
        odometer: data.vehicle.odometer,
        acquisitionCost: data.vehicle.acquisitionCost,
        status: data.vehicle.status,
      });

      setShowModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to load vehicle details.");
    }
  };
  const handleCreate = async () => {
    try {
      await createVehicle(editData);

      await fetchVehicles();

      setShowModal(false);
      setIsAdding(false);

      setEditData({
        registrationNo: "",
        model: "",
        type: "",
        maxLoadCapacity: 0,
        odometer: 0,
        acquisitionCost: 0,
        status: "AVAILABLE",
      });

      alert("Vehicle created successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create vehicle.");
    }
  };
  const handleUpdate = async () => {
    try {
      await updateVehicle(selectedVehicle.vehicle.id, editData);

      await fetchVehicles();

      setShowModal(false);
      setIsEditing(false);

      alert("Vehicle updated successfully!");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update vehicle.");
    }
  };
  return (
    <>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Vehicle Management</h1>
              <p className="text-slate-500 dark:text-slate-400">
                Monitor and manage your fleet.
              </p>
            </div>

            <button
              onClick={() => {
                setIsAdding(true);
                setIsEditing(false);
                setSelectedVehicle(null);

                setEditData({
                  registrationNo: "",
                  model: "",
                  type: "",
                  maxLoadCapacity: 0,
                  odometer: 0,
                  acquisitionCost: 0,
                  status: "AVAILABLE",
                });

                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-[#22577A] text-white px-5 py-2 rounded-lg hover:bg-[#1A4761]"
            >
              <Plus size={18} />
              Add Vehicle
            </button>
          </div>

          {/* Fleet Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              {
                title: "Total Fleet",
                value: stats.totalFleet,
                icon: Truck,
              },
              {
                title: "Available",
                value: stats.available,
                icon: CheckCircle,
              },
              {
                title: "On Trip",
                value: stats.onTrip,
                icon: Route,
              },
              {
                title: "In Shop",
                value: stats.inShop,
                icon: Wrench,
              },
            ].map(({ title, value, icon: Icon }, index) => (
              <div
                key={title}
                className={`bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-5 border-l-4 ${
                  index === 0
                    ? "border-blue-500"
                    : index === 1
                      ? "border-green-500"
                      : index === 2
                        ? "border-yellow-500"
                        : "border-red-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <Icon className="text-[#22577A]" />
                  <span className="text-3xl font-bold">{value}</span>
                </div>

                <p className="mt-3 text-slate-500 dark:text-slate-400">
                  {title}
                </p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-4 flex gap-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg h-12 pl-10 pr-3"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 h-12"
            >
              <option value="">All Status</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ON_TRIP">ON_TRIP</option>
              <option value="IN_SHOP">IN_SHOP</option>
              <option value="RETIRED">RETIRED</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border rounded-lg px-4 h-12"
            >
              <option value="">All Types</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
              <option value="Mini Truck">Mini Truck</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="text-left p-4">Registration</th>
                    <th className="text-left">Vehicle</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Capacity</th>
                    <th className="text-left">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors"
                    >
                      <td className="p-4">{vehicle.registrationNo}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.type}</td>
                      <td>{vehicle.maxLoadCapacity} kg</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${badge(
                            vehicle.status,
                          )}`}
                        >
                          {vehicle.status}
                        </span>
                      </td>

                      <td>
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={async () => {
                              setIsEditing(false);
                              await handleView(vehicle.id!);
                            }}
                            className="p-2 rounded-full hover:bg-slate-100 transition"
                          >
                            <Eye
                              size={18}
                              className="text-slate-500 dark:text-slate-400"
                            />
                          </button>

                          <button
                            onClick={async () => {
                              await handleView(vehicle.id!);
                              setIsEditing(true);
                            }}
                            className="p-2 rounded-full hover:bg-slate-100 transition"
                          >
                            <Pencil
                              size={18}
                              className="text-slate-500 dark:text-slate-400"
                            />
                          </button>

                          <button
                            onClick={() => handleDelete(vehicle.id!)}
                            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition focus:outline-none"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {vehicles.length} vehicle
                {vehicles.length !== 1 ? "s" : ""}
                <span className="ml-2">
                  | Page {currentPage} of {totalPages}
                </span>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="border rounded-lg px-4 py-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="border rounded-lg px-4 py-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {isAdding
                ? "Add Vehicle"
                : isEditing
                  ? "Edit Vehicle"
                  : "Vehicle Details"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="font-semibold block mb-1">Registration</label>

                {isEditing || isAdding ? (
                  <input
                    className="w-full border rounded-lg p-2"
                    value={editData.registrationNo}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        registrationNo: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{selectedVehicle?.vehicle.registrationNo}</p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">Model</label>

                {isEditing || isAdding ? (
                  <input
                    className="w-full border rounded-lg p-2"
                    value={editData.model}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        model: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p>{selectedVehicle?.vehicle.model}</p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">Type</label>

                {isEditing || isAdding ? (
                  <select
                    value={editData.type}
                    onChange={(e) =>
                      setEditData({ ...editData, type: e.target.value })
                    }
                    className="..."
                  >
                    <option value="">Select Type</option>
                    <option value="TRUCK">Truck</option>
                    <option value="VAN">Van</option>
                    <option value="BUS">Bus</option>
                    <option value="CAR">Car</option>
                  </select>
                ) : (
                  <p>{selectedVehicle?.vehicle.type}</p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">Status</label>

                {isEditing || isAdding ? (
                  <select
                    className="w-full border rounded-lg p-2"
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        status: e.target.value,
                      })
                    }
                  >
                    {(
                      allowedTransitions[
                        selectedVehicle?.vehicle?.status || editData.status
                      ] || []
                    ).map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>{selectedVehicle?.vehicle.status}</p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Max Load Capacity
                </label>

                {isEditing || isAdding ? (
                  <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={editData.maxLoadCapacity}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        maxLoadCapacity: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p>{selectedVehicle?.vehicle.maxLoadCapacity} kg</p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">Odometer</label>

                {isEditing || isAdding ? (
                  <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={editData.odometer}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        odometer: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p>{selectedVehicle?.vehicle.odometer} km</p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Acquisition Cost
                </label>

                {isEditing || isAdding ? (
                  <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={editData.acquisitionCost}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        acquisitionCost: Number(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p>₹ {selectedVehicle?.vehicle.acquisitionCost}</p>
                )}
              </div>

              {!isAdding && (
                <div>
                  <span className="font-semibold">Total Trips:</span>{" "}
                  {selectedVehicle?.tripCount}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setIsAdding(false);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              {(isEditing || isAdding) && (
                <button
                  onClick={isAdding ? handleCreate : handleUpdate}
                  className="px-4 py-2 bg-[#22577A] text-white rounded-lg hover:bg-[#1A4761]"
                >
                  {isAdding ? "Add Vehicle" : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Vehicles;
