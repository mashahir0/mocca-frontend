import React from 'react'
import Navbar from '../../components/user/Navbar'
import TopProfileNavbar from '../../components/user/TopProfileNavbar'
import OrderDetailview from '../../components/user/OrderDetailview'
import Footer from '../../components/user/Footer'

function OrderDetailViewPage() {
  return (
    <>
    <Navbar/>
    <TopProfileNavbar/>
    <OrderDetailview/>
    <Footer/>
    </>
  )
}

export default OrderDetailViewPage