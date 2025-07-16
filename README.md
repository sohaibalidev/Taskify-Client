# Taskify Client

This is the frontend of **Taskify**, a lightweight personal task manager with user authentication, dark/light mode support, and a minimal UI focused on productivity.

---

## Features

- User-friendly React interface  
- Light and dark mode toggle  
- Secure login and registration  
- Add, edit, complete, and delete todos  
- Each user has a private todo list  

---

## Tech Stack

- React.js  
- React Router  
- Axios  
- CSS3 (custom theming)  

---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/taskify-client.git
cd taskify-client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm start
```

The app will run at `http://localhost:3000`

---

## Folder Structure

```
taskify-client/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Todos.js
│   ├── styles/
│   │   ├── App.css
│   │   └── Theme.css
│   └── App.js
│
├── .env
├── package.json
└── README.md
```

---

## Deployment

To deploy on Netlify:

1. Build the project:

```bash
npm run build
```