import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage/LoginPage'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import HomePage from './pages/HomePage/HomePage'
import NotificationsPage from './pages/NotificationsPage/NotificationsPage'
import ProductPage from './pages/ProductPage/ProductPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated routes */}
        <Route path="/home"          element={<HomePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/product/:id"   element={<ProductPage />} />
        <Route path="/profile"       element={<ProfilePage />} />

        {/* Default redirect */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
