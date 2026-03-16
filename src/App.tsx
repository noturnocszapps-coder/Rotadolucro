import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from './store/authStore';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { WorkLogs } from './pages/WorkLogs';
import { WorkLogForm } from './pages/WorkLogForm';
import { Expenses } from './pages/Expenses';
import { ExpenseForm } from './pages/ExpenseForm';
import { FuelLogs } from './pages/FuelLogs';
import { FuelForm } from './pages/FuelForm';
import { MaintenanceLogs } from './pages/MaintenanceLogs';
import { MaintenanceForm } from './pages/MaintenanceForm';
import { Reports } from './pages/Reports';
import { Goals } from './pages/Goals';
import { RouteSimulator } from './pages/RouteSimulator';
import { FreightCalculator } from './pages/FreightCalculator';
import { Settings } from './pages/Settings';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

export default function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Listen for changes on auth state (sign in, sign out, etc.)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/work-logs" element={<WorkLogs />} />
          <Route path="/work-logs/new" element={<WorkLogForm />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/new" element={<ExpenseForm />} />
          <Route path="/fuel" element={<FuelLogs />} />
          <Route path="/fuel/new" element={<FuelForm />} />
          <Route path="/maintenance" element={<MaintenanceLogs />} />
          <Route path="/maintenance/new" element={<MaintenanceForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/simulator" element={<RouteSimulator />} />
          <Route path="/freight-calculator" element={<FreightCalculator />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
