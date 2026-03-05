import axios, { AxiosInstance } from "axios";

export interface SiebelConfig {
  url: string;
  username: string;
  password: string;
  lang?: string;
}

export class SiebelClient {
  private http: AxiosInstance;

  constructor(config: SiebelConfig) {
    this.http = axios.create({
      baseURL: `${config.url}/siebel/v1.0`,
      auth: { username: config.username, password: config.password },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(config.lang ? { "Accept-Language": config.lang } : {}),
      },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
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
    throw new Error(
      "Faltan variables de entorno: SIEBEL_URL, SIEBEL_USERNAME, SIEBEL_PASSWORD"
    );
  }

  return new SiebelClient({ url, username, password, lang });
}
