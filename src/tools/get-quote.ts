import { SiebelClient } from "../siebel-client.js";

export const getQuoteTool = {
  name: "get_quote",
  description:
    "Retrieves a Siebel Quote (Oferta Económica) via REST API. " +
    "Can fetch by ID or search by quote number, name, account or status. " +
    "Also retrieves associated line items (Quote Items) if requested.",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Quote ROW_ID for direct lookup (optional)",
      },
      quoteNumber: {
        type: "string",
        description: "Quote number as shown in Siebel (e.g. 1-2510450209)",
      },
      name: {
        type: "string",
        description: "Partial quote name to search (uses LIKE *value*)",
      },
      accountName: {
        type: "string",
        description: "Account name to filter by",
      },
      status: {
        type: "string",
        description: "Quote status. E.g.: In Progress, Approved, Rejected",
      },
      searchSpec: {
        type: "string",
        description: "Custom Siebel search expression (overrides other filters)",
      },
      includeLineItems: {
        type: "boolean",
        description: "If true, also fetches the Quote Items (line items). Default: false",
        default: false,
      },
      fields: {
        type: "array",
        items: { type: "string" },
        description: "Fields to return. If omitted, returns all default fields.",
      },
    },
    required: [],
  },
};

export async function getQuote(
  client: SiebelClient,
  args: {
    id?: string;
    quoteNumber?: string;
    name?: string;
    accountName?: string;
    status?: string;
    searchSpec?: string;
    includeLineItems?: boolean;
    fields?: string[];
  }
): Promise<unknown> {
  // Direct lookup by ID
  if (args.id) {
    const quote = await client.get(`/data/Quote/Quote/${args.id}`);
    if (args.includeLineItems) {
      const lineItems = await client.get(`/data/Quote/Quote/${args.id}/Quote Item`);
      return { quote, lineItems };
    }
    return quote;
  }

  // Build searchspec
  let searchSpec = args.searchSpec;
  if (!searchSpec) {
    const conditions: string[] = [];
    if (args.quoteNumber) conditions.push(`[Quote Number]='${args.quoteNumber}'`);
    if (args.name)        conditions.push(`[Name] LIKE '*${args.name}*'`);
    if (args.accountName) conditions.push(`[Account] LIKE '*${args.accountName}*'`);
    if (args.status)      conditions.push(`[Status]='${args.status}'`);
    if (conditions.length) searchSpec = conditions.join(" AND ");
  }

  const params: Record<string, string> = {};
  if (searchSpec)    params.searchspec = searchSpec;
  if (args.fields?.length) params.fields = args.fields.join(",");

  return client.get("/data/Quote/Quote", params);
}
