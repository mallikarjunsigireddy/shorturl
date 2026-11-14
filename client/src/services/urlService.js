import { config } from '../config/env';
import { apiRequest } from './apiClient';


export const urlService = {
    async getRecentUrls() {
    return apiRequest('/api/v1/urls');
  },

  async createShortUrl({ long_url, custom_alias, expires_in_days }) {
    return apiRequest('/api/v1/urls', {
      method: 'POST',
      body: JSON.stringify({
        long_url,
        custom_alias,
        expires_in_days,
      }),
    });
  },
};
