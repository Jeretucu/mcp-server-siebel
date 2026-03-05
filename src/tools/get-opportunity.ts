import { SiebelClient } from "../siebel-client.js";

export const getOpportunityTool = {
  name: "get_opportunity",
  description: "Retrieves a Siebel CRM opportunity by ID",
  inputSchema: {
    type: "object",
    properties: {
      id:         { type: "string", description: "Opportunity ID (ROW_ID)" },
      searchspec: { type: "string", description: "Alternative Siebel search expression" },
      fields:     { type: "array", items: { type: "string" }, description: "Fields to return" },
    },
  },
};

export async function getOpportunity(
  client: SiebelClient,
  args: { id?: string; searchspec?: string; fields?: string[] }
) {
  if (args.id) return client.get(`/data/Opportunity/Opportunity/${args.id}`);
  return client.query("Opportunity", "Opportunity", args.searchspec, args.fields);
}
