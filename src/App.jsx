import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import SeriesDetailPage from "@/pages/SeriesDetailPage";
import MyListPage from "@/pages/MyListPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import MyActivityPage from "@/pages/MyActivityPage";
import ExportPage from "@/pages/ExportPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/series/:seriesId"
          element={
            <ProtectedRoute>
              <SeriesDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/my-list"
          element={
            <ProtectedRoute>
              <MyListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-activity"
          element={
            <ProtectedRoute>
              <MyActivityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/export"
          element={
            <ProtectedRoute>
              <ExportPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
