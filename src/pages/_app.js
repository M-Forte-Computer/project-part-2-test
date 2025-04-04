import React from 'react';
import '../app/page.module.css'; // Ensure global CSS is imported

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
