import '../styles/globals.css';
import { UploadProvider } from '../context/UploadContext'; // Import the UploadProvider

function MyApp({ Component, pageProps }) {
  return (
    <UploadProvider>
      <Component {...pageProps} />
    </UploadProvider>
  );
}

export default MyApp;
