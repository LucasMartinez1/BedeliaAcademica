import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Buscador = () => {
    const [materias, setMaterias] = useState([]);
    const [buscador, setBuscador] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const respuesta = await axios.get('http://localhost:8000/api/materias/');
                setMaterias(respuesta.data);
            } catch (error) {
                alert("Error al cargar materias");
            }
        };
        fetch();
    }, []);

    const handleBuscador = (event) => {
        setBuscador(event.target.value);
    };

    const eliminarMateria = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/materias/borrar-materia-id/${id}`);
            setMaterias(materias.filter(materia => materia.id !== id));
        } catch (error) {
            alert("Error al eliminar materia");
        }
    };

    const filtroMaterias = materias.filter(materia =>
        materia.nombre.toLowerCase().includes(buscador.toLowerCase()) ||
        materia.carrera.toLowerCase().includes(buscador.toLowerCase())
    );

    return (
        <div className="flex flex-col p-3 w-full mx-auto">
            <div className="w-full text-center">
                <div className="flex justify-center items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={buscador}
                        onChange={handleBuscador}
                        className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-1/2 lg:w-1/3"
                    />
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                        onClick={() => navigate('/materias/agregar')}
                    >
                        Agregar
                    </button>
                </div>
            </div>

            <div className="w-full mt-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="p-4">Id</th>
                            <th className="p-4">Materias</th>
                            <th className="p-4">Carrera</th>
                            <th className="p-4">Accion</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filtroMaterias.length > 0 ? (
                            filtroMaterias.map((materia, index) => (
                                <tr key={index}>
                                    <td className="p-4">{materia.id}</td>
                                    <td className="p-4">{materia.nombre}</td>
                                    <td className="p-4">{materia.carrera}</td>
                                    <td className="p-4">
                                        <button
                                            className="bg-cyan-700 text-white py-1 px-3 rounded mr-2"
                                            onClick={() => navigate(`/materias/modificar/${materia.id}`)}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            className="bg-orange-600 text-white py-1 px-3 rounded"
                                            onClick={() => eliminarMateria(materia.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-4" colSpan="4">No hay materias cargadas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Buscador;
