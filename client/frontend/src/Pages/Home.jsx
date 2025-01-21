import React from 'react'
import Header from '../Components/Header'
import Latest from '../Components/Latest'
import Humanity from '../Components/Humanity'
import Leader from '../Components/Leader'
import Getintouch from '../Components/Getintouch'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <div>
        <Header/>
        <Latest/>
        <Humanity/>
        <Leader/>
        <Getintouch/>
        <Footer/>
    </div>
  )
}

export default Home