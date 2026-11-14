import { CopyButton } from '../../components/common/CopyButton';

export function LinkItem({ item, copiedId, onCopy }) {
  return (
    <div className="link-item">
      <div className="link-info">
        <a
          href={item.short_url}
          target="_blank"
          rel="noreferrer"
          className="short-url"
        >
          {item.short_url}
        </a>
        <div className="long-url" title={item.long_url}>
          {item.long_url}
        </div>
        <div className="meta-badges">
          <span className="badge">{item.clicks} clicks</span>
          <span className="badge">
            {item.expires_at
              ? `Expires ${new Date(item.expires_at).toLocaleDateString()}`
              : 'No expiry'}
          </span>
        </div>
      </div>

      <CopyButton
        text={item.short_url}
        id={item.short_code}
        copiedId={copiedId}
        onCopy={onCopy}
      />
    </div>
  );
}