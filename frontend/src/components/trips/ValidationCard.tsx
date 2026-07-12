function ValidationCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-6">
      <h2 className="text-xl font-semibold mb-4">
        Dispatch Validation
      </h2>

      <div className="space-y-3">

        <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-3">
          <span className="text-green-600 text-lg">✓</span>
          <p className="text-green-700">
            Vehicle is available
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-3">
          <span className="text-green-600 text-lg">✓</span>
          <p className="text-green-700">
            Driver license is valid
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
          <span className="text-yellow-600 text-lg">!</span>
          <p className="text-yellow-700">
            Cargo weight validation pending
          </p>
        </div>

      </div>
    </div>
  );
}

export default ValidationCard;