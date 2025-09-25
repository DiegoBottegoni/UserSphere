# Chat MVP – API Documentation

## 1. Autenticación

### 1.1 POST `/auth/register`
Registra un nuevo usuario, devuelve un token JWT con información básica y hace login automáticamente.

**Request Body (RegisterRequestDTO)**
{
  "name": "Juan",
  "email": "juan@mail.com",
  "password": "123456"
}

**Response (RegisterResponseDTO)**
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "uuid",
    "name": "Juan",
    "email": "juan@mail.com",
    "createdAt": "2025-09-25T13:45:00.000Z",
    "updatedAt": "2025-09-25T13:45:00.000Z"
  }
}

### 1.2 POST `/auth/login`
Loguea un usuario existente y devuelve un token JWT y datos básicos del usuario.

**Request Body (LoginRequestDTO)**
{
  "email": "juan@mail.com",
  "password": "123456"
}

**Response (LoginResponseDTO)**
{
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "uuid",
    "name": "Juan",
    "email": "juan@mail.com",
    "createdAt": "2025-09-25T13:45:00.000Z",
    "updatedAt": "2025-09-25T13:45:00.000Z"
  }
}

### 1.3 GET `/auth/me` (ruta de prueba en desarrollo)
Devuelve información básica del usuario logueado según el token JWT.

**Headers**
Authorization: Bearer `<JWT_TOKEN>`

**Response**
{
  "message": "Token válido",
  "user": {
    "id": "uuid",
    "iat": 1758828577,
    "exp": 1758832177
  }
}

## 2. Usuarios

### 2.1 GET `/users/:id`
Obtiene un usuario por su ID. Ruta protegida por JWT.

**Headers**
Authorization: Bearer `<JWT_TOKEN>`

**Response (UserResponseDTO)**
{
  "id": "uuid",
  "name": "Juan",
  "email": "juan@mail.com",
  "isOnline": false,
  "createdAt": "2025-09-25T13:45:00.000Z",
  "updatedAt": "2025-09-25T13:45:00.000Z"
}

### 2.2 GET `/users`
Obtiene todos los usuarios registrados. Ruta protegida por JWT.

**Headers**
Authorization: Bearer `<JWT_TOKEN>`

**Response**
[
  {
    "id": "uuid",
    "name": "Juan",
    "email": "juan@mail.com",
    "isOnline": false,
    "createdAt": "2025-09-25T13:45:00.000Z",
    "updatedAt": "2025-09-25T13:45:00.000Z"
  },
  ...
]

### 2.3 POST `/users`
Crea un nuevo usuario. Ruta protegida por JWT.

**Request Body (CreateUserDTO)**
{
  "name": "Juan",
  "email": "juan@mail.com",
  "password": "123456",
  "isOnline": false
}

**Response (UserResponseDTO)**
{
  "id": "uuid",
  "name": "Juan",
  "email": "juan@mail.com",
  "isOnline": false,
  "createdAt": "2025-09-25T13:45:00.000Z",
  "updatedAt": "2025-09-25T13:45:00.000Z"
}

### 2.4 PUT `/users/:id`
Actualiza un usuario existente. Ruta protegida por JWT.

**Request Body (UpdateUserDTO)**
{
  "name": "Juan Updated",
  "password": "nueva_contraseña",
  "isOnline": true
}

**Response (UserResponseDTO)**
{
  "id": "uuid",
  "name": "Juan Updated",
  "email": "juan@mail.com",
  "isOnline": true,
  "createdAt": "2025-09-25T13:45:00.000Z",
  "updatedAt": "2025-09-25T14:00:00.000Z"
}

### 2.5 DELETE `/users/:id`
Elimina un usuario por su ID. Ruta protegida por JWT.

**Response**
{
  "message": "User deleted successfully"
}

## 3. DTOs

### 3.1 RegisterRequestDTO
- name: string
- email: string
- password: string

### 3.2 RegisterResponseDTO
- token: string
- user: UserResponseDTO

### 3.3 LoginRequestDTO
- email: string
- password: string

### 3.4 LoginResponseDTO
- token: string
- user: UserResponseDTO

### 3.5 UserResponseDTO
- id: string
- name: string
- email: string
- isOnline: boolean
- createdAt: Date
- updatedAt: Date

### 3.6 CreateUserDTO
- name: string
- email: string
- password: string
- isOnline?: boolean

### 3.7 UpdateUserDTO
- name?: string
- password?: string
- isOnline?: boolean

---

> Todas las rutas de usuarios están protegidas por JWT y requieren el header `Authorization: Bearer <JWT_TOKEN>`.

> Los timestamps `createdAt` y `updatedAt` son generados automáticamente por Prisma.

