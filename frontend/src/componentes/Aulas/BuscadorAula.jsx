import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuscadorAula = () => {
    const [aulas, setAulas] = useState([]);
    const [buscador, setBuscador] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const respuesta = await axios.get('http://localhost:8000/api/aulas/');
                setAulas(respuesta.data);
            } catch (error) {
                alert("Error al cargar las aulas");
            }
        };
        fetch();
    }, []);

    const handleBuscador = (event) => {
        setBuscador(event.target.value);
    };

    const eliminarAula = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/aulas/borrar-aula-id/${id}`);
            setAulas(aulas.filter(aula => aula.id !== id));
        } catch (error) {
            alert("Error al eliminar aula");
        }
    };

    const filtroAulas = aulas.filter(aula =>
        aula.nombre.toLowerCase().includes(buscador.toLowerCase())
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
                        onClick={() => navigate('/aulas/agregar')}
                    >
                        Agregar
                    </button>
                </div>
            </div>

            <div className="w-full mt-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="p-4">Aula</th>
                            <th className="p-4">Accion</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {filtroAulas.length > 0 ? (
                            filtroAulas.map((aula, index) => (
                                <tr key={index}>
                                    <td className="p-4">{aula.nombre}</td>
                                    <td className="p-4">
                                        <button
                                            className="bg-cyan-700 text-white py-1 px-3 rounded mr-2"
                                            onClick={() => navigate(`/aulas/modificar/${aula.id}`)}
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            className="bg-orange-600 text-white py-1 px-3 rounded"
                                            onClick={() => eliminarAula(aula.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-4" colSpan="2">No hay aulas cargadas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BuscadorAula;
