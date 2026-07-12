import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-64">
        <Sidebar />
      </div>

      {/* Main Section */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Fixed Navbar */}
        <div className="sticky top-0 z-20">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <main
          className="flex-1 p-6 overflow-y-auto"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
