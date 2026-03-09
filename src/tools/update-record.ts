import { SiebelClient } from "../siebel-client.js";
import { validateUrlSegment } from "../utils/sanitize.js";

export const updateRecordTool = {
  name: "update_record",
  description: "Updates any record in Siebel CRM",
  inputSchema: {
    type: "object",
    properties: {
      business_object:    { type: "string", description: "Business Object (e.g. Account, Contact, Opportunity)" },
      business_component: { type: "string", description: "Business Component (usually same as BO)" },
      id:                 { type: "string", description: "Record ID to update" },
      fields:             { type: "object", description: "Fields and values to update", additionalProperties: true },
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
  validateUrlSegment(args.business_object, "business_object");
  validateUrlSegment(args.business_component, "business_component");

  return client.put(
    `/data/${args.business_object}/${args.business_component}/${args.id}`,
    args.fields
  );
}
