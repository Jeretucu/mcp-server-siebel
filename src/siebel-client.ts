import axios, { AxiosInstance } from "axios";
import * as https from "https";

export interface SiebelConfig {
  url: string;
  username: string;
  password: string;
  lang?: string;
}

export class SiebelClient {
  private http: AxiosInstance;

  constructor(config: SiebelConfig) {
    // SSL certificate validation is enabled by default (secure).
    // Set SIEBEL_ALLOW_SELF_SIGNED=true ONLY for dev environments with self-signed certs.
    const allowSelfSigned = process.env.SIEBEL_ALLOW_SELF_SIGNED === "true";

    this.http = axios.create({
      baseURL: `${config.url}/siebel/v1.0`,
      auth: { username: config.username, password: config.password },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(config.lang ? { "Accept-Language": config.lang } : {}),
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: !allowSelfSigned }),
      timeout: 30000,
    });
  }

  async get(path: string, params?: Record<string, string>) {
    const res = await this.http.get(path, { params });
    return res.data;
  }

  async post(path: string, body: unknown) {
    const res = await this.http.post(path, body);
    return res.data;
  }

  async put(path: string, body: unknown) {
    const res = await this.http.put(path, body);
    return res.data;
  }

  async delete(path: string) {
    const res = await this.http.delete(path);
    return res.data;
  }

  async query(
    businessObject: string,
    businessComponent: string,
    searchSpec?: string,
    fields?: string[]
  ) {
    const params: Record<string, string> = {};
    if (searchSpec) params.searchspec = searchSpec;
    if (fields?.length) params.fields = fields.join(",");
    return this.get(`/data/${businessObject}/${businessComponent}`, params);
  }
}

export function createClient(): SiebelClient {
  const url      = process.env.SIEBEL_URL;
  const username = process.env.SIEBEL_USERNAME;
  const password = process.env.SIEBEL_PASSWORD;
  const lang     = process.env.SIEBEL_LANG;

  if (!url || !username || !password) {
    throw new Error("Missing required Siebel environment variables.");
  }

  return new SiebelClient({ url, username, password, lang });
}
