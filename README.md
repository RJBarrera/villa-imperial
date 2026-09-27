# Villa Imperial

Guía rápida para preparar y ejecutar el proyecto localmente en **Windows**, usando **PowerShell** o **CMD**.

---

## Estructura del proyecto

```text
villa-imperial/
├── backend/
└── frontend/
```

---

# Backend

## PowerShell

### 1. Entrar al backend

```powershell
cd backend
```

### 2. Crear el entorno virtual con Python 3.12

```powershell
py -3.12 -m venv .venv
```

### 3. Activar el entorno virtual

```powershell
.\.venv\Scripts\Activate.ps1
```

Cuando esté activo, la consola mostrará algo similar a:

```text
(.venv) PS C:\...\villa-imperial\backend>
```

### 4. Actualizar pip

```powershell
python -m pip install --upgrade pip
```

### 5. Instalar las dependencias

```powershell
pip install -r requirements.txt
```

### 6. Levantar el backend

```powershell
python -m uvicorn app.main:app --reload
```

Backend disponible en:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### Levantar el backend para acceder desde otro dispositivo de la red

```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## CMD

### 1. Entrar al backend

```cmd
cd backend
```

### 2. Crear el entorno virtual con Python 3.12

```cmd
py -3.12 -m venv .venv
```

### 3. Activar el entorno virtual

```cmd
.venv\Scripts\activate.bat
```

Cuando esté activo, la consola mostrará algo similar a:

```text
(.venv) C:\...\villa-imperial\backend>
```

### 4. Actualizar pip

```cmd
python -m pip install --upgrade pip
```

### 5. Instalar las dependencias

```cmd
pip install -r requirements.txt
```

### 6. Levantar el backend

```cmd
python -m uvicorn app.main:app --reload
```

Backend disponible en:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

### Levantar el backend para acceder desde otro dispositivo de la red

```cmd
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

# Frontend

## PowerShell

### 1. Entrar al frontend

Desde la raíz del proyecto:

```powershell
cd frontend
```

### 2. Instalar `node_modules`

```powershell
npm install
```

Esto instala las dependencias definidas en `package.json`.

### 3. Levantar la página normalmente

```powershell
npm run dev
```

Página disponible normalmente en:

```text
http://localhost:5173
```

### 4. Levantar la página para acceder mediante la IP de la PC

```powershell
npm run dev -- --host 0.0.0.0
```

Vite mostrará algo similar a:

```text
Local:   http://localhost:5173/
Network: http://192.168.1.100:5173/
```

Desde otro dispositivo conectado a la misma red se puede abrir:

```text
http://IP_DE_LA_PC:5173
```

Para consultar la IP de la PC:

```powershell
ipconfig
```

Busca la dirección **IPv4** del adaptador de red que estés utilizando.

---

## CMD

### 1. Entrar al frontend

Desde la raíz del proyecto:

```cmd
cd frontend
```

### 2. Instalar `node_modules`

```cmd
npm install
```

### 3. Levantar la página normalmente

```cmd
npm run dev
```

Página disponible normalmente en:

```text
http://localhost:5173
```

### 4. Levantar la página para acceder mediante la IP de la PC

```cmd
npm run dev -- --host 0.0.0.0
```

Desde otro dispositivo conectado a la misma red:

```text
http://IP_DE_LA_PC:5173
```

Para consultar la IP:

```cmd
ipconfig
```

Busca la dirección **IPv4** del adaptador de red que estés utilizando.

---

# Importante para probar desde otro dispositivo

Si se abre el frontend desde otro equipo o celular usando la IP de la PC, el backend también debe estar escuchando en la red:

```text
0.0.0.0:8000
```

Por eso debe iniciarse con:

```text
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Además, el frontend no debe intentar consumir el backend mediante `localhost`, porque desde un celular `localhost` apunta al propio celular.

Para pruebas en red local, configura temporalmente la URL del API con la IP de tu PC, por ejemplo:

```env
VITE_API_URL=http://192.168.1.100:8000/api
```

Y permite en el CORS del backend el origen correspondiente, por ejemplo:

```text
http://192.168.1.100:5173
```

Después de cambiar `VITE_API_URL`, reinicia Vite.

---

# Comandos rápidos

## PowerShell

### Backend

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Frontend por IP

```powershell
npm run dev -- --host 0.0.0.0
```

---

## CMD

### Backend

```cmd
cd backend
py -3.12 -m venv .venv
.venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### Frontend

```cmd
cd frontend
npm install
npm run dev
```

### Frontend por IP

```cmd
npm run dev -- --host 0.0.0.0
```
