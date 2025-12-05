# 📚 Sistema de Gestión de Eventos Académicos

Sistema web para la gestión y administración de eventos académicos con control de acceso por roles (Administrador, Maestro, Alumno).

## 🚀 Características

- ✅ **CRUD completo** de eventos académicos
- 👥 **Control de acceso por roles** con diferentes permisos
- 🔒 **Autenticación segura** mediante tokens Bearer
- 🎯 **Filtrado automático** de eventos según el rol del usuario
- ✔️ **Validaciones exhaustivas** en frontend y backend
- 📱 **Interfaz responsiva** con Angular Material

## 🛠️ Tecnologías

### Backend
- Django 3.2
- Django REST Framework
- MySQL
- Bearer Token Authentication

### Frontend
- Angular 
- Angular Material
- TypeScript
- RxJS

## 📋 Funcionalidades por Rol

### 👨‍💼 Administrador
- Crear, editar y eliminar eventos
- Ver todos los eventos del sistema
- Gestionar responsables y configuraciones

### 👨‍🏫 Maestro
- Crear y editar eventos
- Ver eventos para profesores y público general

### 👨‍🎓 Alumno
- Ver eventos para estudiantes y público general
- Consultar detalles de eventos

## 🗂️ Estructura del Proyecto

```
proyecto/
├── backend/                    # Django REST API
│   ├── app_movil_escolar_api/
│   │   ├── models.py          # Modelos de datos
│   │   ├── views/
│   │   │   └── eventosAcademicos.py
│   │   └── serializers.py
│   └── requirements.txt
│
└── frontend/                   # Angular App
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── eventos-academicos/
    │   │   │   └── registro-academicos/
    │   │   └── services/
    │   │       └── eventos-academicos.service.ts
    │   └── environments/
    └── package.json
```

## 🔧 Instalación

### Backend (Django)

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/app-movil-escolar-webapp.git
cd app-movil-escolar-webapp/backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos en settings.py
# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

### Frontend (Angular)

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar URL de API en src/environments/environment.ts

# Iniciar aplicación
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## 🌐 Despliegue

### Frontend - Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Backend - PythonAnywhere

1. Subir código al servidor
2. Configurar base de datos MySQL
3. Instalar dependencias en entorno virtual
4. Configurar WSGI file
5. Configurar archivos estáticos
6. Reload de la aplicación

## 🔑 API Endpoints

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/lista-eventos-academicos/` | Obtener lista de eventos (filtrado por rol) | Requerida |
| GET | `/eventos-academicos/?id={id}` | Obtener evento específico | Requerida |
| POST | `/eventos-academicos/` | Crear nuevo evento | Requerida |
| PUT | `/eventos-academicos/` | Actualizar evento | Requerida |
| DELETE | `/eventos-academicos/?id={id}` | Eliminar evento | Requerida |

### Ejemplo de petición

```bash
curl -X GET https://api.example.com/lista-eventos-academicos/ \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json"
```

## 📝 Modelo de Datos - Evento Académico

```json
{
  "nombre_evento": "Conferencia de IA",
  "tipo_evento": "Conferencia",
  "fecha_realizacion": "2024-12-15",
  "hora_inicio": "10:00",
  "hora_final": "12:00",
  "lugar": "Auditorio Principal",
  "publico_objetivo": "Estudiantes, Profesores",
  "programa_educativo": "Ingeniería en Sistemas",
  "responsable": "Dr. Juan Pérez",
  "descripcion": "Conferencia sobre avances en Inteligencia Artificial",
  "cupo_maximo": 100
}
```

## 🔐 Seguridad

- Autenticación mediante tokens Bearer
- CORS configurado para dominios específicos
- Validación de datos en cliente y servidor
- Permisos basados en roles
- HTTPS en producción

## 🧪 Validaciones Implementadas

### Nombre del Evento
- Campo requerido
- Solo caracteres alfanuméricos y espacios
- Sin caracteres especiales

### Fecha
- Campo requerido
- No puede ser anterior a la fecha actual

### Horarios
- Ambos campos requeridos
- Hora final debe ser mayor a hora inicial

### Público Objetivo
- Al menos una opción seleccionada
- Opciones: Estudiantes, Profesores, Público General

### Cupo Máximo
- Campo requerido
- Solo valores numéricos

## 📦 Dependencias Principales

### Backend
```
Django==3.2.18
djangorestframework==3.14.0
django-cors-headers==3.14.0
mysqlclient==2.1.1
```

### Frontend
```json
{
  "@angular/core": "^14.0.0",
  "@angular/material": "^14.0.0",
  "rxjs": "^7.5.0"
}
```

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.

## 👨‍💻 Autor

**David** - Proyecto Final - Aplicación Móvil Escolar

## 🙏 Agradecimientos

- Material Design por los componentes UI
- Django REST Framework por facilitar la creación de APIs
- Angular por el framework robusto de frontend

---

⭐ Si te resultó útil este proyecto, no olvides darle una estrella!
