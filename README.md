# mcp-server-siebel

[![npm version](https://badge.fury.io/js/%40jeretucu%2Fmcp-server-siebel.svg)](https://www.npmjs.com/package/@jeretucu/mcp-server-siebel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue.svg)](https://modelcontextprotocol.io)

MCP (Model Context Protocol) server for **Oracle Siebel CRM** integration via its REST API. Allows Claude and other AI models to interact directly with Siebel.

---

## Prerequisites

- Node.js >= 18
- Access to a Siebel CRM instance with the REST API enabled
- Siebel username and password

---

## Installation

```bash
npm install -g @jeretucu/mcp-server-siebel
```

Or use directly with npx:

```bash
npx @jeretucu/mcp-server-siebel
```

---

## Environment variables

Create a `.env` file based on `.env.example`:

```env
SIEBEL_URL=https://your-siebel-server:9001
SIEBEL_USERNAME=your_username
SIEBEL_PASSWORD=your_password
SIEBEL_LANG=ENU
```

| Variable | Description | Required |
|---|---|---|
| `SIEBEL_URL` | Siebel server base URL | Yes |
| `SIEBEL_USERNAME` | Siebel username | Yes |
| `SIEBEL_PASSWORD` | Siebel password | Yes |
| `SIEBEL_LANG` | Language (default: ENU) | No |

---

## Connect to Claude Desktop

Add this to your `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "siebel": {
      "command": "npx",
      "args": ["-y", "@jeretucu/mcp-server-siebel"],
      "env": {
        "SIEBEL_URL": "https://your-siebel-server:9001",
        "SIEBEL_USERNAME": "your_username",
        "SIEBEL_PASSWORD": "your_password",
        "SIEBEL_LANG": "ENU"
      }
    }
  }
}
```

---

## Connect to Claude Code

```bash
claude mcp add siebel npx @jeretucu/mcp-server-siebel \
  -e SIEBEL_URL=https://your-server:9001 \
  -e SIEBEL_USERNAME=username \
  -e SIEBEL_PASSWORD=password
```

---

## Available tools

### `get_account`
Retrieves an account by ID.
```
Get the account with ID 1-ABC123
```

### `search_accounts`
Searches accounts by name or other criteria.
```
Search for accounts with name containing "Acme Corp"
```

### `get_contact`
Retrieves a contact by ID.
```
Get contact 1-XYZ456
```

### `search_contacts`
Searches contacts by first name, last name or email.
```
Search for contacts with last name "González"
```

### `get_opportunity`
Retrieves an opportunity by ID or search criteria.
```
Search for opportunities with status "Open"
```

### `create_activity`
Creates an activity or task in Siebel.
```
Create a "Call" activity for account 1-ABC123
```

### `update_record`
Updates any Siebel record.
```
Update the Status field to "Active" on account 1-ABC123
```

### `run_query`
Runs a query on any Business Object.
```
Query the Quote Business Object with searchspec [Status]='Open'
```

---

## Local development

```bash
git clone https://github.com/jeretucu/mcp-server-siebel
cd mcp-server-siebel
npm install
cp .env.example .env
# edit .env with your credentials
npm run dev
```

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/new-tool`
3. Commit: `git commit -m "feat: add new tool"`
4. Push: `git push origin feature/new-tool`
5. Open a Pull Request

---

## License

MIT © [jeretucu](https://github.com/jeretucu)
