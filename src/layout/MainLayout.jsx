import React from 'react'
import Navbar from '../component/navbar/Navbar';
import Footer from '../component/footer/Footer';
import { Outlet } from 'react-router';
import { Container } from '@mui/material';



export default function MainLayout() {
  return (
        <>


            <Navbar/>
            <Container>
            <Outlet/> {/** وحسب مين نادى عليه بحطه : الي بتنادي عليه حطه */}

            </Container>

            <Footer/>


        </>


)
}
