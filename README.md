# 🧩 JobBridge – Plataforma Digital de Servicios Freelance para PYMES

## 📌 Descripción General
JobBridge es una plataforma digital diseñada para conectar freelancers locales, principalmente jóvenes profesionales, con pequeñas y medianas empresas (PYMES) que requieren servicios especializados de forma puntual, tales como diseño gráfico, programación, traducción y marketing digital.

El objetivo central de la plataforma es **reducir el desempleo juvenil** y **fomentar oportunidades laborales flexibles**, mediante un ecosistema digital confiable, accesible y orientado a la contratación eficiente de servicios profesionales.

---

## 🎯 Objetivo del Proyecto
Diseñar, desarrollar e implementar una plataforma que permita:
- A los **freelancers** ofrecer y gestionar sus servicios profesionales.
- A las **PYMES** contratar servicios de manera segura y transparente.
- Facilitar la comunicación, el seguimiento del trabajo, la simulación de pagos y la evaluación de la calidad del servicio.

---

## 📊 Alineación con PMBOK® Guide
El proyecto JobBridge se encuentra alineado con el estándar **PMBOK® Guide del Project Management Institute (PMI)**, integrando:

### 🧠 Grupos de Procesos
- Inicio  
- Planificación  
- Ejecución  
- Monitoreo y Control  
- Cierre  

### 📐 Áreas de Conocimiento
- Integración  
- Alcance  
- Cronograma  
- Costos  
- Calidad  
- Recursos  
- Comunicaciones  
- Riesgos  
- Adquisiciones  
- Gestión de los interesados  

Esta alineación permite una gestión estructurada del proyecto, orientada a la calidad, el control de riesgos y la correcta coordinación de los actores involucrados.

---

## 👥 Usuarios del Sistema
La plataforma contempla **dos tipos de usuarios**:

### 🧑‍💻 Freelancer
- Publica y administra servicios profesionales.
- Recibe y gestiona solicitudes de contratación.
- Actualiza el estado de los trabajos asignados.
- Visualiza calificaciones y reseñas recibidas.

### 🏢 Cliente (PYME)
- Explora y busca servicios disponibles.
- Contrata servicios profesionales de forma puntual.
- Da seguimiento a las contrataciones.
- Califica los servicios y freelancers una vez finalizados.

---

## ⚙️ Funcionalidades Principales

### 🔐 Autenticación y Usuarios
- Registro de usuarios con selección de rol (Freelancer o Cliente).
- Inicio de sesión mediante correo electrónico.
- Gestión de perfiles de usuario.
- Control de acceso basado en roles.

### 🧰 Gestión de Servicios
- Creación, edición y desactivación de servicios por parte del freelancer.
- Clasificación de servicios por áreas.
- Definición de precios, unidades de cobro y vigencia.

### 🔍 Búsqueda y Exploración
- Catálogo de servicios disponibles.
- Búsqueda por palabra clave.
- Filtros por área, precio y freelancer.

### 🤝 Contratación de Servicios
- Solicitud de contratación por parte del cliente.
- Simulación del proceso de pago.
- Registro de fechas de inicio y finalización del servicio.
- Seguimiento del estado de la contratación.

### 💬 Comunicación
- Interacción entre freelancer y cliente asociada a cada contratación
  (implementación conceptual o simulada).

### ⭐ Calificaciones y Reseñas
- Calificación del servicio una vez finalizado.
- Comentarios asociados a la experiencia.
- Promedios visibles en los perfiles de freelancers y servicios.

---

## 🗄️ Arquitectura de Datos
El sistema utiliza una base de datos relacional compuesta por las siguientes entidades principales:

- Empresa
- Usuario
- Cliente
- Freelancer
- Área
- Servicio
- Servicio_Freelancer
- Servicio_Precio
- Servicio_Contratado
- Calificación

El diseño garantiza:
- Integridad referencial.
- Historial de precios.
- Trazabilidad de contrataciones.
- Separación entre autenticación y perfiles de usuario.

---

## 🛠️ Tecnologías Utilizadas
- **Base de datos:** SQL Server (T-SQL)
- **Arquitectura:** Modelo relacional normalizado
- **Gestión del proyecto:** PMBOK® Guide (PMI)
- **Plataforma:** Aplicación web (enfoque académico)

---

## 📦 Alcance del Proyecto
Este proyecto corresponde a una **implementación académica**, por lo que:
- Los pagos son simulados.
- No se procesan transacciones financieras reales.
- La seguridad se aborda a nivel conceptual (hash de contraseñas y control de roles).

---

## 🤝 Interesados Clave
- Freelancers locales (jóvenes profesionales).
- PYMES y microempresas.
- Equipo de desarrollo tecnológico.
- Inversionistas y entidades de apoyo al empleo juvenil.

---

## 🏁 Conclusión
JobBridge representa una solución digital orientada al fortalecimiento del empleo juvenil y al apoyo de las PYMES, alineada con buenas prácticas de gestión de proyectos y con un enfoque social claro.

El proyecto integra diseño de bases de datos, análisis funcional y gestión de proyectos, cumpliendo con los requerimientos académicos y técnicos establecidos.

---

## 👨‍🎓 Autor
Proyecto académico desarrollado como parte de un curso universitario en el área de Ingeniería / Sistemas de Información.
