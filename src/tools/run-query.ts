import { SiebelClient } from "../siebel-client.js";

export const runQueryTool = {
  name: "run_query",
  description: "Runs a query on any Siebel Business Object",
  inputSchema: {
    type: "object",
    properties: {
      business_object:    { type: "string", description: "Business Object (e.g. Quote, Account, Contact)" },
      business_component: { type: "string", description: "Business Component" },
      searchspec:         { type: "string", description: "Siebel search expression (e.g. [Status]='Active')" },
      fields:             { type: "array", items: { type: "string" }, description: "Fields to return" },
    },
    required: ["business_object", "business_component"],
  },
};

export async function runQuery(
  client: SiebelClient,
  args: {
    business_object: string;
    business_component: string;
    searchspec?: string;
    fields?: string[];
  }
) {
  return client.query(
    args.business_object,
    args.business_component,
    args.searchspec,
    args.fields
  );
}
