import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import AddPage from './pages/AddPage';
import EditPage from './pages/EditPage';

// =========================================================================
// APPLICATION ROUTER (WIRING OF SCREENS)
// =========================================================================
export default function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Screen 1: List and search page (Always required) */}
        <Route path="/" element={<ListPage />} />

        {/* 
          [OPTIONAL - REMOVE IF EXAM HAS NO "VIEW / DETAILS"]:
          If your exam paper does not have Screen 3, comment out or delete this Route:
        */}
        <Route path="/view/:id" element={<DetailPage />} />

        {/* 
          [OPTIONAL - REMOVE IF EXAM HAS NO "ADD NEW"]:
          If your exam paper does not have Screen 4, comment out or delete this Route:
        */}
        <Route path="/add" element={<AddPage />} />

        {/* 
          [OPTIONAL - REMOVE IF EXAM HAS NO "EDIT / UPDATE"]:
          If your exam paper does not require Update, comment out or delete this Route:
        */}
        <Route path="/edit/:id" element={<EditPage />} />

        {/* Default fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
