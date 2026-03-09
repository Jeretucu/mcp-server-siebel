import { SiebelClient } from "../siebel-client.js";
import { validateUrlSegment } from "../utils/sanitize.js";

export const createRecordTool = {
  name: "create_record",
  description:
    "Creates a new record in any Siebel Business Object/Component via REST. " +
    "Generic tool that works with any BC. For specific entities (Contact, Opportunity) " +
    "prefer the dedicated tools. Fields must match the Siebel BC field names exactly.",
  inputSchema: {
    type: "object",
    properties: {
      businessObject: {
        type: "string",
        description: "Business Object name. E.g.: Account, Contact, Opportunity, Action, Quote",
      },
      businessComponent: {
        type: "string",
        description: "Business Component name. Usually same as Business Object.",
      },
      fields: {
        type: "object",
        description:
          "Key-value pairs of fields to set on the new record. " +
          "Field names must match Siebel BC field names exactly. " +
          "E.g.: { \"Name\": \"Test\", \"Status\": \"Active\" }",
        additionalProperties: { type: "string" },
      },
    },
    required: ["businessObject", "businessComponent", "fields"],
  },
};

export async function createRecord(
  client: SiebelClient,
  args: { businessObject: string; businessComponent: string; fields: Record<string, string> }
): Promise<unknown> {
  validateUrlSegment(args.businessObject, "businessObject");
  validateUrlSegment(args.businessComponent, "businessComponent");

  return client.post(`/data/${args.businessObject}/${args.businessComponent}`, args.fields);
}
