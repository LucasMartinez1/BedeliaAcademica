import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AbmMaterias = () => {
  const [materia, setMateria] = useState({ nombre: '', carrera: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchMateria = async () => {
        try {
          const respuesta = await axios.get(`http://localhost:8000/api/materias/${id}`);
          setMateria(respuesta.data);
        } catch (error) {
          alert("Error al cargar materias")
        }
      };
      fetchMateria();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMateria((prevMateria) => ({
      ...prevMateria,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!materia.nombre || !materia.carrera) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/materias/editar-materia/${id}`, materia);
        alert("Materia modificada exitosamente");
      } else {
        await axios.post("http://localhost:8000/api/materias/crear-materia", materia);
        alert("Materia agregada exitosamente");
      }
      setMateria({ nombre: '', carrera: '' });
      navigate('/materias/buscar'); 
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail); 
      } else {
        alert("Error inesperado al guardar la materia"); 
      }
    }
  };

  return (
    <div className="p-4 flex justify-center w-full">
      <div className='w-[400px]'>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={materia.nombre}
                onChange={handleChange}
                className="mt-1 block border border-gray rounded-md shadow-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full pl-2"
              />
            </div>
            <div>
              <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
              <input
                type="text"
                id="carrera"
                name="carrera"
                value={materia.carrera}
                onChange={handleChange}
                className="mt-1 block border border-gray rounded-md shadow-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full pl-2"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AbmMaterias;
