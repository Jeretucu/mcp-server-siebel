import { SiebelClient } from "../siebel-client.js";
import { validateUrlSegment } from "../utils/sanitize.js";

export const addChildRecordTool = {
  name: "add_child_record",
  description:
    "Creates a child record associated to a parent record in Siebel. " +
    "Uses the REST path POST /data/{BO}/{BC}/{parentId}/{childBC}. " +
    "Examples: add a line item to a Quote, add a contact to an Account, " +
    "add a product to an Opportunity.",
  inputSchema: {
    type: "object",
    properties: {
      businessObject: {
        type: "string",
        description: "Parent Business Object. E.g.: Quote, Account, Opportunity",
      },
      businessComponent: {
        type: "string",
        description: "Parent Business Component. E.g.: Quote, Account, Opportunity",
      },
      parentId: {
        type: "string",
        description: "ROW_ID of the parent record",
      },
      childBusinessComponent: {
        type: "string",
        description:
          "Child Business Component name. E.g.: Quote Item, Account Contact, NL Product",
      },
      fields: {
        type: "object",
        description:
          "Key-value pairs of fields for the new child record. " +
          "Field names must match Siebel BC field names exactly.",
        additionalProperties: { type: "string" },
      },
    },
    required: ["businessObject", "businessComponent", "parentId", "childBusinessComponent", "fields"],
  },
};

export async function addChildRecord(
  client: SiebelClient,
  args: {
    businessObject: string;
    businessComponent: string;
    parentId: string;
    childBusinessComponent: string;
    fields: Record<string, string>;
  }
): Promise<unknown> {
  validateUrlSegment(args.businessObject, "businessObject");
  validateUrlSegment(args.businessComponent, "businessComponent");
  validateUrlSegment(args.childBusinessComponent, "childBusinessComponent");

  return client.post(
    `/data/${args.businessObject}/${args.businessComponent}/${args.parentId}/${args.childBusinessComponent}`,
    args.fields
  );
}
