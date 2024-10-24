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
          <Route path="/auth" element={<AuthLayout />} />
          <Route
            path="/game/*"
            element={
              <ProtectedRoute>
                <TriviaGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/game" replace />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
