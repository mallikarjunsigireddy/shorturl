import { useState } from 'react';

export function ShortenForm({ onSubmit, loading, error }) {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit({
      long_url: longUrl,
      custom_alias: customAlias || undefined,
      expires_in_days: expiresInDays || undefined,
    });

    if (success) {
      setLongUrl('');
      setCustomAlias('');
      setExpiresInDays('');
    }
  };

  return (
    <section className="card">
      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="longUrl">Destination Long URL *</label>
          <input
            id="longUrl"
            type="url"
            placeholder="https://example.com/very/long/article/path"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customAlias">Custom Alias (Optional)</label>
            <input
              id="customAlias"
              type="text"
              placeholder="e.g., my-resume"
              maxLength={10}
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiresIn">Link Expiration (Optional)</label>
            <select
              id="expiresIn"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
            >
              <option value="">Never expires</option>
              <option value="1">24 Hours</option>
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
    </section>
  );
}