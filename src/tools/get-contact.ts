import { SiebelClient } from "../siebel-client.js";

export const getContactTool = {
  name: "get_contact",
  description: "Obtiene un contacto de Siebel CRM por su ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID del contacto (ROW_ID)" },
    },
    required: ["id"],
  },
};

export async function getContact(client: SiebelClient, args: { id: string }) {
  return client.get(`/data/Contact/Contact/${args.id}`);
}
