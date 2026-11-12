import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../footer/Footer'
import Sidebar from '../sidebar/Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />

      <main className="">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}