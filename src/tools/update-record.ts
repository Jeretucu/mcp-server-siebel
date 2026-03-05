import { SiebelClient } from "../siebel-client.js";

export const updateRecordTool = {
  name: "update_record",
  description: "Actualiza cualquier registro en Siebel CRM",
  inputSchema: {
    type: "object",
    properties: {
      business_object:    { type: "string", description: "Business Object (ej: Account, Contact, Opportunity)" },
      business_component: { type: "string", description: "Business Component (generalmente igual al BO)" },
      id:                 { type: "string", description: "ID del registro a actualizar" },
      fields:             { type: "object", description: "Campos y valores a actualizar", additionalProperties: true },
    },
    required: ["business_object", "business_component", "id", "fields"],
  },
};

export async function updateRecord(
  client: SiebelClient,
  args: {
    business_object: string;
    business_component: string;
    id: string;
    fields: Record<string, unknown>;
  }
) {
  return client.put(
    `/data/${args.business_object}/${args.business_component}/${args.id}`,
    args.fields
  );
}
