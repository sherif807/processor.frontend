import '../styles/globals.css';
import { UploadProvider } from '../context/UploadContext';
import { useContext } from 'react';
import { UploadContext } from '../context/UploadContext';

function GlobalUploadStatus() {
  const { isUploading, uploadQueue } = useContext(UploadContext);

  if (uploadQueue.length === 0) {
    return null; // Don't show anything if no files are being uploaded
  }

  return (
    <div className="fixed bottom-0 right-0 bg-gray-200 p-4 rounded">
      {isUploading ? 'Uploading...' : 'Idle'}
      <p>{uploadQueue.length} file(s) remaining</p>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <UploadProvider>
      <Component {...pageProps} />
      <GlobalUploadStatus /> {/* This will show the upload status globally */}
    </UploadProvider>
  );
}

export default MyApp;
