import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminListOeders from '../../components/admin/AdminListOeders'
import AdminFooter from '../../components/admin/AdminFooter'

function ListOrderPage() {
  return (
    <>
    <AdminNav/>
    <AdminListOeders/>
    <AdminFooter/>
    </>
  )
}

export default ListOrderPage