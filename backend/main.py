from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import crud
from database import engine, localSession
from models import Base
from schemas import MateriaData, MateriaId, AulaData, AulaId, ClaseData, ClaseId


Base.metadata.create_all(bind=engine)

app = FastAPI()


origins = [
    "http://localhost:5173",
    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = localSession()
    try:
        yield db 
    finally:
        db.close()


#GET 

@app.get('/')
def root():
    return {"message": "Index"}

#pedir todas las aulas
@app.get('/api/aulas/', response_model=list[AulaId])
def get_aulas(db: Session = Depends(get_db)):
    return crud.get_aulas(db=db)

#pedir un aula especifica
@app.get('/api/aulas/{id}')
def get_aulas_byId(id, db:Session = Depends(get_db)):
    aula = crud.get_Aula_by_id(db=db, id=id)
    
    if aula:
        return aula
    raise HTTPException(status_code=400, detail = "Aula no encontrada")

#pedir todas las materias
@app.get('/api/materias/', response_model=list[MateriaId])
def get_materias(db:Session = Depends(get_db)):
    return crud.get_materias(db=db)

#pedir materia especifica
@app.get('/api/materias/{id}')
def get_materia_byId(id, db: Session = Depends(get_db)):
    return crud.get_Materia_by_id(db=db, id=id)

#pedir todas las clases
@app.get('/api/clases/', response_model=list[ClaseId])
def get_clases(db:Session = Depends(get_db)):
    return crud.get_clases(db=db)

#pedir clase especifica
@app.get('/api/clases/{id}')
def get_clase_byId(id, db:Session = Depends(get_db)):
    return crud.get_clase_byId(db=db, id=id)

 
#POST

@app.post("/api/aulas/crear-aula", response_model=AulaData, status_code=status.HTTP_201_CREATED)
def crear_aula(aula: AulaData, db: Session = Depends(get_db)):
    nombre = aula.nombre.strip().lower()

    aula_existente = crud.get_aula_by_nombre(db, nombre)

    if aula_existente:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ya hay un aula con ese nombre")

    try:
        nueva_aula = crud.create_Aula(db=db, aula=aula)
        return nueva_aula
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado, revise los valores")


@app.post("/api/materias/crear-materia", response_model=MateriaData, status_code=status.HTTP_201_CREATED)
def crear_materia(materia: MateriaData, db: Session = Depends(get_db)):
    try:
        nueva_materia = crud.create_Materia(db=db, materia=materia)
        return nueva_materia
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error inesperado, revise los valores")


    
@app.post("/api/clases/crear-clase", response_model=ClaseData, status_code=status.HTTP_201_CREATED)
def crear_clase(clase: ClaseData, db: Session = Depends(get_db)):
    try:
        nueva_clase = crud.create_Clase(db=db, clase=clase)
        return nueva_clase
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error inesperado, revise los valores.")

    

# DELETES

#Borrar materia por id
@app.delete("/api/materias/borrar-materia-id/{id}", status_code=200)
def delete_materia_by_id(id:int, db:Session = Depends(get_db)):
    try:
        mensaje = crud.delete_materia_by_id(db=db, materia_id=id)
        return mensaje
    except HTTPException as e:
        raise e
    
    
#Borrar aula por id
@app.delete("/api/aulas/borrar-aula-id/{id}",status_code=200)
def delete_aula_by_id(id:int, db:Session = Depends(get_db)):
    try:
        mensaje = crud.delete_aula_by_id(db=db, aula_id=id)
        return mensaje
    except HTTPException as e:
        raise e

#Borrar clase por id
@app.delete("/api/clases/borrar-clase-id/{id}",status_code=200)
def delete_clase_by_id(id:int, db:Session = Depends(get_db)):
    try:
        mensaje = crud.delete_clase(db=db, clase_id=id)
        return mensaje
    except HTTPException as e:
        raise e
    
#PUTS

#Editar aula
@app.put("/api/aulas/editar-aula/{id}", response_model=AulaData, status_code=status.HTTP_200_OK)
def editar_aula(id:int, info: AulaData, db:Session = Depends(get_db)):
    try:
        aula_modificada = crud.editar_Aula(db=db,id=id,nueva_info=info)
        return aula_modificada
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado, revise los valores")
    
#Editar materia
@app.put("/api/materias/editar-materia/{id}", response_model=MateriaData, status_code=status.HTTP_200_OK)
def editar_materia(id: int, info: MateriaData, db: Session = Depends(get_db)):   
    try:
        materia_modificada = crud.editar_Materia(db=db, id=id, nueva_info=info)
        return materia_modificada
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado, revise los valores")

#Editar clase
@app.put("/api/clases/editar-clase/{id}", response_model=ClaseData, status_code=status.HTTP_200_OK)
def editar_clase(id: int, info:ClaseData, db :Session = Depends(get_db)):
     try:
         clase_modificada = crud.editar_clase(db=db, id=id, nueva_info=info) 
         return clase_modificada
     except HTTPException as e:
         raise e
     except Exception as e:
         raise HTTPException(status_code=500, detail=f"Error inesperado, revise los valores")


    

