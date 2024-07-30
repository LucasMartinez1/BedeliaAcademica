import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../componentes/NavBar';
import Footer from '../componentes/Footer';
import utnfondo from '../../public/utnfondo.jpg'

const Home = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className='flex flex-col h-screen'>
            <Navbar />
            {isHome && (
                <div className='flex flex-grow justify-center items-center'>
                    <img src={utnfondo} alt='Centered Image' className='max-w-full max-h-full' />
                </div>
            )}
            <Outlet />
            <Footer />
        </div>
    );
};

export default Home;
