# 🧩 JobBridge – Digital Freelance Services Platform for SMEs

## 📌 General Description
JobBridge is a digital platform designed to connect local freelancers, primarily young professionals, with small and medium-sized enterprises (SMEs) that require specialized services on a project basis, such as graphic design, software development, translation, and digital marketing.

The central objective of the platform is to **reduce youth unemployment** and **promote flexible employment opportunities** through a reliable, accessible digital ecosystem focused on the efficient hiring of professional services.

---

## 🎯 Project Objective
To design, develop, and implement a platform that enables:

- **Freelancers** to offer and manage their professional services.  
- **SMEs** to hire services in a secure and transparent manner.  
- Structured communication, task tracking, payment simulation, and service quality evaluation.

---

## 📊 Alignment with the PMBOK® Guide
The JobBridge project is aligned with the **PMBOK® Guide of the Project Management Institute (PMI)**, incorporating a structured and disciplined project management approach.

### 🧠 Process Groups
- Initiating  
- Planning  
- Executing  
- Monitoring and Controlling  
- Closing  

### 📐 Knowledge Areas
- Integration Management  
- Scope Management  
- Schedule Management  
- Cost Management  
- Quality Management  
- Resource Management  
- Communications Management  
- Risk Management  
- Procurement Management  
- Stakeholder Management  

This alignment ensures systematic planning, risk control, quality assurance, and effective stakeholder coordination throughout the project lifecycle.

---

## 👥 System Users
The platform includes **two primary user roles**:

### 🧑‍💻 Freelancer
- Publish and manage professional services.  
- Receive and manage hiring requests.  
- Update the status of assigned work.  
- View ratings and reviews.  

### 🏢 Client (SME)
- Browse and search available services.  
- Hire professional services on demand.  
- Track contracted services.  
- Rate freelancers and services upon completion.  

---

## ⚙️ Core Features

### 🔐 Authentication and User Management
- User registration with role selection (Freelancer or Client).  
- Email-based login.  
- User profile management.  
- Role-based access control.  

### 🧰 Service Management
- Creation, editing, and deactivation of services by freelancers.  
- Service categorization by professional areas.  
- Definition of pricing, billing units, and service validity.  

### 🔍 Search and Discovery
- Service catalog.  
- Keyword-based search functionality.  
- Filters by category, price range, and freelancer.  

### 🤝 Service Contracting
- Service request submission by clients.  
- Payment process simulation.  
- Registration of service start and completion dates.  
- Contract status tracking.  

### 💬 Communication
- Interaction between freelancer and client linked to each contract  
  (conceptual or simulated implementation).  

### ⭐ Ratings and Reviews
- Service rating upon completion.  
- Written feedback associated with the experience.  
- Average ratings displayed on freelancer profiles and services.  

---

## 🗄️ Data Architecture
The system is built on a relational database model composed of the following main entities:

- Company  
- User  
- Client  
- Freelancer  
- Area  
- Service  
- Freelancer_Service  
- Service_Pricing  
- Contracted_Service  
- Rating  

The database design ensures:

- Referential integrity.  
- Price history management.  
- Contract traceability.  
- Clear separation between authentication data and user profile information.  

---

## 🛠️ Technologies Used
- **Database:** SQL Server (T-SQL)  
- **Architecture:** Normalized relational data model  
- **Project Management Framework:** PMBOK® Guide (PMI)  
- **Platform Type:** Web application (academic implementation)  

---

## 📦 Project Scope
This project corresponds to an **academic implementation**, therefore:

- Payments are simulated.  
- No real financial transactions are processed.  
- Security measures are addressed conceptually, including password hashing and role-based access control.  

---

## 🤝 Key Stakeholders
- Local freelancers, primarily young professionals.  
- SMEs and micro-enterprises.  
- The development team.  
- Potential investors and institutions supporting youth employment initiatives.  

---

## 🏁 Conclusion
JobBridge represents a digital solution aimed at strengthening youth employment and supporting SMEs through accessible professional services. The project integrates database design, functional analysis, and structured project management practices.

It fulfills both academic and technical requirements while demonstrating the practical application of information systems engineering and project management standards.

---

## 👨‍🎓 Author
Academic project developed as part of a university course in Engineering / Information Systems.
