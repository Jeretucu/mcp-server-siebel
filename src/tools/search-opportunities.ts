import { SiebelClient } from "../siebel-client.js";
import { escapeSiebelValue } from "../utils/sanitize.js";

export const searchOpportunitiesTool = {
  name: "search_opportunities",
  description:
    "Searches Opportunities in Siebel CRM. Can filter by name, account, sales stage, " +
    "close date range, or any custom searchspec expression.",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Partial or full opportunity name to search (uses LIKE *value*)",
      },
      accountName: {
        type: "string",
        description: "Account name to filter by (uses LIKE *value*)",
      },
      salesStage: {
        type: "string",
        description: "Exact sales stage. E.g.: Prospecting, Closed Won, Closed Lost",
      },
      closeDateFrom: {
        type: "string",
        description: "Filter opportunities with close date >= this date (MM/DD/YYYY)",
      },
      closeDateTo: {
        type: "string",
        description: "Filter opportunities with close date <= this date (MM/DD/YYYY)",
      },
      searchSpec: {
        type: "string",
        description:
          "Custom Siebel search expression (overrides other filters). " +
          "E.g.: [Sales Stage]='Closed Won' AND [Revenue]>'10000'",
      },
      fields: {
        type: "array",
        items: { type: "string" },
        description:
          "Fields to return. Defaults to: Id, Name, Account, Sales Stage, Close Date, Revenue, Probability",
      },
    },
    required: [],
  },
};

export async function searchOpportunities(
  client: SiebelClient,
  args: {
    name?: string;
    accountName?: string;
    salesStage?: string;
    closeDateFrom?: string;
    closeDateTo?: string;
    searchSpec?: string;
    fields?: string[];
  }
): Promise<unknown> {
  let searchSpec = args.searchSpec;

  if (!searchSpec) {
    const conditions: string[] = [];
    if (args.name)          conditions.push(`[Name] LIKE '*${escapeSiebelValue(args.name)}*'`);
    if (args.accountName)   conditions.push(`[Account] LIKE '*${escapeSiebelValue(args.accountName)}*'`);
    if (args.salesStage)    conditions.push(`[Sales Stage]='${escapeSiebelValue(args.salesStage)}'`);
    if (args.closeDateFrom) conditions.push(`[Close Date]>='${escapeSiebelValue(args.closeDateFrom)}'`);
    if (args.closeDateTo)   conditions.push(`[Close Date]<='${escapeSiebelValue(args.closeDateTo)}'`);
    if (conditions.length)  searchSpec = conditions.join(" AND ");
  }

  const defaultFields = ["Id", "Name", "Account", "Sales Stage", "Close Date", "Revenue", "Probability", "Description"];
  const fields = args.fields?.length ? args.fields : defaultFields;

  const params: Record<string, string> = { fields: fields.join(",") };
  if (searchSpec) params.searchspec = searchSpec;

  return client.get("/data/Opportunity/Opportunity", params);
}
