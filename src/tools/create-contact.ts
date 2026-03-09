import { SiebelClient } from "../siebel-client.js";

export const createContactTool = {
  name: "create_contact",
  description:
    "Creates a new contact in Siebel CRM via REST API. " +
    "A contact is a person associated to an account/company. " +
    "Use search_contacts first to verify the contact doesn't already exist.",
  inputSchema: {
    type: "object",
    properties: {
      firstName: {
        type: "string",
        description: "Contact first name",
      },
      lastName: {
        type: "string",
        description: "Contact last name (apellido paterno)",
      },
      middleName: {
        type: "string",
        description: "Contact middle name or second last name (optional)",
      },
      emailAddress: {
        type: "string",
        description: "Primary email address",
      },
      cellularPhone: {
        type: "string",
        description: "Mobile phone number (optional)",
      },
      workPhone: {
        type: "string",
        description: "Work phone number (optional)",
      },
      accountId: {
        type: "string",
        description: "ROW_ID of the associated Account (optional)",
      },
      jobTitle: {
        type: "string",
        description: "Job title or position (optional)",
      },
      additionalFields: {
        type: "object",
        description: "Any additional Siebel Contact BC fields as key-value pairs (optional)",
        additionalProperties: { type: "string" },
      },
    },
    required: ["firstName", "lastName"],
  },
};

export async function createContact(
  client: SiebelClient,
  args: {
    firstName: string;
    lastName: string;
    middleName?: string;
    emailAddress?: string;
    cellularPhone?: string;
    workPhone?: string;
    accountId?: string;
    jobTitle?: string;
    additionalFields?: Record<string, string>;
  }
): Promise<unknown> {
  const body: Record<string, string> = {
    "First Name": args.firstName,
    "Last Name":  args.lastName,
  };

  if (args.middleName)     body["Middle Name"]      = args.middleName;
  if (args.emailAddress)   body["Email Address"]    = args.emailAddress;
  if (args.cellularPhone)  body["Cellular Phone #"] = args.cellularPhone;
  if (args.workPhone)      body["Work Phone #"]     = args.workPhone;
  if (args.accountId)      body["Account Id"]       = args.accountId;
  if (args.jobTitle)       body["Job Title"]        = args.jobTitle;

  if (args.additionalFields) {
    Object.assign(body, args.additionalFields);
  }

  return client.post("/data/Contact/Contact", body);
}
