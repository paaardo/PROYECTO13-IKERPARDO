#PROYECTO 13 – IKER PARDO

Este proyecto es una aplicación web fullstack desarrollada como parte de un curso, utilizando Node.js para el backend y React para el frontend. La temática elegida ha sido la gestión de un concesionario de vehículos, permitiendo registrar, editar y visualizar vehículos, clientes y transacciones de venta. Está diseñado con una arquitectura clara y una interfaz pensada para un público adulto, con una buena experiencia de usuario (UX/UI).

La aplicación incluye autenticación de usuarios, control de roles (usuario o administrador) y un panel de resumen en la página de inicio con estadísticas generales. Los usuarios con rol administrador tienen acceso completo a las funcionalidades de gestión; los usuarios normales solo pueden consultar los datos.

La base de datos se ha creado en MongoDB a partir de un archivo Excel con más de 100 registros de vehículos, clientes y transacciones. Para poblarla se usaron dos archivos seed: importarVehiculos.js para importar los datos y eliminarVehiculos.js para limpiar la colección de vehículos.

Entre los puntos fuertes del proyecto destacan:

- Una estructura clara tanto en backend como frontend.

- Uso de rutas protegidas según el rol del usuario.

- Arquitectura RESTful con controladores y modelos bien organizados.

- Interfaz desarrollada desde cero con un sistema de estilos escalable basado en variables CSS.

- División de estilos por componente, con clases únicas para evitar conflictos.

- Uso de hooks personalizados y avanzados como useEffect y useState en React.

- Despliegue del frontend en Vercel y del backend en Render.

--LINKS DE DESPLIEGUE--

Frontend en Vercel: https://proyecto-13-ikerpardo.vercel.app

Backend en Render: https://proyecto13-ikerpardo.onrender.com

--INSTRUCCIONES PARA LEVANTAR EL PROYECTO EN LOCAL--

Clona este repositorio desde GitHub.

Abre dos terminales, una para el backend y otra para el frontend.

BACKEND:

Ve a la carpeta backend.

Ejecuta 'npm install' para instalar las dependencias.

Ejecuta npm run dev para iniciar el servidor en modo desarrollo.

FRONTEND:

Ve a la carpeta frontend.

Ejecuta 'npm install' para instalar las dependencias.

Ejecuta npm start para levantar el servidor de desarrollo de React.