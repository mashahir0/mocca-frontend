import React from 'react'
import Navbar from '../../components/user/Navbar'
import TrendingPro from '../../components/user/TrendingPro'
import NewArrivals from '../../components/user/NewArrivals'
import Footer from '../../components/user/Footer'
import ScrollToTop from '../../components/common/ScrollToTop'

function HomePage() {
  return (
    <>
      <ScrollToTop/>
      <Navbar/>
      <TrendingPro/>
      <NewArrivals/>
      <Footer/>
    </>
  )
}

export default HomePage