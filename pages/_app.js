import '../styles/globals.css';
import { UploadProvider } from '../context/UploadContext';
import { useContext } from 'react';
import { UploadContext } from '../context/UploadContext';

function GlobalUploadStatus() {
  const { isUploading } = useContext(UploadContext);

  if (!isUploading) {
    return null; // Don't show anything if no uploads are in progress
  }

  return (
    <div className="fixed bottom-0 right-0 bg-gray-200 p-4 rounded">
      Uploading...
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <UploadProvider>
      <Component {...pageProps} />
      <GlobalUploadStatus /> {/* Show the upload status globally */}
    </UploadProvider>
  );
}

export default MyApp;
