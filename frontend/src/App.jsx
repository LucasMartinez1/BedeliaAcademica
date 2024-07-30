import Home from './views/Home';
import { Route, Routes } from 'react-router-dom';
import Materias from './views/Materias';
import AbmMaterias from './componentes/Materias/AbmMaterias';
import Buscador from './componentes/Materias/Buscador';
import Aulas from './views/Aulas';
import AbmAulas from './componentes/Aulas/AbmAulas';
import BuscadorAula from './componentes/Aulas/BuscadorAula';
import AbmClase from './componentes/Clases/AbmClase';
import Clases from './views/Clases';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}>
        <Route path='materias' element={<Materias />} />
        <Route path='materias/agregar' element={<AbmMaterias />} />
        <Route path='materias/buscar' element={<Buscador />} />
        <Route path='materias/modificar/:id' element={<AbmMaterias />} />

        <Route path='aulas' element={<Aulas />} />
        <Route path='aulas/agregar' element={<AbmAulas />} />
        <Route path='aulas/buscar' element={<BuscadorAula />} />
        <Route path='aulas/modificar/:id' element={<AbmAulas />} />

        <Route path='clases' element={<Clases />} />
        <Route path='clases/agregar' element={<AbmClase />} />
        <Route path='clases/editar/:id' element={<AbmClase />} />
      </Route>
    </Routes>
  );
}

export default App;

