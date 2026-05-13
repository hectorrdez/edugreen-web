# EduGreen 2.0

EduGreen es una plataforma web educativa centrada en la sostenibilidad medioambiental. El proyecto combina aprendizaje, retos ecologicos y gamificacion para que estudiantes y profesores puedan trabajar contenidos relacionados con el cuidado del planeta de una forma mas participativa.

La idea principal es convertir la educacion ambiental en una experiencia activa: los profesores crean aulas y desafios, los estudiantes completan esos retos, ganan puntos y pueden comparar su progreso dentro de un ranking.

## Contexto del proyecto

EduGreen es un Proyecto de Fin de Ciclo del Grado Superior en Desarrollo de Aplicaciones Web (DAW), desarrollado por Hector Rodriguez.

El objetivo del proyecto es demostrar la capacidad de disenar y construir una aplicacion web completa, desde la interfaz de usuario hasta la conexion con servicios externos, aplicando buenas practicas de desarrollo frontend, organizacion por componentes y una arquitectura preparada para crecer.

## De que va EduGreen

EduGreen nace de la union de tres ideas:

- Educacion: facilitar el aprendizaje de conceptos relacionados con sostenibilidad, reciclaje, consumo responsable y medio ambiente.
- Gamificacion: usar puntos, retos, niveles y rankings para aumentar la motivacion de los estudiantes.
- Gestion docente: dar a los profesores una herramienta desde la que puedan organizar aulas, proponer actividades y seguir el progreso del alumnado.

La plataforma esta pensada para entornos educativos donde se quiera trabajar la conciencia medioambiental de una forma mas cercana, visual y dinamica.

## Como funciona

EduGreen diferencia dos recorridos principales: estudiantes y profesores.

### Estudiantes

Los estudiantes pueden crear una cuenta, acceder a una clase mediante un codigo facilitado por el profesor y consultar los retos disponibles. Cada reto completado suma puntos al perfil del alumno y mejora su posicion en el ranking de la clase.

El objetivo es que el estudiante aprenda realizando actividades cortas, semanales y medibles, manteniendo una sensacion constante de progreso.

### Profesores

Los profesores pueden crear aulas virtuales, disenar retos personalizados y consultar el avance de los alumnos. Desde su panel pueden ver quien acepta y completa cada actividad, detectar falta de participacion y analizar los resultados del grupo.

El profesor actua como guia del proceso, mientras la plataforma centraliza la gestion y hace visible el progreso.

## Funcionalidades principales

- Registro e inicio de sesion de usuarios.
- Aulas virtuales para organizar grupos de alumnos.
- Retos ecologicos adaptados al contenido de cada clase.
- Sistema de puntos para premiar la participacion.
- Ranking para comparar el progreso dentro del aula.
- Paginas informativas sobre el proyecto, su funcionamiento y sus politicas.
- Formulario de newsletter para recibir informacion relacionada con sostenibilidad.

## Arquitectura general

La aplicacion esta construida como una interfaz web moderna basada en React y TypeScript. El codigo se organiza en paginas, componentes reutilizables, servicios y contextos.

Las paginas publicas presentan EduGreen, explican el funcionamiento de la plataforma y permiten acceder al registro o al inicio de sesion. Las partes privadas estan pensadas para mostrar informacion propia del usuario autenticado, como rankings, progreso y gestion de la actividad.

Los servicios se encargan de comunicarse con la API mediante peticiones HTTP, separando la logica de conexion del resto de la interfaz. Esto permite mantener los formularios y componentes centrados en la experiencia de usuario.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Tabler Icons

## Proposito

EduGreen no es solo una aplicacion tecnica. Es una propuesta para usar la tecnologia como herramienta educativa y social, acercando la sostenibilidad a las aulas mediante una experiencia digital sencilla, motivadora y ampliable.

Como Proyecto de Fin de Ciclo de DAW, representa el cierre de una etapa formativa y la aplicacion practica de los conocimientos adquiridos durante el ciclo.
