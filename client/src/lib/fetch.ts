import { useUserStore } from '@/stores/user';

type FetchOptions = {
  url: string;
  process?: 'json' | 'blob'
} & ({
  method: 'POST';
  data?: string;
} | {
  method: 'GET';
})

export const custom_fetch = async (options: FetchOptions) => {
  const userStore = useUserStore();
  const token = userStore.token;
  const url = options.url;
  const method = options.method;
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  if (method === 'POST') {
    headers.set('Content-Type', 'application/json');
  }
  const body = method === 'POST' ? options.data : undefined;

  const fetchObj = fetch(url, {
    headers,
    method,
    body,
  });

  return await fetchObj;
}

export const json_response = async (_response: Promise<Response>) => {
  const response = await _response;
  const text = await response.text();
  if (response.ok) {
    return JSON.parse(text);
  }
  throw new Error(`访问 ${response.url} 失败: ${response.status} ${response.statusText} ${text}`);
}

export const blob_response = (response: Promise<Response>) => {
  return response.then(res => res.blob());
}
