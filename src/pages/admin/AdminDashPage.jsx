import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import Dashboard from '../../components/admin/Dashboard'
import RecentOrders from '../../components/admin/RecentOrders'
import AdminFooter from '../../components/admin/AdminFooter'

function AdminDashPage() {
  return (
    <>
    <AdminNav/>
    <Dashboard/>
    <RecentOrders/>
    <AdminFooter/>
    </>
  )
}

export default AdminDashPage