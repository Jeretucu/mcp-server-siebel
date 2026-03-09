import { SiebelClient } from "../siebel-client.js";

export const runWorkflowTool = {
  name: "run_workflow",
  description:
    "Executes a Siebel Workflow Process via REST API. " +
    "Endpoint: POST /siebel/v1.0/workflow/{WorkflowName}. " +
    "The workflow must be active and deployed in Siebel. " +
    "Input arguments depend on the specific workflow definition.",
  inputSchema: {
    type: "object",
    properties: {
      workflowName: {
        type: "string",
        description: "Exact name of the Siebel Workflow Process as deployed. E.g.: 'WF_Account_Query_By_Name'",
      },
      inputArgs: {
        type: "object",
        description:
          "Input arguments for the workflow as key-value pairs. " +
          "Keys must match the workflow input property names exactly. " +
          "E.g.: { \"ObjectId\": \"1-ABC123\", \"Status\": \"Active\" }",
        additionalProperties: true,
      },
    },
    required: ["workflowName"],
  },
};

export async function runWorkflow(
  client: SiebelClient,
  args: {
    workflowName: string;
    inputArgs?: Record<string, unknown>;
  }
): Promise<unknown> {
  const encodedName = encodeURIComponent(args.workflowName);
  return client.post(`/workflow/${encodedName}`, args.inputArgs ?? {});
}
