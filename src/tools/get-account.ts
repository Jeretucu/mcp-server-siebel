import { SiebelClient } from "../siebel-client.js";

export const getAccountTool = {
  name: "get_account",
  description: "Retrieves a Siebel CRM account by ID",
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
