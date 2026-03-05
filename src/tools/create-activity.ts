import { SiebelClient } from "../siebel-client.js";

export const createActivityTool = {
  name: "create_activity",
  description: "Creates an activity or task in Siebel CRM",
  inputSchema: {
    type: "object",
    properties: {
      description: { type: "string", description: "Activity description" },
      type:        { type: "string", description: "Activity type (e.g. Call, Email, Meeting)" },
      status:      { type: "string", description: "Status (e.g. In Progress, Done, Not Started)" },
      due_date:    { type: "string", description: "Due date (MM/DD/YYYY)" },
      account_id:  { type: "string", description: "Associated account ID" },
      contact_id:  { type: "string", description: "Associated contact ID" },
      comment:     { type: "string", description: "Additional comment" },
    },
    required: ["description"],
  },
};

export async function createActivity(
  client: SiebelClient,
  args: {
    description: string;
    type?: string;
    status?: string;
    due_date?: string;
    account_id?: string;
    contact_id?: string;
    comment?: string;
  }
) {
  const body: Record<string, string> = {
    Description: args.description,
    ...(args.type       && { "Activity Type": args.type }),
    ...(args.status     && { Status: args.status }),
    ...(args.due_date   && { "Due Date": args.due_date }),
    ...(args.account_id && { "Account Id": args.account_id }),
    ...(args.contact_id && { "Contact Id": args.contact_id }),
    ...(args.comment    && { Comment: args.comment }),
  };
  return client.post("/data/Action/Action", body);
}
