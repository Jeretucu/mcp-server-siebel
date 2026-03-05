import { SiebelClient } from "../siebel-client.js";

export const searchAccountsTool = {
  name: "search_accounts",
  description: "Searches accounts in Siebel CRM by name or other criteria",
  inputSchema: {
    type: "object",
    properties: {
      name:       { type: "string", description: "Account name (partial match)" },
      searchspec: { type: "string", description: "Custom Siebel search expression (e.g. [Status]='Active')" },
      fields:     { type: "array", items: { type: "string" }, description: "Fields to return" },
    },
  },
};

export async function searchAccounts(
  client: SiebelClient,
  args: { name?: string; searchspec?: string; fields?: string[] }
) {
  const spec = args.searchspec ?? (args.name ? `[Name] LIKE '*${args.name}*'` : undefined);
  return client.query("Account", "Account", spec, args.fields);
}
