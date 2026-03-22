import { Sidebar } from "../ui/Sidebar";
import { useState } from "react";
import DashboardHome from "../page/Dashboard/main";
import HistoryPage from "../page/HistoryPage/main";
import SettingsPage from "../page/SettingsPage/main";

const AuthLayout = () => {
  const [active, setActive] = useState("home");
  return (
    <Sidebar active={active} onNav={setActive}>
      {active === "home" && (
        <DashboardHome onViewAll={() => setActive("history")} />
      )}
      {active === "history" && <HistoryPage />}
      {active === "settings" && <SettingsPage />}
    </Sidebar>
  );
};

export default AuthLayout;
