import { SiebelClient } from "../siebel-client.js";

export const searchAccountsTool = {
  name: "search_accounts",
  description: "Searches accounts in Siebel CRM. In Siebel TBK: [Name] = RUT (numeric), [Alias] = Razón Social (text).",
  inputSchema: {
    type: "object",
    properties: {
      name:       { type: "string", description: "RUT (numeric, stored in [Name] field) or Razón Social (text, stored in [Alias] field). If numeric, searches by [Name]='value'; if text, searches by [Alias] LIKE '*value*'" },
      searchspec: { type: "string", description: "Custom Siebel search expression (e.g. [Status]='Active')" },
      fields:     { type: "array", items: { type: "string" }, description: "Fields to return" },
    },
  },
};

export async function searchAccounts(
  client: SiebelClient,
  args: { name?: string; searchspec?: string; fields?: string[] }
) {
  let spec = args.searchspec;
  if (!spec && args.name) {
    const isRut = /^\d+$/.test(args.name.trim());
    spec = isRut
      ? `[Name]='${args.name.trim()}'`
      : `[Alias] LIKE '*${args.name.toUpperCase()}*'`;
  }
  return client.query("Account", "Account", spec, args.fields);
}
