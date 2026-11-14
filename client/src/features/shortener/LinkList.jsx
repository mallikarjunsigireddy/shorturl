import { LinkItem } from './LinkItem';

export function LinkList({ links, copiedId, onCopy }) {
  return (
    <section className="card">
      <div className="links-header">
        <h2>Recent Links</h2>
        <span className="badge">{links.length} total</span>
      </div>

      {links.length === 0 ? (
        <p className="empty-text">No links created yet. Shorten your first URL above!</p>
      ) : (
        <div>
          {links.map((item) => (
            <LinkItem
              key={item.short_code}
              item={item}
              copiedId={copiedId}
              onCopy={onCopy}
            />
          ))}
        </div>
      )}
    </section>
  );
}