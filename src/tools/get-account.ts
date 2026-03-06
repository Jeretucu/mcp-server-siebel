import { SiebelClient } from "../siebel-client.js";

export const getAccountTool = {
  name: "get_account",
  description: "Retrieves a Siebel CRM account by its internal ROW_ID. To search by RUT or Razón Social, use search_accounts instead.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Account ID (ROW_ID)" },
    },
    required: ["id"],
  },
};

export async function getAccount(client: SiebelClient, args: { id: string }) {
  const data = await client.get(`/data/Account/Account/${args.id}`);
  return data;
}
