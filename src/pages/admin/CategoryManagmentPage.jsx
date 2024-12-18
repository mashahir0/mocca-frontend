import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminFooter from '../../components/admin/AdminFooter'
import CategoryManagement from '../../components/admin/CategoryManagement'

function CategoryManagmentPage() {
  return (
    <>
    <AdminNav/>
    <CategoryManagement/>
    <AdminFooter/>
    </>
  )
}

export default CategoryManagmentPage