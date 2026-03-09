import { SiebelClient } from "../siebel-client.js";
import { validateUrlSegment } from "../utils/sanitize.js";

export const getChildRecordsTool = {
  name: "get_child_records",
  description:
    "Retrieves child records associated to a parent record in Siebel. " +
    "Uses the REST path /data/{BO}/{BC}/{parentId}/{childBC}. " +
    "Examples: line items of a Quote, contacts of an Account, products of an Opportunity.",
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
          "Child Business Component name. E.g.: Quote Item, Account Contact, " +
          "Opportunity Contact, NL Product",
      },
      searchSpec: {
        type: "string",
        description: "Optional Siebel search expression to filter child records. E.g.: [Status]='Active'",
      },
      fields: {
        type: "array",
        items: { type: "string" },
        description: "Fields to return. If omitted, returns all fields.",
      },
    },
    required: ["businessObject", "businessComponent", "parentId", "childBusinessComponent"],
  },
};

export async function getChildRecords(
  client: SiebelClient,
  args: {
    businessObject: string;
    businessComponent: string;
    parentId: string;
    childBusinessComponent: string;
    searchSpec?: string;
    fields?: string[];
  }
): Promise<unknown> {
  validateUrlSegment(args.businessObject, "businessObject");
  validateUrlSegment(args.businessComponent, "businessComponent");
  validateUrlSegment(args.childBusinessComponent, "childBusinessComponent");

  const params: Record<string, string> = {};
  if (args.searchSpec) params.searchspec = args.searchSpec;
  if (args.fields?.length) params.fields = args.fields.join(",");

  return client.get(
    `/data/${args.businessObject}/${args.businessComponent}/${args.parentId}/${args.childBusinessComponent}`,
    params
  );
}
