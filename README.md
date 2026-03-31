# Cloud Event RSVP System

## Overview
The Cloud Event RSVP System is a web-based application that allows organizers to create events and manage attendee RSVPs with enforced capacity limits.

This project demonstrates a full-stack application combined with modern cloud and DevOps practices, including containerization, cloud deployment, and CI/CD automation.

---

## Cloud and DevOps Implementation

This application is containerized using Docker and deployed on AWS ECS using ECR for container image management. A CI/CD pipeline is implemented using GitHub Actions to automate build and deployment workflows.

The project demonstrates how applications move from local development to cloud environments using modern DevOps practices.

---

## Features
- Create events with date, location, description, and capacity  
- View a list of upcoming events  
- RSVP to events with status tracking (going / interested)  
- Enforced capacity limits to prevent overbooking  
- Persistent storage using SQLite  
- Simple UI served from the Express application  

---

## Technology Stack

### Application
- Node.js  
- Express  
- SQLite  
- HTML, JavaScript  
- Tailwind CSS  

### Cloud and DevOps
- AWS ECS (Fargate)  
- AWS ECR  
- Docker  
- GitHub Actions (CI/CD)  

---

## Architecture

User → Express API → Docker Container → AWS ECS → SQLite Database  

- Application containerized with Docker  
- Container images stored in AWS ECR  
- Deployed using AWS ECS Fargate  
- CI/CD pipeline automates build and deployment  

---

## Project Structure

```
cloud-event-rsvp-system/
├── README.md
├── package.json
├── src/
│   ├── app.js
│   ├── db/
│   │   └── database.js
│   └── public/
│       └── index.html
```

---

## How to Run the Application

### Prerequisites
- Node.js (v18+ recommended)  
- npm  
- Docker (optional for containerized run)  

### Installation
npm install

### Run Locally
node src/app.js

### Run with Docker
docker build -t rsvp-app .
docker run -p 3000:3000 rsvp-app

### Access the Application

http://localhost:3000


---

## CI/CD Pipeline

GitHub Actions is used to automate:
- Application build  
- Container image creation  
- Deployment workflow  

This ensures consistent and repeatable delivery of the application.

---

## API Endpoints

### Events
- POST /events – Create a new event  
- GET /events – Retrieve all events  

### RSVPs
- POST /rsvps – Submit an RSVP  
- GET /rsvps?event_id=ID – Retrieve RSVPs for a specific event  

---

## System Testing
The system was tested to verify:
- Successful event creation  
- RSVP submission  
- Capacity enforcement  
- Data persistence and retrieval  

---

## Deployment

The application is deployed using containerized infrastructure on AWS ECS, demonstrating a production-style cloud deployment workflow.

---

## Author
Anita Ismail
