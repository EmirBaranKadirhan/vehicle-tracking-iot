import { Route, Routes } from "react-router"
import Dashboard from "./pages/Dashboard"
import HistoryPage from "./pages/HistoryPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/historical" element={<HistoryPage />} />
    </Routes>
  )
}

