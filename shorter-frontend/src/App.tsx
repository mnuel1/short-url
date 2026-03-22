import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import AuthLayout from "./layout/auth";
import LandingPage from "./page/LandingPage/main";
import "./App.css";

const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState("landing");

  if (isAuthenticated) return <AuthLayout />;
  return <LandingPage onDash={() => setView("dashboard")} />;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </>
  );
}

export default App;
