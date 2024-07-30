import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CrearClase = () => {
    const [materias, setMaterias] = useState([]);
    const [aulas, setAulas] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [selectedAula, setSelectedAula] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [diaSemana, setDiaSemana] = useState('');
    const [editando, setEditando] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const respuesta = await axios.get('http://localhost:8000/api/materias/');
                setMaterias(respuesta.data);
            } catch (error) {
                alert("Error al cargar materias")
            }
        };

        const fetchAulas = async () => {
            try {
                const respuesta = await axios.get('http://localhost:8000/api/aulas/');
                setAulas(respuesta.data);
            } catch (error) {
                alert("Error al cargar aulas")
            }
        };

        const fetchClase = async () => {
            if (id) {
                try {
                    const respuesta = await axios.get(`http://localhost:8000/api/clases/${id}`);
                    const clase = respuesta.data;
                    setSelectedMateria(clase.id_materia);
                    setSelectedAula(clase.id_aula);
                    setHoraInicio(clase.hora_inicial);
                    setHoraFin(clase.hora_final);
                    setDiaSemana(clase.dia);
                    setEditando(true);
                } catch (error) {
                    alert("Error al cargar clases")
                }
            }
        };

        fetchMaterias();
        fetchAulas();
        fetchClase();
    }, [id]);

    const handleGuardarClase = async () => {
        try {
            if (!selectedMateria || !selectedAula || !diaSemana || !horaInicio || !horaFin) {
                alert("Todos los campos deben estar completos.");
                return;
            }

            const materiaSeleccionada = materias.find(materia => materia.id === parseInt(selectedMateria));
            const aulaSeleccionada = aulas.find(aula => aula.id === parseInt(selectedAula));
            const clase = {
                id_materia: parseInt(selectedMateria),
                id_aula: parseInt(selectedAula),
                hora_inicial: parseInt(horaInicio),
                hora_final: parseInt(horaFin),
                dia: diaSemana,
                nombre_materia: materiaSeleccionada ? materiaSeleccionada.nombre : '',
                carrera_materia: materiaSeleccionada ? materiaSeleccionada.carrera : '',
                nombre_aula: aulaSeleccionada ? aulaSeleccionada.nombre : ''
            };

            if (editando) {
                await axios.put(`http://localhost:8000/api/clases/editar-clase/${id}`, clase);
                alert("Clase actualizada");
            } else {
                await axios.post('http://localhost:8000/api/clases/crear-clase', clase);
                alert("Clase creada");
            }
            navigate(-1);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                alert(error.response.data.detail); 
            } else {
                alert("Error inesperado al guardar la clase"); 
            }
        }
    };

    const diasDeLaSemana = [
        { valor: '', texto: 'Seleccionar Día' },
        { valor: 'lunes', texto: 'Lunes' },
        { valor: 'martes', texto: 'Martes' },
        { valor: 'miércoles', texto: 'Miércoles' },
        { valor: 'jueves', texto: 'Jueves' },
        { valor: 'viernes', texto: 'Viernes' }
    ];

    const handleHoraInicioChange = (e) => {
        const value = e.target.value;
        if (value >= 1 && value <= 24) {
            setHoraInicio(value);
        }
    };

    const handleHoraFinChange = (e) => {
        const value = e.target.value;
        if (value >= 1 && value <= 24) {
            setHoraFin(value);
        }
    };

    return (
        <div className="flex flex-col p-3 w-full mx-auto">
            <div className="w-full text-center mb-4 flex flex-col items-center">
                <select
                    value={selectedMateria}
                    onChange={(e) => setSelectedMateria(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-1/2 lg:w-1/3 mb-4"
                >
                    <option value="">Seleccionar Materia</option>
                    {materias.map((materia) => (
                        <option key={materia.id} value={materia.id}>{materia.nombre}</option>
                    ))}
                </select>

                <select
                    value={selectedAula}
                    onChange={(e) => setSelectedAula(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-1/2 lg:w-1/3 mb-4"
                >
                    <option value="">Seleccionar Aula</option>
                    {aulas.map((aula) => (
                        <option key={aula.id} value={aula.id}>{aula.nombre}</option>
                    ))}
                </select>

                <select
                    value={diaSemana}
                    onChange={(e) => setDiaSemana(e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-1/2 lg:w-1/3 mb-4"
                >
                    {diasDeLaSemana.map((dia) => (
                        <option key={dia.valor} value={dia.valor}>{dia.texto}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Hora Inicio"
                    value={horaInicio}
                    onChange={handleHoraInicioChange}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-1/2 lg:w-1/3 mb-4"
                    min="0"
                    max="23"
                />

                <input
                    type="number"
                    placeholder="Hora Fin"
                    value={horaFin}
                    onChange={handleHoraFinChange}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full sm:w-1/2 lg:w-1/3 mb-4"
                    min="0"
                    max="23"
                />

                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    onClick={handleGuardarClase}
                >
                    {editando ? 'Actualizar Clase' : 'Crear Clase'}
                </button>
            </div>
        </div>
    );
};

export default CrearClase;
