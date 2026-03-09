import * as path from "path";
import * as os from "os";

/**
 * Escapes single quotes in Siebel search expression values.
 * In Siebel, a single quote is escaped by doubling it: ' → ''
 */
export function escapeSiebelValue(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * Validates a Siebel Business Object or Business Component name.
 * Only allows alphanumeric characters, spaces, underscores, hyphens and parentheses.
 * Throws if the value contains path-like or injection characters.
 */
export function validateUrlSegment(segment: string, label: string): void {
  if (!segment || typeof segment !== "string") {
    throw new Error(`${label} must be a non-empty string.`);
  }
  if (!/^[a-zA-Z0-9 _\-()\/.]+$/.test(segment)) {
    throw new Error(
      `Invalid ${label}: "${segment}". Only alphanumeric characters, spaces, underscores, hyphens and parentheses are allowed.`
    );
  }
  // Block path traversal attempts
  if (segment.includes("..")) {
    throw new Error(`Invalid ${label}: path traversal detected.`);
  }
}

/**
 * Sanitizes a file name coming from an external source (e.g. Siebel response).
 * Strips directory components and dangerous characters.
 */
export function sanitizeFileName(fileName: string): string {
  // Strip any directory component
  const base = path.basename(fileName);
  // Only allow safe characters in file names
  return base.replace(/[^a-zA-Z0-9._\- ]/g, "_");
}

/**
 * Validates that a file path for upload is within allowed user directories.
 * Prevents arbitrary file reads from the filesystem.
 */
export function validateUploadPath(filePath: string): void {
  const resolved = path.resolve(filePath);
  const homeDir  = os.homedir();

  const allowedDirs = [
    path.join(homeDir, "Desktop"),
    path.join(homeDir, "Documents"),
    path.join(homeDir, "Downloads"),
    path.join(homeDir, "tmp"),
    os.tmpdir(),
  ];

  const isAllowed = allowedDirs.some((dir) =>
    resolved.startsWith(path.resolve(dir) + path.sep) ||
    resolved === path.resolve(dir)
  );

  if (!isAllowed) {
    throw new Error(
      `File path "${filePath}" is not in an allowed directory. ` +
      `Allowed directories: Desktop, Documents, Downloads, tmp.`
    );
  }
}

/**
 * Validates and resolves an output directory.
 * Ensures it is within the user's home directory.
 */
export function validateOutputDir(outputDir: string): string {
  const resolved = path.resolve(outputDir);
  const homeDir  = path.resolve(os.homedir());

  if (!resolved.startsWith(homeDir + path.sep) && resolved !== homeDir) {
    throw new Error(
      `Output directory "${outputDir}" must be within the user's home directory.`
    );
  }
  return resolved;
}
