import { SiebelClient } from "../siebel-client.js";

export const getListOfValuesTool = {
  name: "get_list_of_values",
  description:
    "Retrieves List of Values (LOV) entries from Siebel CRM. " +
    "LOVs are dropdown/picklist values used across the application. " +
    "Use this to discover valid values for fields like Sales Stage, Status, Priority, " +
    "Activity Type, etc. Filter by LOV Type to get values for a specific field.",
  inputSchema: {
    type: "object",
    properties: {
      lovType: {
        type: "string",
        description:
          "LOV Type name to filter by. E.g.: " +
          "'SALES_STAGE_TYPE' for Sales Stage values, " +
          "'ACTION_TYPE' for Activity types, " +
          "'TODO_TYPE' for To Do types, " +
          "'OPPTY_STATUS_CD' for Opportunity status, " +
          "'QUOTE_STATUS' for Quote status",
      },
      searchSpec: {
        type: "string",
        description: "Custom search expression (overrides lovType filter)",
      },
      activeOnly: {
        type: "boolean",
        description: "If true, returns only active LOV entries. Default: true",
        default: true,
      },
    },
    required: ["lovType"],
  },
};

export async function getListOfValues(
  client: SiebelClient,
  args: {
    lovType?: string;
    searchSpec?: string;
    activeOnly?: boolean;
  }
): Promise<unknown> {
  let searchSpec = args.searchSpec;

  if (!searchSpec) {
    const conditions: string[] = [];
    if (args.lovType) conditions.push(`[Type]='${args.lovType}'`);
    if (args.activeOnly !== false) conditions.push("[Active]='Y'");
    if (conditions.length) searchSpec = conditions.join(" AND ");
  }

  const params: Record<string, string> = {
    fields: "Type,Name,Value,Order,Language Name,Active",
  };
  if (searchSpec) params.searchspec = searchSpec;

  return client.get("/data/List Of Values/List Of Values", params);
}
