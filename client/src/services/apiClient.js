import { config } from '../config/env';

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error?.message || data.error || 'Request failed');
  }

  return data;
}