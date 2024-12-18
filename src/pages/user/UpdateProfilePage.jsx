import React from 'react'
import Navbar from '../../components/user/Navbar'
import TopProfileNavbar from '../../components/user/TopProfileNavbar'
import Footer from '../../components/user/Footer'
import UpdateProfile from '../../components/user/UpdateProfile'

function UpdateProfilePage() {
  return (
    <>
    <Navbar/>
    <TopProfileNavbar/>
    <UpdateProfile/>
    <Footer/>
    </>
  )
}

export default UpdateProfilePage