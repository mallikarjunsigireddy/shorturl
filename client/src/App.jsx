import { Header } from './components/common/Header';
import { ShortenForm } from './features/shortener/ShortenForm';
import { ResultBanner } from './features/shortener/ResultBanner';
import { LinkList } from './features/shortener/LinkList';
import { useUrls } from './hooks/useUrls';
import { useClipboard } from './hooks/useClipboard';

export default function App() {
  const { links, latestResult, loading, error, shortenUrl } = useUrls();
  const { copiedId, copy } = useClipboard();

  return (
    <div className="container">
      <Header />
      <main>
        <ShortenForm onSubmit={shortenUrl} loading={loading} error={error} />
        <ResultBanner result={latestResult} copiedId={copiedId} onCopy={copy} />
        <LinkList links={links} copiedId={copiedId} onCopy={copy} />
      </main>
    </div>
  );
}