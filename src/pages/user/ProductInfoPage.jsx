import React from 'react'
import Navbar from '../../components/user/Navbar'
import Footer from '../../components/user/Footer'
import ProductDetails from '../../components/user/ProductDetails'
import ScrollToTop from '../../components/common/ScrollToTop'

function ProductInfo() {
  return (
    <>
    <ScrollToTop/>
    <Navbar/>
    <ProductDetails/>   
    <Footer/>  
    </>
  )
}

export default ProductInfo