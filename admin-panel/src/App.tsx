import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Plans from './pages/Plans'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Tickets from './pages/Tickets'
import Products from './pages/Products'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="plans" element={<Plans />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="products" element={<Products />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
