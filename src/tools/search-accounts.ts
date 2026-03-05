import { SiebelClient } from "../siebel-client.js";

export const searchAccountsTool = {
  name: "search_accounts",
  description: "Busca cuentas en Siebel CRM por nombre u otro criterio",
  inputSchema: {
    type: "object",
    properties: {
      name:       { type: "string", description: "Nombre de la cuenta (búsqueda parcial)" },
      searchspec: { type: "string", description: "Expresión de búsqueda Siebel custom (ej: [Status]='Active')" },
      fields:     { type: "array", items: { type: "string" }, description: "Campos a retornar" },
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
