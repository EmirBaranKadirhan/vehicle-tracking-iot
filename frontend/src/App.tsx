import { Route, Routes } from "react-router"
import Dashboard from "./pages/Dashboard"
import HistoryPage from "./pages/HistoryPage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AlertsPage from "./pages/AlertsPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import VehicleManagement from "./pages/VehicleManagement"


export default function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/historical" element={<HistoryPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/vehicles" element={<VehicleManagement />} />
      </Route>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

