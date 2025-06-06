// Fixed App.jsx - Simplified routing structure
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Auth pages
import SignIn from './pages/auth/SignIn.jsx';
import SignUp from './pages/auth/SignUp.jsx';

// Protected pages
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import ManualOrder from './pages/ManualOrder';
import Inventory from './pages/Inventory';
import Wallet from './pages/Wallet';
import Reports from './pages/Reports';
import OrderHistory from './pages/OrderHistory.jsx';
import Settings from './pages/Settings.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes - these should render without Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected routes - each wrapped individually */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Layout>
                  <Notifications />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manual-order"
            element={
              <ProtectedRoute>
                <Layout>
                  <ManualOrder />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrderHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Layout>
                  <Wallet />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings/>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;