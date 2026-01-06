# Cloud Event RSVP System

## Overview
The Cloud Event RSVP System is a web-based application that allows organizers to create events and manage attendee RSVPs with enforced capacity limits. The system demonstrates a complete software solution including backend logic, data persistence, and a simple user interface for successful execution.

This project was developed as a final capstone to demonstrate software design, implementation, testing, and execution.

---

## Features
- Create events with date, location, description, and capacity
- View a list of upcoming events
- RSVP to events with status tracking (going / interested)
- Enforced capacity limits to prevent overbooking
- Persistent storage using SQLite
- Static UI served from the Express application

---

## Technology Stack
- Node.js
- Express
- SQLite
- HTML, JavaScript
- Tailwind CSS (via CDN)

---

## Project Structure

cloud-event-rsvp-system/
├── README.md
├── package.json
├── src/
│ ├── app.js
│ ├── db/
│ │ └── database.js
│ └── public/
│ └── index.html


---

## How to Run the Application

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
npm install


### Start the Server


node src/app.js


### Access the Application
Open a browser and navigate to:


http://localhost:3000


---

## API Endpoints

### Events
- `POST /events` – Create a new event
- `GET /events` – Retrieve all events

### RSVPs
- `POST /rsvps` – Submit an RSVP
- `GET /rsvps?event_id=ID` – Retrieve RSVPs for a specific event

---

## System Testing
The system was tested to verify:
- Successful event creation
- Successful RSVP submission
- Capacity enforcement when limits are reached
- Data persistence and retrieval

Screenshots of successful execution are included with the capstone submission.

---

## Deployment Considerations
The application is cloud-ready and can be deployed to platforms that support Node.js applications. Deployment is optional and not required for local execution or evaluation.

---

## Author
Capstone Project – CSC480
Colorado State University Global