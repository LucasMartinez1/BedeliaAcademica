import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const AbmAulas = () => {
  const [aula, setAula] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchAula = async () => {
        try {
          const respuesta = await axios.get(`http://localhost:8000/api/aulas/${id}`);
          setAula(respuesta.data.nombre);
        } catch (error) {
          alert("Error al cargar el aula.");
        }
      };
      fetchAula();
    }
  }, [id]);

  const handleAula = async (e) => {
    e.preventDefault();

    if (!aula) {
      alert("El campo no puede estar vacío");
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/aulas/editar-aula/${id}`, { nombre: aula });
        alert("Aula modificada exitosamente");
      } else {
        await axios.post("http://localhost:8000/api/aulas/crear-aula", { nombre: aula });
        alert("Aula agregada exitosamente");
      }
      setAula("");
      navigate('/aulas/buscar');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        alert(error.response.data.detail); 
      } else {
        alert("Error inesperado al guardar el aula"); 
      }
    }
  };

  return (
    <div className="p-4 flex justify-center items-center w-full">
      <div className="w-[400px]">

        <form onSubmit={handleAula}>
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre aula</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={aula}
                onChange={(e) => setAula(e.target.value)}
                className="mt-1 block border border-gray-300 rounded-md shadow-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full pl-2"
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

export default AbmAulas;
