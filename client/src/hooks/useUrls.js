import { useState, useEffect, useCallback } from 'react';
import { urlService } from '../services/urlService';

export function useUrls() {
  const [links, setLinks] = useState([]);
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLinks = useCallback(async () => {
    try {
      const data = await urlService.getRecentUrls();
      setLinks(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const shortenUrl = async (payload) => {
    setError('');
    setLoading(true);
    try {
      const created = await urlService.createShortUrl(payload);
      setLatestResult(created);
      await fetchLinks();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { links, latestResult, loading, error, shortenUrl };
}