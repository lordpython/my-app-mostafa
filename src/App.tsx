import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthLayout } from "./components/auth/AuthLayout"
import TriviaGame from "./app/components/TriviaGame"

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthLayout />} />

          {/* Protected Routes */}
          <Route
            path="/game/*"
            element={
              <ProtectedRoute>
                <TriviaGame />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to game or auth based on authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/game" replace />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
