import { SiebelClient } from "../siebel-client.js";

export const searchContactsTool = {
  name: "search_contacts",
  description: "Busca contactos en Siebel CRM",
  inputSchema: {
    type: "object",
    properties: {
      first_name: { type: "string", description: "Nombre del contacto" },
      last_name:  { type: "string", description: "Apellido del contacto" },
      email:      { type: "string", description: "Email del contacto" },
      searchspec: { type: "string", description: "Expresión de búsqueda Siebel custom" },
      fields:     { type: "array", items: { type: "string" }, description: "Campos a retornar" },
    },
  },
};

export async function searchContacts(
  client: SiebelClient,
  args: { first_name?: string; last_name?: string; email?: string; searchspec?: string; fields?: string[] }
) {
  let spec = args.searchspec;
  if (!spec) {
    const parts: string[] = [];
    if (args.first_name) parts.push(`[First Name] LIKE '*${args.first_name}*'`);
    if (args.last_name)  parts.push(`[Last Name] LIKE '*${args.last_name}*'`);
    if (args.email)      parts.push(`[Email Address] = '${args.email}'`);
    if (parts.length)    spec = parts.join(" AND ");
  }
  return client.query("Contact", "Contact", spec, args.fields);
}
