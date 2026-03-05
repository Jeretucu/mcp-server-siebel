import { SiebelClient } from "../siebel-client.js";

export const getOpportunityTool = {
  name: "get_opportunity",
  description: "Obtiene una oportunidad de Siebel CRM por su ID",
  inputSchema: {
    type: "object",
    properties: {
      id:         { type: "string", description: "ID de la oportunidad (ROW_ID)" },
      searchspec: { type: "string", description: "Búsqueda alternativa por expresión Siebel" },
      fields:     { type: "array", items: { type: "string" }, description: "Campos a retornar" },
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
