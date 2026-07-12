import DashboardLayout from "../../layouts/DashboardLayout";

function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Configure your organization preferences.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow transition-colors p-6 space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Organization Name
            </label>

            <input
              className="w-full border rounded-lg p-3"
              defaultValue="TransitOps Logistics"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              className="w-full border rounded-lg p-3"
              defaultValue="admin@transitops.com"
            />
          </div>

          <div className="flex justify-between items-center">

            <span>Email Notifications</span>

            <input type="checkbox" defaultChecked />

          </div>

          <div className="flex justify-between items-center">

            <span>Dark Mode</span>

            <input type="checkbox" />

          </div>

          <button className="bg-[#22577A] text-white px-5 py-3 rounded-lg">
            Save Changes
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default Settings;