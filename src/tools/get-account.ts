import { SiebelClient } from "../siebel-client.js";

export const getAccountTool = {
  name: "get_account",
  description: "Obtiene una cuenta de Siebel CRM por su ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID de la cuenta (ROW_ID)" },
    },
    required: ["id"],
  },
};

export async function getAccount(client: SiebelClient, args: { id: string }) {
  const data = await client.get(`/data/Account/Account/${args.id}`);
  return data;
}
