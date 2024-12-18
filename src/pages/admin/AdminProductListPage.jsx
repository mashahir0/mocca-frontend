import React from 'react'
import AdminNav from '../../components/admin/AdminNav'
import AdminFooter from '../../components/admin/AdminFooter'
import ProductList from '../../components/admin/ProductList'

function AdminProductListPage() {
  return (
   <>
   <AdminNav/>
   <ProductList/>
   <AdminFooter/>
   </>
  )
}

export default AdminProductListPage