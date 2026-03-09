import { SiebelClient } from "../siebel-client.js";
import { validateUrlSegment } from "../utils/sanitize.js";

export const deleteRecordTool = {
  name: "delete_record",
  description:
    "Deletes a record from any Siebel Business Object/Component by its ID. " +
    "⚠️ This operation is IRREVERSIBLE. Requires confirm=true to execute.",
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
      id: {
        type: "string",
        description: "Record ID (ROW_ID) to delete",
      },
      confirm: {
        type: "boolean",
        description: "Must be explicitly set to true to confirm the irreversible deletion.",
      },
    },
    required: ["businessObject", "businessComponent", "id", "confirm"],
  },
};

export async function deleteRecord(
  client: SiebelClient,
  args: { businessObject: string; businessComponent: string; id: string; confirm: boolean }
): Promise<{ success: boolean; message: string }> {
  if (args.confirm !== true) {
    throw new Error("Deletion cancelled: confirm must be explicitly set to true.");
  }

  validateUrlSegment(args.businessObject, "businessObject");
  validateUrlSegment(args.businessComponent, "businessComponent");

  await client.delete(`/data/${args.businessObject}/${args.businessComponent}/${args.id}`);
  return {
    success: true,
    message: `Record ${args.id} deleted from ${args.businessObject}/${args.businessComponent}`,
  };
}
