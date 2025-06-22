import { Navigate, Route, Router, Routes } from "react-router-dom";
import AuthPage from "./pages/auth/Auth";
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import React from "react";
import NotFound from "./components/not-found/NotFound";
import NavBar from "./components/navbar/navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import PostDetail from "./components/post/PostDetail";
import CreatePost from "./pages/create-post/CreatePost";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/signup" element={<AuthPage type="signup" />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post/new" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/post/edit/:id" element={<CreatePost />} />

          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
