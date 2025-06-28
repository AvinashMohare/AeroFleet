import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, adminRoutes, operatorRoutes } from "./routesConfig";
import ProtectedRoute from "./components/ProtectedRoutes";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Admin Routes  */}
        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* Operator Routes */}
        {operatorRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute allowedRoles={["operator"]}>
                {element}
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
