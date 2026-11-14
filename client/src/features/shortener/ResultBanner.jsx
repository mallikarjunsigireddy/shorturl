import { CopyButton } from '../../components/common/CopyButton';

export function ResultBanner({ result, copiedId, onCopy }) {
  if (!result) return null;

  return (
    <section className="result-card">
      <div>
        <div className="result-label">Your shortened link is ready:</div>
        <a
          href={result.short_url}
          target="_blank"
          rel="noreferrer"
          className="result-link"
        >
          {result.short_url}
        </a>
      </div>
      <CopyButton
        text={result.short_url}
        id={result.short_code}
        copiedId={copiedId}
        onCopy={onCopy}
        label="Copy Link"
      />
    </section>
  );
}