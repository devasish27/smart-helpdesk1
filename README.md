# Smart Helpdesk

A full-stack helpdesk application with AI-assisted ticket triage and knowledge base support.

## Features

* User registration and login.
* Ticket creation, editing, and AI triage.
* Agent suggestions persisted automatically.
* Auto-close tickets if confidence threshold is met.
* Tickets requiring human review go to `waiting_human` status.
* Audit timeline shows steps, timestamps, and traceId.
* KB search for relevant articles.
* STUB\_MODE for running locally without external API keys.
* Docker Compose setup for full stack deployment.

## Project Structure

```
smart-helpdesk/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page-level components
│   │   ├── store/       # State management
│   │   └── lib/         # API utils
├── server/              # Express backend
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── controllers/     # Route handlers
│   └── seed.js          # Seed script
└── docker-compose.yml
```

## Architecture Diagram



## Environment Variables

### Backend (.env)

```
PORT=8080
MONGO_URI=mongodb+srv://devasishsai:8KubVxvMKRvWGiGj@cluster0.n2go2nc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
STUB_MODE=true
JWT_SECRET=change-me
CONFIDENCE_THRESHOLD=0.7
AUTO_CLOSE=true
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:5173/api
STUB_MODE=true
```

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/devasish27/smart-helpdesk1
cd smart-helpdesk1
```

### 2. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Seed Example Data

* Use MongoDB Compass or `mongo` shell.
* Example collections: `articles`, `auditlogs`, `configs`, `notifications`, `tickets`, `users`.
* Insert 2-3 sample documents in each collection.

### 4. Run the app

```bash
# Server
cd server
npm run dev

# Client
cd ../client
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:5000/api](http://localhost:8000/api)

### 5. Docker Setup

```bash
docker compose up
```

* Full stack will be up with all services.

## Usage

1. Register/login as a normal user.
    Admin: testuser@example.com / password123
    User: jane.doe@example.com / password@123
2. Create a ticket.
3. AI triage runs automatically.
4. Tickets either resolve automatically (if confidence ≥ threshold) or await human agent review.
5. Agents can edit/reply tickets, see audit timeline, and view KB suggestions.



## Testing

Install dev dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Run tests:
```bash
cd client
npm test
```

Note: Some tests require <Router> wrapping due to useNavigate hooks.

## Notes

* Run in `STUB_MODE=true` for offline/testing without external AI keys.
* Make sure MongoDB is running and env variables are set correctly.

## Dependencies

* Frontend: React, React Router, TailwindCSS, Recharts
* Backend: Node.js, Express, Mongoose
* Testing: Jest, React Testing Library

## License

MIT