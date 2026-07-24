import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  Route,
  UserX,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Driver } from "../../types/driver";
import {
  getDrivers,
  getDriverById,
  updateDriver,
  createDriver,
  deleteDriver,
} from "../../api/drivers";

function badge(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700";

    case "ON_TRIP":
      return "bg-blue-100 text-blue-700";

    case "OFF_DUTY":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function tripBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);  

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const driversPerPage = 10;
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const emptyDriver = {
    name: "",
    licenseNumber: "",
    licenseCategory: "LMV",
    licenseExpiry: "",
    contactNumber: "",
    safetyScore: 100,
    status: "AVAILABLE",
  };

  const [addData, setAddData] = useState(emptyDriver);
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [addLoading, setAddLoading] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editData, setEditData] = useState({
    name: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiry: "",
    contactNumber: "",
    safetyScore: 0,
    status: "",
  });

  const availableDrivers = drivers.filter(
    (driver) => driver.status === "AVAILABLE",
  ).length;

  const onTripDrivers = drivers.filter(
    (driver) => driver.status === "ON_TRIP",
  ).length;

  const offDutyDrivers = drivers.filter(
    (driver) => driver.status === "OFF_DUTY",
  ).length;

  const fetchDrivers = async () => {
    try {

      const { data } = await getDrivers(
        currentPage,
        driversPerPage,
        search,
        statusFilter,
      );


      setDrivers(data.data.drivers);
      setTotalDrivers(data.data.pagination.total);
      setTotalPages(data.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  useEffect(() => {
    fetchDrivers();
  }, [currentPage, search, statusFilter]);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleView = async (id: string) => {
    try {
      const { data } = await getDriverById(id);

      setSelectedDriver(data.data.driver);
      setViewModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedDriver) return;

    if (!validateEditForm()) {
      return;
    }

    try {
      setEditLoading(true);

      await updateDriver(selectedDriver.id, {
        ...editData,
        safetyScore: Number(editData.safetyScore),
        licenseExpiry: new Date(editData.licenseExpiry).toISOString(),
      });

      await fetchDrivers();

      setEditModalOpen(false);
      setEditErrors({});

      setSelectedDriver(null);
    } catch (err: any) {
      console.error(err);

      alert(err?.response?.data?.message ?? "Failed to update driver.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleCreate = async () => {
    const errors: Record<string, string> = {};

    if (!addData.name.trim()) errors.name = "Driver name is required.";

    if (!addData.licenseNumber.trim())
      errors.licenseNumber = "License number is required.";

    if (!/^\d{10}$/.test(addData.contactNumber))
      errors.contactNumber = "Enter a valid 10-digit contact number.";

    if (!addData.licenseExpiry)
      errors.licenseExpiry = "License expiry is required.";

    if (addData.safetyScore < 0 || addData.safetyScore > 100)
      errors.safetyScore = "Safety score must be between 0 and 100.";

    setAddErrors(errors);

    if (Object.keys(errors).length) return;

    try {
      setAddLoading(true);

      await createDriver({
        ...addData,
        licenseExpiry: new Date(addData.licenseExpiry).toISOString(),
      });

      await fetchDrivers();

      setAddModalOpen(false);
      setAddData({ ...emptyDriver });
      setAddErrors({});
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to create driver.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!driverToDelete) return;

    try {
      setDeleteLoading(true);

      await deleteDriver(driverToDelete.id);

      await fetchDrivers();

      setDeleteModalOpen(false);
      setDriverToDelete(null);
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to delete driver.");

      setDeleteModalOpen(false);
      setDriverToDelete(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const validateEditForm = () => {
    const errors: Record<string, string> = {};

    if (!editData.name.trim()) errors.name = "Driver name is required.";

    if (!editData.licenseNumber.trim())
      errors.licenseNumber = "License number is required.";

    if (!editData.contactNumber.trim())
      errors.contactNumber = "Contact number is required.";

    if (!/^\d{10}$/.test(editData.contactNumber))
      errors.contactNumber = "Enter a valid 10-digit contact number.";

    if (!editData.licenseExpiry)
      errors.licenseExpiry = "License expiry is required.";

    if (editData.safetyScore < 0 || editData.safetyScore > 100)
      errors.safetyScore = "Safety score must be between 0 and 100.";

    setEditErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const filteredDrivers = drivers.filter(
    (driver) => !categoryFilter || driver.licenseCategory === categoryFilter,
  );


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Driver Management</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Manage drivers and monitor their availability.
            </p>
          </div>

          <button
            onClick={() => {
              setAddData(emptyDriver);
              setAddErrors({});
              setAddModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#22577A] text-white px-5 py-2 rounded-lg hover:bg-[#1A4761]"
          >
            <Plus size={18} />
            Add Driver
          </button>
        </div>

        {/* Fleet Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            {
              title: "Total Drivers",
              value: totalDrivers,
              icon: Users,
            },
            {
              title: "Available",
              value: availableDrivers,
              icon: UserCheck,
            },
            {
              title: "On Trip",
              value: onTripDrivers,
              icon: Route,
            },
            {
              title: "Off Duty",
              value: offDutyDrivers,
              icon: UserX,
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

              <p className="mt-3 text-slate-500 dark:text-slate-400">{title}</p>
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
              placeholder="Search by name or license..."
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
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-4 h-12"
          >
            <option value="">All Categories</option>
            <option value="LMV">LMV</option>
            <option value="HMV">HMV</option>
            <option value="MCWG">MCWG</option>
            <option value="TRANS">TRANS</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="text-left p-4">Driver</th>
                  <th className="text-left">Licence No.</th>
                  <th className="text-left">Phone</th>
                  <th className="text-left">License Category</th>
                  <th className="text-left">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-500 dark:text-slate-400"
                    >
                      No drivers found.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors"
                    >
                      <td className="p-4">{driver.name}</td>
                      <td>{driver.licenseNumber}</td>
                      <td>{driver.contactNumber}</td>
                      <td>{driver.licenseCategory}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${badge(driver.status)}`}
                        >
                          {formatStatus(driver.status)}
                        </span>
                      </td>

                      <td>
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleView(driver.id)}
                            className="p-2 rounded-full hover:bg-slate-100 transition"
                          >
                            <Eye
                              size={18}
                              className="text-slate-500 dark:text-slate-400"
                            />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedDriver(driver);

                              setEditData({
                                name: driver.name,
                                licenseNumber: driver.licenseNumber,
                                licenseCategory: driver.licenseCategory,
                                licenseExpiry:
                                  driver.licenseExpiry.split("T")[0],
                                contactNumber: driver.contactNumber,
                                safetyScore: driver.safetyScore,
                                status: driver.status,
                              });

                              setEditModalOpen(true);
                            }}
                            className="p-2 rounded-full hover:bg-slate-100 transition"
                          >
                            <Pencil
                              size={18}
                              className="text-slate-500 dark:text-slate-400"
                            />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteLoading(false);
                              setDriverToDelete(driver);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition focus:outline-none"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {totalPages === 0
                ? "No results found"
                : `Showing page ${currentPage} of ${totalPages}`}
            </p>

            <div className="flex gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="border rounded-lg px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="border rounded-lg px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {viewModalOpen && selectedDriver && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setViewModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Driver Details
                <span className="text-slate-500 font-normal">
                  {" • "}
                  {selectedDriver.name}
                </span>
              </h2>

              <button
                onClick={() => setViewModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Name
                </p>
                <p className="font-semibold">{selectedDriver.name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  License Number
                </p>
                <p className="font-semibold">{selectedDriver.licenseNumber}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Category
                </p>
                <p className="font-semibold">
                  {selectedDriver.licenseCategory}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Expiry
                </p>
                <p className="font-semibold">
                  {new Date(selectedDriver.licenseExpiry).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Contact
                </p>
                <p className="font-semibold">{selectedDriver.contactNumber}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Safety Score
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold ${
                    selectedDriver.safetyScore >= 90
                      ? "bg-green-100 text-green-700"
                      : selectedDriver.safetyScore >= 75
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedDriver.safetyScore}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Status
                </p>
                <span
                  className={`px-3 py-1 rounded-full ${badge(
                    selectedDriver.status,
                  )}`}
                >
                  {formatStatus(selectedDriver.status)}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Total Trips
                </p>
                <p className="font-semibold">
                  {selectedDriver._count?.trips ?? 0}
                </p>
              </div>
            </div>

            <hr className="my-8 border-slate-200 dark:border-slate-700" />

            <div>
              <h3 className="text-xl font-semibold mb-3">Recent Trips</h3>

              <table className="w-full border rounded-lg overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="text-left p-3">Source</th>
                    <th className="text-left p-3">Destination</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedDriver.trips?.length ? (
                    selectedDriver.trips.map((trip: any) => (
                      <tr
                        key={trip.id}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <td className="p-3">{trip.source}</td>
                        <td className="p-3">{trip.destination}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${tripBadge(trip.status)}`}
                          >
                            {formatStatus(trip.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center p-4 text-slate-500"
                      >
                        No trips found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {editModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Edit Driver
                <span className="text-slate-500 font-normal">
                  {" • "}
                  {selectedDriver?.name}
                </span>
              </h2>

              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditErrors({});
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  Name
                </label>

                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      name: e.target.value,
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    editErrors.name ? "border-red-500" : "border-slate-300"
                  }`}
                />

                {editErrors.name && (
                  <p className="text-sm text-red-500">{editErrors.name}</p>
                )}
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  License Number
                </label>

                <input
                  type="text"
                  value={editData.licenseNumber}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      licenseNumber: e.target.value,
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    editErrors.licenseNumber
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {editErrors.licenseNumber && (
                  <p className="text-sm text-red-500">
                    {editErrors.licenseNumber}
                  </p>
                )}
              </div>

              {/* License Category */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  License Category
                </label>

                <select
                  value={editData.licenseCategory}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      licenseCategory: e.target.value,
                    })
                  }
                  className="w-full rounded-lg px-3 py-2 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20"
                >
                  <option value="LMV">LMV</option>
                  <option value="HMV">HMV</option>
                  <option value="MCWG">MCWG</option>
                  <option value="TRANS">TRANS</option>
                </select>
              </div>

              {/* License Expiry */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  License Expiry
                </label>

                <input
                  type="date"
                  value={editData.licenseExpiry}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      licenseExpiry: e.target.value,
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    editErrors.licenseExpiry
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {editErrors.licenseExpiry && (
                  <p className="text-sm text-red-500">
                    {editErrors.licenseExpiry}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  Contact Number
                </label>

                <input
                  type="text"
                  value={editData.contactNumber}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      contactNumber: e.target.value,
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    editErrors.contactNumber
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {editErrors.contactNumber && (
                  <p className="text-sm text-red-500">
                    {editErrors.contactNumber}
                  </p>
                )}
              </div>

              {/* Safety Score */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  Safety Score
                </label>

                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editData.safetyScore}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      safetyScore: Number(e.target.value),
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    editErrors.safetyScore
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {editErrors.safetyScore && (
                  <p className="text-sm text-red-500">
                    {editErrors.safetyScore}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2 col-span-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  Status
                </label>

                <select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 focus:border-[#22577A] transition-colors"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_TRIP">On Trip</option>
                  <option value="OFF_DUTY">Off Duty</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditErrors({});
                }}
                disabled={editLoading}
                className="px-5 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={editLoading}
                className="px-5 py-2 rounded-lg bg-[#22577A] text-white hover:bg-[#1A4761] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {editLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add Driver</h2>

              <button
                onClick={() => {
                  setAddModalOpen(false);
                  setAddErrors({});
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  Name
                </label>

                <input
                  type="text"
                  value={addData.name}
                  onChange={(e) =>
                    setAddData({
                      ...addData,
                      name: e.target.value,
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    addErrors.name ? "border-red-500" : "border-slate-300"
                  }`}
                />

                {addErrors.name && (
                  <p className="text-sm text-red-500">{addErrors.name}</p>
                )}
              </div>

              {/* License Number */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  License Number
                </label>

                <input
                  type="text"
                  value={addData.licenseNumber}
                  onChange={(e) =>
                    setAddData({
                      ...addData,
                      licenseNumber: e.target.value,
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    addErrors.licenseNumber
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {addErrors.licenseNumber && (
                  <p className="text-sm text-red-500">
                    {addErrors.licenseNumber}
                  </p>
                )}
              </div>

              {/* License Category */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  License Category
                </label>

                <select
                  value={addData.licenseCategory}
                  onChange={(e) =>
                    setAddData({
                      ...addData,
                      licenseCategory: e.target.value,
                    })
                  }
                  className="w-full rounded-lg px-3 py-2 border border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20"
                >
                  <option value="LMV">LMV</option>
                  <option value="HMV">HMV</option>
                  <option value="MCWG">MCWG</option>
                  <option value="TRANS">TRANS</option>
                </select>
              </div>

              {/* License Expiry */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  License Expiry
                </label>

                <input
                  type="date"
                  value={addData.licenseExpiry}
                  onChange={(e) =>
                    setAddData({
                      ...addData,
                      licenseExpiry: e.target.value,
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    addErrors.licenseExpiry
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {addErrors.licenseExpiry && (
                  <p className="text-sm text-red-500">
                    {addErrors.licenseExpiry}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  Contact Number
                </label>

                <input
                  type="text"
                  value={addData.contactNumber}
                  onChange={(e) =>
                    setAddData({
                      ...addData,
                      contactNumber: e.target.value,
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    addErrors.contactNumber
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {addErrors.contactNumber && (
                  <p className="text-sm text-red-500">
                    {addErrors.contactNumber}
                  </p>
                )}
              </div>

              {/* Safety Score */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  Safety Score
                </label>

                <input
                  type="number"
                  min={0}
                  max={100}
                  value={addData.safetyScore}
                  onChange={(e) =>
                    setAddData({
                      ...addData,
                      safetyScore: Number(e.target.value),
                    })
                  }
                  className={`w-full rounded-lg px-3 py-2 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 ${
                    addErrors.safetyScore
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                />

                {addErrors.safetyScore && (
                  <p className="text-sm text-red-500">
                    {addErrors.safetyScore}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2 col-span-2">
                <label className="text-xs uppercase tracking-wide text-slate-500">
                  Status
                </label>

                <select
                  value={addData.status}
                  onChange={(e) =>
                    setAddData({
                      ...addData,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg px-3 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#22577A]/20 focus:border-[#22577A] transition-colors"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_TRIP">On Trip</option>
                  <option value="OFF_DUTY">Off Duty</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setAddModalOpen(false);
                  setAddErrors({});
                }}
                disabled={addLoading}
                className="px-5 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreate}
                disabled={addLoading}
                className="px-5 py-2 rounded-lg bg-[#22577A] text-white hover:bg-[#1A4761] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Driver"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteModalOpen && driverToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-red-600">Delete Driver</h2>

              <button
                onClick={() => setDeleteModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-5 text-slate-600 dark:text-slate-300">
              Are you sure you want to delete
              <span className="font-semibold"> {driverToDelete.name}</span>?
            </p>

            <p className="mt-2 text-sm text-red-500">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Drivers;
