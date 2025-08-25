import { useUserStore } from '@/stores/user';
import { CodeType } from "../../../types/codes.js";

type FetchOptions = {
  url: string;
  process?: 'json' | 'blob'
} & ({
  method: 'POST';
  data?: string;
} | {
  method: 'GET';
});

export class FetchError extends Error {
  public status: number;
  public statusText: string;
  public code: CodeType;

  constructor(status: number, statusText: string, code: CodeType, message: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.code = code;
  }

  public toString() {
    return `${this.status} ${this.statusText} (${this.code}): ${this.message}`;
  }
}

export class Fetcher<T = unknown> {
  private options: FetchOptions;

  constructor(options: FetchOptions) {
    if (!options.url.startsWith('/api/')) {
      options.url = '/api' + (options.url.startsWith('/') ? '' : '/') + options.url;
    }
    this.options = options;
  }

  public async fetch() {
    const userStore = useUserStore();
    const token = userStore.token;
    const url = this.options.url;
    const method = this.options.method;
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${token}`);
    if (method === 'POST') {
      headers.set('Content-Type', 'application/json');
    }
    const body = method === 'POST' ? this.options.data : undefined;

    const fetchObj = fetch(url, {
      headers,
      method,
      body,
    });

    return await fetchObj;
  }

  public async fetch_json(): Promise<T> {
    const response = await this.fetch();
    const text = await response.text();
    if (response.ok) {
      return JSON.parse(text);
    }
    let json: { type: CodeType, message: string };
    try {
      json = JSON.parse(text);
    } catch (error) {
      throw new FetchError(response.status, response.statusText, CodeType.UnknownError, text)
    }
    throw new FetchError(response.status, response.statusText, json.type, json.message);
  }

  public async fetch_blob() {
    const response = await this.fetch();
    if (response.ok) {
      return response.blob();
    } else {
      throw new FetchError(response.status, response.statusText, CodeType.UnknownError, response.statusText);
    }
  }
}

export async function fetchJson<T>(url: string, options?: { method?: 'GET' | 'POST', data?: string }): Promise<T> {
  const method = options?.method || 'GET';
  const fetcher = new Fetcher<T>({
    url,
    method,
    ...(method === 'POST' && {
      data: options?.data
    })
  });

  try {
    return await fetcher.fetch_json();
  } catch (error) {
    throw error;
  }
}

export async function postJson<T>(url: string, data?: string): Promise<T> {
  return await fetchJson<T>(url, { method: 'POST', data });
}
