import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthLayout } from "./components/auth/AuthLayout"
import TriviaGame from "./app/components/TriviaGame"
import { auth, db } from "./config/firebase";
import { collection, getDocs } from 'firebase/firestore';
import React from "react";

const App = () => {
  // Verify Firebase connection
  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Test Firestore connection using modular API
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        console.log('Firebase connected successfully');
      } catch (error) {
        console.error('Firebase connection error:', error);
      }
    };

    checkFirebase();
  }, []);

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
