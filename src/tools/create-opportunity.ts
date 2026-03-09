import { SiebelClient } from "../siebel-client.js";

export const createOpportunityTool = {
  name: "create_opportunity",
  description:
    "Creates a new sales Opportunity in Siebel CRM via REST API. " +
    "An Opportunity represents a potential sale linked to an Account.",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Opportunity name/description",
      },
      accountId: {
        type: "string",
        description: "ROW_ID of the associated Account",
      },
      accountName: {
        type: "string",
        description: "Account name (alternative to accountId, used if accountId not provided)",
      },
      salesStage: {
        type: "string",
        description:
          "Sales stage. E.g.: Prospecting, Qualification, Value Proposition, " +
          "Id. Decision Makers, Perception Analysis, Proposal/Price Quote, " +
          "Negotiation/Review, Closed Won, Closed Lost",
        default: "Prospecting",
      },
      closeDate: {
        type: "string",
        description: "Expected close date in MM/DD/YYYY format. E.g.: 12/31/2025",
      },
      revenue: {
        type: "string",
        description: "Expected revenue amount (numeric string). E.g.: 50000",
      },
      probability: {
        type: "string",
        description: "Win probability percentage (0-100). E.g.: 50",
      },
      description: {
        type: "string",
        description: "Opportunity description or notes (optional)",
      },
      primaryContactId: {
        type: "string",
        description: "ROW_ID of the primary contact (optional)",
      },
      additionalFields: {
        type: "object",
        description: "Any additional Siebel Opportunity BC fields as key-value pairs (optional)",
        additionalProperties: { type: "string" },
      },
    },
    required: ["name", "closeDate"],
  },
};

export async function createOpportunity(
  client: SiebelClient,
  args: {
    name: string;
    accountId?: string;
    accountName?: string;
    salesStage?: string;
    closeDate: string;
    revenue?: string;
    probability?: string;
    description?: string;
    primaryContactId?: string;
    additionalFields?: Record<string, string>;
  }
): Promise<unknown> {
  const body: Record<string, string> = {
    "Name":       args.name,
    "Close Date": args.closeDate,
  };

  if (args.accountId)        body["Account Id"]   = args.accountId;
  if (args.accountName)      body["Account"]      = args.accountName;
  if (args.salesStage)       body["Sales Stage"]  = args.salesStage;
  if (args.revenue)          body["Revenue"]      = args.revenue;
  if (args.probability)      body["Probability"]  = args.probability;
  if (args.description)      body["Description"]  = args.description;
  if (args.primaryContactId) body["Primary Contact Id"] = args.primaryContactId;

  if (args.additionalFields) {
    Object.assign(body, args.additionalFields);
  }

  return client.post("/data/Opportunity/Opportunity", body);
}
