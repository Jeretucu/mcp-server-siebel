import { SiebelClient } from "../siebel-client.js";

export const getContactTool = {
  name: "get_contact",
  description: "Retrieves a Siebel CRM contact by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Contact ID (ROW_ID)" },
    },
    required: ["id"],
  },
};

export async function getContact(client: SiebelClient, args: { id: string }) {
  return client.get(`/data/Contact/Contact/${args.id}`);
}
