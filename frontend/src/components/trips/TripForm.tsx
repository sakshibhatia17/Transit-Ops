function TripForm() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">
        Create Trip
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Source"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="text"
          placeholder="Destination"
          className="w-full border rounded-lg px-4 py-2"
        />

        <select className="w-full border rounded-lg px-4 py-2">
          <option>Select Vehicle</option>
        </select>

        <select className="w-full border rounded-lg px-4 py-2">
          <option>Select Driver</option>
        </select>

        <input
          type="number"
          placeholder="Cargo Weight (kg)"
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          type="number"
          placeholder="Planned Distance (km)"
          className="w-full border rounded-lg px-4 py-2"
        />

        <button className="w-full bg-[#22577A] hover:bg-[#1B4560] text-white py-3 rounded-lg font-semibold transition">
          Dispatch Trip
        </button>

      </div>
    </div>
  );
}

export default TripForm;