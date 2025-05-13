# 🎓 E-Learning Platform - Microservices Architecture

Ce projet est une **plateforme d'apprentissage en ligne** moderne basée sur une architecture microservices. Il utilise **Spring Boot**, **Angular 16**, **Node.js**, **MySQL**, et des outils de gestion des services comme **Netflix Eureka** et **Spring Cloud Gateway**.

---

## 🧱 Architecture Générale


---

## 🛠️ Technologies utilisées

### Frontend
- **Angular 16** (Framework SPA moderne)
- **Node.js** (Serveur web - port `3000`)
- **HTML/CSS/TypeScript**

### Backend
- **Spring Boot** (Microservices)
- **Spring Cloud Gateway** (API Gateway - port `8093`)
- **Netflix Eureka** (Service Discovery - port `8761`)
- **Spring Data JPA** & **Hibernate**
- **JWT** (Authentification sécurisée)

### Base de données
- **MySQL** (Un schéma par microservice)

---

## 📦 Microservices

| Microservice                                         | Port  |
|-----------------------------------------------------|-------|
| 1. User & Reclamation                               | 8082  |
| 2. Course & Quiz Management                         | 8083  |
| 3. Exam & Certification                             | 8084  |
| 4. Gamification, Forum, Blog & Events               | 8085  |
| 5. Mentorship, Virtual Classroom & Live Sessions    | 8086  |
| 6. Marketplace, Donation & Crowdfunding             | 8087  |

---

## 🚀 Lancement du projet

### 1. Prérequis

- **Node.js** 18+
- **Angular CLI** `npm install -g @angular/cli`
- **Java 17**
- **Maven**
- **MySQL** 


### 2. Lancer le frontend Angular 16

```bash
cd frontend
npm install
ng serve 
