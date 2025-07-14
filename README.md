#  SPA Administration Panel - Event Management

This project is a **Single Page Application (SPA)** built with **Vanilla JavaScript, HTML5, and CSS3**. The goal is to create a complete system for event and registration management, implementing role-based authentication and full CRUD operations.

##  Features

### Authentication Module
- **User Registration**: New visitors can create an account.
- **Login**: Credential validation against the mock API.
- **Session Management**: `localStorage` is used to persist the user session.
- **Protected Paths**: The administration panel is only accessible to users with the `admin` role.

###  Administration Panel (`/dashboard`)
- **User CRUD**: Administrators can create, read, update, and delete users.
- **Course CRUD**: Administrators have full control over events.
- **Dynamic Interface**: Use of reusable components (Header, Sidebar, Modals) for a fluid user experience.

###  Public View
- **Course Catalog**: Displays all available courses in a grid of cards.
- **Course Enrollment**: Authenticated users can enroll in courses. The system prevents duplicate enrollments.

##  Technology Stack

- **Frontend**: HTML5, CSS3 (Flexbox and Grid), Vanilla JavaScript (ES6+).
- **Development Environment**: [Vite](https://vitejs.dev/) as the development server and packager.
- **API Mock**: [json-server](https://github.com/typicode/json-server) to simulate a RESTful API from a `db.json` file.

** Challenge Restrictions:** No JS frameworks (React, Vue, Angular), CSS libraries (Bootstrap, Tailwind), or jQuery were used.

## 📁 File Structure

The project is organized as follows to promote modularity and scalability:

```
/
├── src/
│ ├── assets/ # Static files such as CSS and images.
│ ├── components/ # Reusable components (Header, Sidebar, Modal).
│ ├── pages/ # HTML templates for each view of the SPA.
│ ├── services/ # API communication logic (Auth, Users, Courses).
│ ├── utils/ # Utility functions (storage management, validation).
│ └── main.js # Main entry point, router, and core logic.
├── db.json # Database mock for json-server.
├── index.html # Main HTML hosting the SPA.
├── package.json # Project dependencies and scripts.
└── README.md # This file!
```

##  Getting Started

Follow these steps to run the project on your local machine.

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation
1. **Clone the repository:**
```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```
2. **Install dependencies:**
```bash
npm install
```

### Execution
To start the development environment, you need to run **two commands** in separate terminals.

1. **Start the API server (json-server):**
```bash
npm run serve-json
```
The API will be available at `http://localhost:3000`.

2. **Start the Vite development server:**
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or whatever port Vite specifies).

### Administrator Credentials
You can log in as an administrator with the following default credentials:
- **Email**: `admin@admin.com`
- **Password**: `admin123`

### Coder Info
- **Name: Andres Niebles Martinez**
- **Clan: Lovelace**