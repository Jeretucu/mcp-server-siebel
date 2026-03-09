import { SiebelClient } from "../siebel-client.js";

export const callBusinessServiceTool = {
  name: "call_business_service",
  description:
    "Invokes a Siebel Business Service method via REST API. " +
    "Business Services are reusable server-side components in Siebel that encapsulate business logic. " +
    "Common examples: Workflow Process Manager, EAI Siebel Adapter, FINS Calculate Payment Service, " +
    "Mailer, Document Server. Endpoint: POST /service/{ServiceName}/{MethodName}",
  inputSchema: {
    type: "object",
    properties: {
      serviceName: {
        type: "string",
        description:
          "Siebel Business Service name. E.g.: " +
          "'Workflow Process Manager', 'EAI Siebel Adapter', " +
          "'FINS Calculate Payment Service', 'Mailer'",
      },
      methodName: {
        type: "string",
        description:
          "Method to invoke on the service. E.g.: 'RunProcess', 'Query', 'Execute'",
      },
      inputArgs: {
        type: "object",
        description:
          "Input arguments for the service method as key-value pairs. " +
          "E.g.: { \"ProcessName\": \"My Workflow\", \"ObjectId\": \"1-ABC123\" }",
        additionalProperties: true,
      },
    },
    required: ["serviceName", "methodName"],
  },
};

export async function callBusinessService(
  client: SiebelClient,
  args: {
    serviceName: string;
    methodName: string;
    inputArgs?: Record<string, unknown>;
  }
): Promise<unknown> {
  const encodedService = encodeURIComponent(args.serviceName);
  const encodedMethod  = encodeURIComponent(args.methodName);
  return client.post(`/service/${encodedService}/${encodedMethod}`, args.inputArgs ?? {});
}
