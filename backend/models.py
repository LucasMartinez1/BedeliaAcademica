from sqlalchemy import Column, String, Integer, Table, ForeignKey, UniqueConstraint, ForeignKeyConstraint
from sqlalchemy.orm import relationship
from database import Base

#crea las tablas de la base de datos

class Materia(Base):
    __tablename__ = 'materia'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), index=True, unique=True)
    carrera = Column(String(70))
    aulas = relationship("Clase", back_populates="materia", cascade="all, delete-orphan", passive_deletes=True)
    

class Aula(Base):
    __tablename__ = 'aula'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(15), unique=True)
    materias = relationship("Clase", back_populates="aula", cascade="all, delete-orphan", passive_deletes=True)
   



class Clase(Base):
    __tablename__ = 'clase'
    
    id = Column(Integer, primary_key=True)
    id_aula = Column(Integer, ForeignKey('aula.id', ondelete="CASCADE"))
    id_materia = Column(Integer, ForeignKey('materia.id', ondelete="CASCADE"))
    dia = Column(String(10))
    hora_inicial = Column(Integer)
    hora_final = Column(Integer)
    nombre_materia = Column(String)
    carrera_materia = Column(String)
    nombre_aula = Column(String)

    aula = relationship("Aula", back_populates="materias")
    materia = relationship("Materia", back_populates="aulas")
