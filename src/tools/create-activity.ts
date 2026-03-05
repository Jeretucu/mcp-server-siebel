import { SiebelClient } from "../siebel-client.js";

export const createActivityTool = {
  name: "create_activity",
  description: "Crea una actividad o tarea en Siebel CRM",
  inputSchema: {
    type: "object",
    properties: {
      description: { type: "string", description: "Descripción de la actividad" },
      type:        { type: "string", description: "Tipo de actividad (ej: Call, Email, Meeting)" },
      status:      { type: "string", description: "Estado (ej: In Progress, Done, Not Started)" },
      due_date:    { type: "string", description: "Fecha límite (MM/DD/YYYY)" },
      account_id:  { type: "string", description: "ID de la cuenta asociada" },
      contact_id:  { type: "string", description: "ID del contacto asociado" },
      comment:     { type: "string", description: "Comentario o descripción adicional" },
    },
    required: ["description"],
  },
};

export async function createActivity(
  client: SiebelClient,
  args: {
    description: string;
    type?: string;
    status?: string;
    due_date?: string;
    account_id?: string;
    contact_id?: string;
    comment?: string;
  }
) {
  const body: Record<string, string> = {
    Description: args.description,
    ...(args.type       && { "Activity Type": args.type }),
    ...(args.status     && { Status: args.status }),
    ...(args.due_date   && { "Due Date": args.due_date }),
    ...(args.account_id && { "Account Id": args.account_id }),
    ...(args.contact_id && { "Contact Id": args.contact_id }),
    ...(args.comment    && { Comment: args.comment }),
  };
  return client.post("/data/Action/Action", body);
}
