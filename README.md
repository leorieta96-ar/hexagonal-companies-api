# Hexagonal Companies API (NestJS)

Este proyecto implementa una API REST con arquitectura Hexagonal para manejar empresas y sus transferencias. Incluye:

- Registro de nuevas empresas
- Registro de transferencias
- Consulta de empresas adheridas en el último mes
- Consulta de empresas que realizaron transferencias en el último mes

## Arquitectura

Usamos el patrón **Hexagonal (Ports & Adapters)**, separando claramente:

- Dominio (Entidades, puertos)
- Aplicación (Casos de uso)
- Infraestructura (controladores, repositorios)

## Correr localmente

```bash
# 1. Clonar el repo
git clone https://github.com/leorieta96-ar/hexagonal-companies-api.git

cd hexagonal-companies-api

# 2. Instalar dependencias
npm install

# 3. Ejecutar la app
npm run start

# 4. Ejecutar tests
npm run test
```

## Lambda Function 
El codigo de la funcion se encuentra en handles.ts, junto con el input y output esperado.
La integraria al sistema, mediante una invocacion en el caso de uso register-company.use-case con aws-sdk