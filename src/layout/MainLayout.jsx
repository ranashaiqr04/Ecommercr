import React from 'react'
import Navbar from '../component/navbar/Navbar';
import Footer from '../component/footer/Footer';
import { Outlet } from 'react-router';



export default function MainLayout() {
  return (
        <>


            <Navbar/>
            <Outlet/> {/** وحسب مين نادى عليه بحطه : الي بتنادي عليه حطه */}

            <Footer/>


        </>


)
}
