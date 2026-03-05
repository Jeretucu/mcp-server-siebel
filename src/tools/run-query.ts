import { SiebelClient } from "../siebel-client.js";

export const runQueryTool = {
  name: "run_query",
  description: "Ejecuta una query sobre cualquier Business Object de Siebel",
  inputSchema: {
    type: "object",
    properties: {
      business_object:    { type: "string", description: "Business Object (ej: Quote, Account, Contact)" },
      business_component: { type: "string", description: "Business Component" },
      searchspec:         { type: "string", description: "Expresión de búsqueda Siebel (ej: [Status]='Active')" },
      fields:             { type: "array", items: { type: "string" }, description: "Campos a retornar" },
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
