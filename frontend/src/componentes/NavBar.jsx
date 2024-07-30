import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logo from '/logo.png'

const Navbar = () => {

    const navigate = useNavigate();

    return (

        <nav className="bg-slate-500 p-4 top-0 w-full h-20">
            <div className="mx-auto flex justify-start items-center">
                <div onClick={() => navigate('/')}>
                    <img src={logo} alt="" className='h-12 mr-6' />
                </div>
                <div className="space-x-6">
                    <Link to="/" className="text-white hover:text-gray-400">Home</Link>
                    <Link to="/materias" className="text-white hover:text-gray-400">Materias</Link>
                    <Link to="/aulas" className="text-white hover:text-gray-400">Aulas</Link>
                    <Link to="/clases" className="text-white hover:text-gray-400">Clases</Link>
                </div>
                
            </div>
        </nav>
    );
};

export default Navbar;
