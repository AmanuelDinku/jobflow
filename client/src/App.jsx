import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Interviews from "./pages/Interviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route 
          path="/analytics" 
          element={<Analytics />} 
        />
        
        <Route 
          path="/interviews" 
          element={<Interviews />} 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;