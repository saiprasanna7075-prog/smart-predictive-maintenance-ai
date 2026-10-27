# Smart Analog Modulation AI — FastAPI Backend

This directory contains the Python REST API server for the Smart Analog Modulation Classifier project.

## Quick Start

### 1. Create a virtual environment & install requirements
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Start the FastAPI server
```bash
uvicorn app:app --reload --port 8000
```

The server will be available at:
- API endpoint: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 3. Connecting to the React Frontend
1. Open the web dashboard in your browser (`http://localhost:5173`).
2. Click the **Settings** icon on the top navigation bar.
3. Verify the Backend URL is set to `http://localhost:8000`.
4. Click **Test** and then **Save Settings**.
5. The system status pill will immediately turn emerald: **"Backend API Online"**. All subsequent signal classifications will call `POST /predict` on this Python server.
