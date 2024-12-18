import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import UserList from '../../components/admin/UserList'
import AdminFooter from '../../components/admin/AdminFooter'

function AdminUserListPage() {
  return (
    <>
    <AdminNav/>
    <UserList/>
    <AdminFooter/>
    </>
  )
}

export default AdminUserListPage