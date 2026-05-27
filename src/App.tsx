import { useState } from "react";

import Sidebar from "./components/Sidebar";

import Supervisor from "./pages/Supervisor";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";

function App() {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [collapsed, setCollapsed] =
    useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "Supervisor":
        return <Supervisor />;

      case "Analytics":
      return <Analytics />;

      case "Dashboard":
      default:
        return <Dashboard />;

      
    }
  };

  return (
    <div className="flex bg-[#f3f4f6]">
      {/* SIDEBAR */}

      <Sidebar
        activePage={activePage}
        setActivePage={
          setActivePage
        }
        collapsed={collapsed}
        setCollapsed={
          setCollapsed
        }
      />

      {/* PAGE CONTENT */}

      <div className="flex-1 overflow-auto h-screen">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;