import React from 'react'
import Navbar from '../../components/user/Navbar'
import TopProfileNavbar from '../../components/user/TopProfileNavbar'
import OrdersList from '../../components/user/OrderList'
import Footer from '../../components/user/Footer'

function OrderListPage() {
  return (
    <>
    <Navbar/>
    <TopProfileNavbar/>
    <OrdersList/>
    <Footer/>
    </>
  )
}

export default OrderListPage