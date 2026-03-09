#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as dotenv from "dotenv";
import { createClient } from "./siebel-client.js";

// Existing tools
import { getAccountTool, getAccount } from "./tools/get-account.js";
import { searchAccountsTool, searchAccounts } from "./tools/search-accounts.js";
import { getContactTool, getContact } from "./tools/get-contact.js";
import { searchContactsTool, searchContacts } from "./tools/search-contacts.js";
import { getOpportunityTool, getOpportunity } from "./tools/get-opportunity.js";
import { createActivityTool, createActivity } from "./tools/create-activity.js";
import { updateRecordTool, updateRecord } from "./tools/update-record.js";
import { runQueryTool, runQuery } from "./tools/run-query.js";
import { templateQATool, templateQA } from "./tools/template-qa.js";

// New tools
import { deleteRecordTool, deleteRecord } from "./tools/delete-record.js";
import { createRecordTool, createRecord } from "./tools/create-record.js";
import { getChildRecordsTool, getChildRecords } from "./tools/get-child-records.js";
import { addChildRecordTool, addChildRecord } from "./tools/add-child-record.js";
import { createContactTool, createContact } from "./tools/create-contact.js";
import { createOpportunityTool, createOpportunity } from "./tools/create-opportunity.js";
import { searchOpportunitiesTool, searchOpportunities } from "./tools/search-opportunities.js";
import { getQuoteTool, getQuote } from "./tools/get-quote.js";
import { callBusinessServiceTool, callBusinessService } from "./tools/call-business-service.js";
import { getListOfValuesTool, getListOfValues } from "./tools/get-list-of-values.js";
import { runWorkflowTool, runWorkflow } from "./tools/run-workflow.js";
import {
  listAttachmentsTool, listAttachments,
  getAttachmentTool, getAttachment,
  uploadAttachmentTool, uploadAttachment,
  deleteAttachmentTool, deleteAttachment,
} from "./tools/attachment.js";

dotenv.config();

const server = new Server(
  { name: "mcp-server-siebel", version: "1.2.0" },
  { capabilities: { tools: {} } }
);

const tools = [
  // Account
  getAccountTool,
  searchAccountsTool,
  // Contact
  getContactTool,
  searchContactsTool,
  createContactTool,
  // Opportunity
  getOpportunityTool,
  searchOpportunitiesTool,
  createOpportunityTool,
  // Quote
  getQuoteTool,
  // Activity
  createActivityTool,
  // Generic CRUD
  createRecordTool,
  updateRecordTool,
  deleteRecordTool,
  runQueryTool,
  // Child records
  getChildRecordsTool,
  addChildRecordTool,
  // Attachments
  listAttachmentsTool,
  getAttachmentTool,
  uploadAttachmentTool,
  deleteAttachmentTool,
  // Advanced
  callBusinessServiceTool,
  runWorkflowTool,
  getListOfValuesTool,
  // PDF
  templateQATool,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const client = createClient();

  try {
    let result: unknown;

    switch (name) {
      // Account
      case "get_account":           result = await getAccount(client, args as any); break;
      case "search_accounts":       result = await searchAccounts(client, args as any); break;
      // Contact
      case "get_contact":           result = await getContact(client, args as any); break;
      case "search_contacts":       result = await searchContacts(client, args as any); break;
      case "create_contact":        result = await createContact(client, args as any); break;
      // Opportunity
      case "get_opportunity":       result = await getOpportunity(client, args as any); break;
      case "search_opportunities":  result = await searchOpportunities(client, args as any); break;
      case "create_opportunity":    result = await createOpportunity(client, args as any); break;
      // Quote
      case "get_quote":             result = await getQuote(client, args as any); break;
      // Activity
      case "create_activity":       result = await createActivity(client, args as any); break;
      // Generic CRUD
      case "create_record":         result = await createRecord(client, args as any); break;
      case "update_record":         result = await updateRecord(client, args as any); break;
      case "delete_record":         result = await deleteRecord(client, args as any); break;
      case "run_query":             result = await runQuery(client, args as any); break;
      // Child records
      case "get_child_records":     result = await getChildRecords(client, args as any); break;
      case "add_child_record":      result = await addChildRecord(client, args as any); break;
      // Attachments
      case "list_attachments":      result = await listAttachments(client, args as any); break;
      case "get_attachment":        result = await getAttachment(client, args as any); break;
      case "upload_attachment":     result = await uploadAttachment(client, args as any); break;
      case "delete_attachment":     result = await deleteAttachment(client, args as any); break;
      // Advanced
      case "call_business_service": result = await callBusinessService(client, args as any); break;
      case "run_workflow":          result = await runWorkflow(client, args as any); break;
      case "get_list_of_values":    result = await getListOfValues(client, args as any); break;
      // PDF
      case "template_qa":           result = await templateQA(args as any); break;
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
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
