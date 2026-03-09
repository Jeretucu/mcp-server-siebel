import { SiebelClient } from "../siebel-client.js";
import { sanitizeFileName, validateOutputDir, validateUploadPath, validateUrlSegment } from "../utils/sanitize.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// ─── List Attachments ──────────────────────────────────────────────────────────

export const listAttachmentsTool = {
  name: "list_attachments",
  description:
    "Lists all attachments associated to a Siebel record. " +
    "Uses the child BC path: GET /data/{BO}/{BC}/{parentId}/{AttachmentBC}. " +
    "Common attachment BCs: 'Account Attachment', 'Opportunity Attachment', " +
    "'Contact Attachment', 'Quote Attachment', 'Action Attachment'.",
  inputSchema: {
    type: "object",
    properties: {
      businessObject: {
        type: "string",
        description: "Parent Business Object. E.g.: Account, Opportunity, Contact, Quote",
      },
      businessComponent: {
        type: "string",
        description: "Parent Business Component. E.g.: Account, Opportunity, Contact, Quote",
      },
      parentId: {
        type: "string",
        description: "ROW_ID of the parent record",
      },
      attachmentBC: {
        type: "string",
        description:
          "Attachment child BC name. E.g.: 'Account Attachment', 'Opportunity Attachment', " +
          "'Contact Attachment', 'Quote Attachment', 'Action Attachment'",
      },
    },
    required: ["businessObject", "businessComponent", "parentId", "attachmentBC"],
  },
};

export async function listAttachments(
  client: SiebelClient,
  args: {
    businessObject: string;
    businessComponent: string;
    parentId: string;
    attachmentBC: string;
  }
): Promise<unknown> {
  validateUrlSegment(args.businessObject, "businessObject");
  validateUrlSegment(args.businessComponent, "businessComponent");
  validateUrlSegment(args.attachmentBC, "attachmentBC");

  return client.get(
    `/data/${args.businessObject}/${args.businessComponent}/${args.parentId}/${args.attachmentBC}`,
    { fields: "Id,Name,File Name,File Ext,File Size,Created,Updated" }
  );
}

// ─── Get / Download Attachment ─────────────────────────────────────────────────

export const getAttachmentTool = {
  name: "get_attachment",
  description:
    "Downloads an attachment from a Siebel record. " +
    "Uses AttachmentDocIO with ?inlineattachment=true to get the file content as Base64. " +
    "Can save the file to disk if output_dir is provided (must be within user home directory).",
  inputSchema: {
    type: "object",
    properties: {
      attachmentBC: {
        type: "string",
        description:
          "Attachment Business Component name. E.g.: 'Account Attachment', 'Opportunity Attachment'",
      },
      attachmentId: {
        type: "string",
        description: "ROW_ID of the attachment record",
      },
      output_dir: {
        type: "string",
        description: "Directory to save the file (optional, must be within user home). If not provided, returns Base64 only.",
      },
    },
    required: ["attachmentBC", "attachmentId"],
  },
};

export async function getAttachment(
  client: SiebelClient,
  args: {
    attachmentBC: string;
    attachmentId: string;
    output_dir?: string;
  }
): Promise<{ success: boolean; file_name?: string; file_path?: string; base64?: string; message: string }> {
  validateUrlSegment(args.attachmentBC, "attachmentBC");

  const encodedBC = encodeURIComponent(args.attachmentBC);
  const data = await client.get(
    `/data/AttachmentDocIO/${encodedBC}/${args.attachmentId}`,
    { inlineattachment: "true" }
  );

  // Sanitize fileName coming from Siebel to prevent path traversal
  const rawFileName: string = data?.["File Name"] || data?.["Name"] || `attachment_${args.attachmentId}`;
  const fileName = sanitizeFileName(rawFileName);
  const base64Content: string = data?.["File Content"] || data?.["AttachmentFileContent"] || "";

  if (args.output_dir && base64Content) {
    const safeOutputDir = validateOutputDir(args.output_dir);
    const filePath = path.join(safeOutputDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64Content, "base64"));
    return {
      success: true,
      file_name: fileName,
      file_path: filePath,
      message: `Attachment saved to: ${filePath}`,
    };
  }

  return {
    success: true,
    file_name: fileName,
    base64: base64Content,
    message: `Attachment retrieved as Base64. File name: ${fileName}`,
  };
}

// ─── Upload Attachment ─────────────────────────────────────────────────────────

export const uploadAttachmentTool = {
  name: "upload_attachment",
  description:
    "Uploads a file as an attachment to a Siebel record. " +
    "Reads the file from disk (must be in Desktop, Documents or Downloads) and POSTs to AttachmentDocIO.",
  inputSchema: {
    type: "object",
    properties: {
      attachmentBC: {
        type: "string",
        description:
          "Attachment Business Component name. E.g.: 'Account Attachment', 'Opportunity Attachment'",
      },
      parentId: {
        type: "string",
        description: "ROW_ID of the parent record to attach the file to",
      },
      filePath: {
        type: "string",
        description: "Full path to the file to upload. Must be in Desktop, Documents or Downloads.",
      },
      fileName: {
        type: "string",
        description: "File name to use in Siebel (optional, defaults to the actual file name)",
      },
    },
    required: ["attachmentBC", "parentId", "filePath"],
  },
};

export async function uploadAttachment(
  client: SiebelClient,
  args: {
    attachmentBC: string;
    parentId: string;
    filePath: string;
    fileName?: string;
  }
): Promise<unknown> {
  validateUrlSegment(args.attachmentBC, "attachmentBC");
  validateUploadPath(args.filePath);  // Restrict to safe directories

  const fileBuffer    = fs.readFileSync(args.filePath);
  const base64Content = fileBuffer.toString("base64");
  const fileName      = sanitizeFileName(args.fileName || path.basename(args.filePath));
  const fileExt       = path.extname(fileName).replace(".", "");
  const encodedBC     = encodeURIComponent(args.attachmentBC);

  return client.post(`/data/AttachmentDocIO/${encodedBC}`, {
    "File Name":             fileName,
    "File Ext":              fileExt,
    "Parent Row Id":         args.parentId,
    "AttachmentFileContent": base64Content,
  });
}

// ─── Delete Attachment ─────────────────────────────────────────────────────────

export const deleteAttachmentTool = {
  name: "delete_attachment",
  description:
    "Deletes an attachment from a Siebel record. " +
    "⚠️ This operation is IRREVERSIBLE. Requires confirm=true to execute.",
  inputSchema: {
    type: "object",
    properties: {
      attachmentBC: {
        type: "string",
        description: "Attachment Business Component name. E.g.: 'Account Attachment'",
      },
      attachmentId: {
        type: "string",
        description: "ROW_ID of the attachment record to delete",
      },
      confirm: {
        type: "boolean",
        description: "Must be explicitly set to true to confirm the irreversible deletion.",
      },
    },
    required: ["attachmentBC", "attachmentId", "confirm"],
  },
};

export async function deleteAttachment(
  client: SiebelClient,
  args: {
    attachmentBC: string;
    attachmentId: string;
    confirm: boolean;
  }
): Promise<{ success: boolean; message: string }> {
  if (args.confirm !== true) {
    throw new Error("Deletion cancelled: confirm must be explicitly set to true.");
  }

  validateUrlSegment(args.attachmentBC, "attachmentBC");
  const encodedBC = encodeURIComponent(args.attachmentBC);
  await client.delete(`/data/AttachmentDocIO/${encodedBC}/${args.attachmentId}`);
  return {
    success: true,
    message: `Attachment ${args.attachmentId} deleted successfully`,
  };
}
