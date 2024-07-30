from pydantic import BaseModel


class MateriaData(BaseModel):
    nombre: str
    carrera: str



class MateriaId(MateriaData):
    id: int

class AulaData(BaseModel):
    nombre: str

class AulaId(AulaData):
    id: int


class ClaseData(BaseModel):
    id_materia: int
    id_aula: int
    hora_inicial: int
    hora_final: int
    dia: str
    nombre_materia: str
    carrera_materia: str
    nombre_aula: str


class ClaseId(ClaseData):
    id: int

