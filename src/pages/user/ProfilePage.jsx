import React from 'react'
import Navbar from '../../components/user/Navbar'
import Footer from '../../components/user/Footer'
import ProfileInfo from '../../components/user/ProfileInfo'
import TopProfileNavbar from '../../components/user/TopProfileNavbar'

function ProfilePage() {
  return (
    <>
    <Navbar/>
    <TopProfileNavbar/>
    <ProfileInfo/>
    <Footer/>
    </>
  )
}

export default ProfilePage