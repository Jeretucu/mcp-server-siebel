# mcp-server-siebel

[![npm version](https://badge.fury.io/js/%40jeretucu%2Fmcp-server-siebel.svg)](https://www.npmjs.com/package/@jeretucu/mcp-server-siebel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

Servidor MCP (Model Context Protocol) para integración con **Oracle Siebel CRM** vía su API REST. Permite que Claude y otros modelos de IA interactúen directamente con Siebel.

---

## Requisitos previos

- Node.js >= 18
- Acceso a una instancia de Siebel CRM con la API REST habilitada
- Usuario y contraseña de Siebel

---

## Instalación

```bash
npm install -g @jeretucu/mcp-server-siebel
```

O usar directamente con npx:

```bash
npx @jeretucu/mcp-server-siebel
```

---

## Configuración de variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
SIEBEL_URL=https://tu-servidor-siebel:9001
SIEBEL_USERNAME=tu_usuario
SIEBEL_PASSWORD=tu_contrasena
SIEBEL_LANG=ENU
```

| Variable | Descripción | Requerida |
|---|---|---|
| `SIEBEL_URL` | URL base del servidor Siebel | Sí |
| `SIEBEL_USERNAME` | Usuario de Siebel | Sí |
| `SIEBEL_PASSWORD` | Contraseña de Siebel | Sí |
| `SIEBEL_LANG` | Idioma (default: ENU) | No |

---

## Conectar a Claude Desktop

Agrega esto a tu archivo `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "siebel": {
      "command": "npx",
      "args": ["-y", "@jeretucu/mcp-server-siebel"],
      "env": {
        "SIEBEL_URL": "https://tu-servidor-siebel:9001",
        "SIEBEL_USERNAME": "tu_usuario",
        "SIEBEL_PASSWORD": "tu_contrasena",
        "SIEBEL_LANG": "ENU"
      }
    }
  }
}
```

---

## Conectar a Claude Code

```bash
claude mcp add siebel npx @jeretucu/mcp-server-siebel \
  -e SIEBEL_URL=https://tu-servidor:9001 \
  -e SIEBEL_USERNAME=usuario \
  -e SIEBEL_PASSWORD=contrasena
```

---

## Tools disponibles

### `get_account`
Obtiene una cuenta por ID.
```
Obtén la cuenta con ID 1-ABC123
```

### `search_accounts`
Busca cuentas por nombre u otro criterio.
```
Busca cuentas con nombre que contenga "Transbank"
```

### `get_contact`
Obtiene un contacto por ID.
```
Obtén el contacto 1-XYZ456
```

### `search_contacts`
Busca contactos por nombre, apellido o email.
```
Busca contactos con apellido "González"
```

### `get_opportunity`
Obtiene una oportunidad por ID o criterio de búsqueda.
```
Busca oportunidades con estado "Open"
```

### `create_activity`
Crea una actividad o tarea en Siebel.
```
Crea una actividad de tipo "Call" para la cuenta 1-ABC123
```

### `update_record`
Actualiza cualquier registro de Siebel.
```
Actualiza el campo Status a "Active" en la cuenta 1-ABC123
```

### `run_query`
Ejecuta una query sobre cualquier Business Object.
```
Consulta el Business Object Quote con searchspec [Status]='Open'
```

---

## Desarrollo local

```bash
git clone https://github.com/jeretucu/mcp-server-siebel
cd mcp-server-siebel
npm install
cp .env.example .env
# editar .env con tus credenciales
npm run dev
```

---

## Contribución

1. Fork del repositorio
2. Crea una rama: `git checkout -b feature/nueva-tool`
3. Commit: `git commit -m "feat: agrega nueva tool"`
4. Push: `git push origin feature/nueva-tool`
5. Abre un Pull Request

---

## Licencia

MIT © [jeretucu](https://github.com/jeretucu)
