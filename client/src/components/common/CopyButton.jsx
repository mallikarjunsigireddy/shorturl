export function CopyButton({ text, id, copiedId, onCopy, label = 'Copy' }) {
  const isCopied = copiedId === id;

  return (
    <button
      type="button"
      className={`btn-copy ${isCopied ? 'copied' : ''}`}
      onClick={() => onCopy(text, id)}
    >
      {isCopied ? 'Copied!' : label}
    </button>
  );
}