# HealthCare Project

A comprehensive health and wellness platform featuring an AI Medical Chatbot and a Diet & Calorie Tracking App. This project is organized into two main components:

- **AI_Medical_Chatbot**: An intelligent chatbot for answering medical queries and providing health information.
- **healthcare_diet_app**: A full-stack application for logging food, tracking calories, and managing dietary habits, with both backend (Django) and frontend (Next.js/React).

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This repository contains two main projects:

1. **AI_Medical_Chatbot**: Uses generative AI to answer medical questions, leveraging a knowledge base (e.g., PDF medical book) and advanced NLP techniques.
2. **Healthcare Diet App**: Allows users to log their meals, track daily calorie intake, and receive dietary recommendations. The backend is built with Django REST Framework, and the frontend uses Next.js and React.

---

## Features

### AI_Medical_Chatbot
- Query medical information from a PDF knowledge base
- Natural language understanding and response generation
- Easy to extend with more data sources

### Healthcare Diet App
- User authentication and profile management
- Food logging with meal and quantity details
- Calorie lookup and daily calorie tracking
- Symptom logging
- Dashboard with daily summaries
- Responsive, modern UI

---

## Project Structure

```
HealthCare/
│
├── AI_Medical_Chatbot/
│   ├── Data/                # Medical knowledge base (PDF)
│   ├── src/                 # Core chatbot logic
│   ├── research/            # Experiments and notebooks
│   ├── requirements.txt     # Python dependencies
│   └── setup.py             # Python package setup
│
└── healthcare_diet_app/
    ├── backend/             # Django backend
    │   └── healthapp/       # Django app (models, views, etc.)
    └── frontend/            # Next.js/React frontend
        └── healthify/       # Main frontend app
```

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/HealthCare.git
cd HealthCare
```

### 2. AI_Medical_Chatbot Setup
```bash
cd AI_Medical_Chatbot
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Healthcare Diet App Backend Setup
```bash
cd ../healthcare_diet_app/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install django djangorestframework
python manage.py migrate
python manage.py runserver
```

### 4. Healthcare Diet App Frontend Setup
```bash
cd ../../frontend/healthify
npm install
npm run dev
```

---

## Usage

- **AI_Medical_Chatbot**: Run the chatbot scripts or notebooks in `AI_Medical_Chatbot/research/`.
- **Diet App Backend**: Access the API at `http://127.0.0.1:8000/api/` after running the Django server.
- **Diet App Frontend**: Visit `http://localhost:3000` in your browser after starting the frontend.

---

## Technologies Used
- **Python, Django, Django REST Framework** (backend)
- **React, Next.js, TypeScript, Tailwind CSS, Ant Design** (frontend)
- **OpenAI, Generative AI, NLP** (chatbot)
- **Axios, Toastify** (frontend utilities)

---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

