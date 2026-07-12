function TripLifecycle() {
  const steps = [
    { label: "Draft", color: "bg-green-500" },
    { label: "Dispatched", color: "bg-blue-500" },
    { label: "Completed", color: "bg-slate-300" },
    { label: "Cancelled", color: "bg-slate-300" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <h2 className="text-lg font-semibold mb-6">
        Trip Lifecycle
      </h2>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="flex flex-col items-center flex-1 relative"
          >
            <div className={`w-5 h-5 rounded-full ${step.color}`} />

            <p className="mt-2 text-sm text-slate-600">
              {step.label}
            </p>

            {index !== steps.length - 1 && (
              <div className="absolute top-2.5 left-1/2 w-full h-1 bg-slate-200 -z-10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripLifecycle;