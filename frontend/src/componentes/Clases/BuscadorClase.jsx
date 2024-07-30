import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BuscadorClase = () => {
    const [buscador, setBuscador] = useState('');
    const [clases, setClases] = useState([]);
    const navigate = useNavigate();

    const handleBuscador = (event) => {
        setBuscador(event.target.value);
    };

    useEffect(() => {
        const fetchClases = async () => {
            try {
                const respuesta = await axios.get('http://localhost:8000/api/clases/');
                setClases(respuesta.data);
            } catch (error) {
                alert("Error al cargar clases")
            }
        };

        fetchClases();
    }, []);

    const handleEliminar = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/clases/borrar-clase-id/${id}`);
            setClases(clases.filter(clase => clase.id !== id));
            alert("Clase eliminada");
        } catch (error) {
            alert("Error al eliminar clases")
        }
    };

    const handleEditar = (id) => {
        navigate(`/clases/editar/${id}`);
    };

    return (
        <div className="flex flex-col items-center justify-center p-3">
            <div className="w-full text-center">
                <div className="flex justify-center items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={buscador}
                        onChange={handleBuscador}
                        className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-1/2 lg:w-1/3"
                    />
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-md" onClick={() => navigate('/clases/agregar')}>
                        Agregar
                    </button>
                </div>
            </div>

            <div className="mt-4 w-full">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="p-4">Materia</th>
                            <th className="p-4">Horario</th>
                            <th className="p-4">Aula</th>
                            <th className="p-4">Día</th>
                            <th className="p-4">Carrera</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {clases.filter(clase => {
                            return clase.nombre_materia.toLowerCase().includes(buscador.toLowerCase()) ||
                                clase.nombre_aula.toLowerCase().includes(buscador.toLowerCase());
                        }).map((clase) => (
                            <tr key={clase.id}>
                                <td className="p-4">{clase.nombre_materia}</td>
                                <td className="p-4">{`${clase.hora_inicial} a ${clase.hora_final}`}</td>
                                <td className="p-4">{clase.nombre_aula}</td>
                                <td className="p-4">{clase.dia}</td>
                                <td className="p-4">{clase.carrera_materia}</td>
                                <td className="p-4">
                                    <button
                                        className="bg-red-500 text-white py-1 px-3 rounded-md mr-2"
                                        onClick={() => handleEliminar(clase.id)}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white py-1 px-3 rounded-md"
                                        onClick={() => handleEditar(clase.id)}
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BuscadorClase;
