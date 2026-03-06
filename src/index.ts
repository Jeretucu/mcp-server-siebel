#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as dotenv from "dotenv";
import { createClient } from "./siebel-client.js";
import { getAccountTool, getAccount } from "./tools/get-account.js";
import { searchAccountsTool, searchAccounts } from "./tools/search-accounts.js";
import { getContactTool, getContact } from "./tools/get-contact.js";
import { searchContactsTool, searchContacts } from "./tools/search-contacts.js";
import { getOpportunityTool, getOpportunity } from "./tools/get-opportunity.js";
import { createActivityTool, createActivity } from "./tools/create-activity.js";
import { updateRecordTool, updateRecord } from "./tools/update-record.js";
import { runQueryTool, runQuery } from "./tools/run-query.js";
import { createOfertaTool, createOferta } from "./tools/create-oferta.js";

dotenv.config();

const server = new Server(
  { name: "mcp-server-siebel", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const tools = [
  getAccountTool,
  searchAccountsTool,
  getContactTool,
  searchContactsTool,
  getOpportunityTool,
  createActivityTool,
  updateRecordTool,
  runQueryTool,
  createOfertaTool,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const client = createClient();

  try {
    let result: unknown;

    switch (name) {
      case "get_account":       result = await getAccount(client, args as any); break;
      case "search_accounts":   result = await searchAccounts(client, args as any); break;
      case "get_contact":       result = await getContact(client, args as any); break;
      case "search_contacts":   result = await searchContacts(client, args as any); break;
      case "get_opportunity":   result = await getOpportunity(client, args as any); break;
      case "create_activity":   result = await createActivity(client, args as any); break;
      case "update_record":     result = await updateRecord(client, args as any); break;
      case "run_query":         result = await runQuery(client, args as any); break;
      case "create_oferta":    result = await createOferta(args as any); break;
      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server Siebel running...");
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
