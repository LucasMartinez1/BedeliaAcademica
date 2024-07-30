from sqlalchemy.orm import Session
from sqlalchemy import func
from schemas import AulaData, MateriaData, ClaseId,ClaseData
from models import Aula, Materia, Clase
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi import HTTPException
from sqlalchemy.orm.exc import NoResultFound



# GETS

def get_aulas(db: Session):
    try:
        return db.query(Aula).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error al recuperar aulas en la base de datos.")

def get_materias(db: Session):
    try:
        return db.query(Materia).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error al recuperar materias de la base de datos.")

def get_clases(db: Session):
    try:
        return db.query(Clase).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error al recuperar las clases de la base de datos.")

def get_clase_byId(db: Session, id: int):
    try:
        return db.query(Clase).filter(Clase.id == id).first()
    except NoResultFound:
        raise HTTPException(status_code=404, detail="Clase no encontrada.")
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error al buscar la clase en la base de datos.")

def get_aula_by_nombre(db: Session, nombre: str):
    try:
        return db.query(Aula).filter(func.lower(Aula.nombre) == nombre).first()
    except NoResultFound:
        return None  
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error al buscar el aula por nombre en la base de datos.")

def get_Aula_by_id(db: Session, id: int):
    try:
        return db.query(Aula).filter(Aula.id == id).first()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error al buscar el aula por ID en la base de datos.")

def get_Materia_by_id(db: Session, id: int):
    try:
        return db.query(Materia).filter(Materia.id == id).first()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error al buscar la materia por ID en la base de datos.")

def get_materia_by_nombre(db: Session, nombre: str):
    try:
        return db.query(Materia).filter(Materia.nombre == nombre).first()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Error al buscar la materia por nombre en la base de datos.")

# CREATE

def create_Aula(db: Session, aula: AulaData):
    try:
        nuevo_Aula = Aula(nombre=aula.nombre)
        db.add(nuevo_Aula)
        db.commit()
        return nuevo_Aula
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="El aula ya existe.")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error inesperado al crear el aula.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error inesperado.")

def create_Materia(db: Session, materia: MateriaData):
    materia_existente = db.query(Materia).filter(
        Materia.nombre == materia.nombre,
        Materia.carrera == materia.carrera
    ).first()

    if materia_existente:
        raise HTTPException(status_code=400, detail="Ya existe una materia con el mismo nombre y carrera.")

    try:
        nueva_Materia = Materia(nombre=materia.nombre, carrera=materia.carrera)
        db.add(nueva_Materia)
        db.commit()
        return nueva_Materia
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad al crear la materia.")
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error en la base de datos.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error inesperado.")

def create_Clase(db: Session, clase: ClaseData):
    if clase.hora_final <= clase.hora_inicial:
        raise ValueError("La hora final debe ser mayor que la hora inicial.")

    aula_ocupada = db.query(Clase) \
                      .filter(Clase.id_aula == clase.id_aula) \
                      .filter(Clase.dia == clase.dia) \
                      .filter(Clase.hora_inicial < clase.hora_final, Clase.hora_final > clase.hora_inicial) \
                      .first()
    
    if aula_ocupada:
        raise HTTPException(status_code=409, detail="El aula ya está ocupada en ese día y horario.")

    nueva_clase = Clase(
        id_aula=clase.id_aula,
        id_materia=clase.id_materia,
        dia=clase.dia,
        hora_inicial=clase.hora_inicial,
        hora_final=clase.hora_final,
        nombre_materia=clase.nombre_materia,
        carrera_materia=clase.carrera_materia,
        nombre_aula=clase.nombre_aula
    )
    db.add(nueva_clase)
    db.commit()
    db.refresh(nueva_clase)
    return nueva_clase


# EDITAR

def editar_Aula(db: Session, id: int, nueva_info: AulaData):
    aula = db.query(Aula).filter(Aula.id == id).first()
    if aula:
        try:
            aula.nombre = nueva_info.nombre
            db.commit()
            return aula
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Ya existe un aula con ese nombre.")
    else:
        raise HTTPException(status_code=404, detail="Aula no encontrada.")

def editar_Materia(db: Session, id: int, nueva_info: MateriaData):
    materia = db.query(Materia).filter(Materia.id == id).first()
    if materia:
        try:
            materia.nombre = nueva_info.nombre
            materia.carrera = nueva_info.carrera
            db.commit()
            db.refresh(materia)  
            return materia
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Ya existe una materia con ese nombre.")
    else:
        raise HTTPException(status_code=404, detail="Materia no encontrada.")

def editar_clase(db: Session, id: int, nueva_info: ClaseData):
    clase = db.query(Clase).filter(Clase.id == id).first()
    if clase:
        try:
            clase.id_aula = nueva_info.id_aula
            clase.id_materia = nueva_info.id_materia
            clase.dia = nueva_info.dia
            clase.hora_inicial = nueva_info.hora_inicial
            clase.hora_final = nueva_info.hora_final
            clase.nombre_materia = nueva_info.nombre_materia
            clase.carrera_materia = nueva_info.carrera_materia
            clase.nombre_aula = nueva_info.nombre_aula
            db.commit()
            db.refresh(clase)
            return clase
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Error al modificar la clase.")
    else:
        raise HTTPException(status_code=404, detail="Clase no encontrada.")

# BORRAR

def delete_materia_by_id(db: Session, materia_id: int):
    materia = db.query(Materia).filter(Materia.id == materia_id).first()
    if materia:
        try:
            db.delete(materia)
            db.commit()
            return {"message": "Materia eliminada exitosamente."}
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Error de integridad al eliminar la materia.")
    else:
        raise HTTPException(status_code=404, detail="Materia no encontrada.")

def delete_aula_by_id(db: Session, aula_id: int):
    aula = db.query(Aula).filter(Aula.id == aula_id).first()
    if aula:
        try:
            db.delete(aula)
            db.commit()
            return {"message": "Aula eliminada exitosamente."}
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Error de integridad al eliminar el aula.")
    else:
        raise HTTPException(status_code=404, detail="Aula no encontrada.")

def delete_clase(db: Session, clase_id: int):
    clase = db.query(Clase).filter(Clase.id == clase_id).first()
    if clase:
        try:
            db.delete(clase)
            db.commit()
            return {"message": "Clase eliminada exitosamente."}
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=400, detail="Error de integridad al eliminar la clase.")
    else:
        raise HTTPException(status_code=404, detail="Clase no encontrada.")

    