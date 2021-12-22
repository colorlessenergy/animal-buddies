import { useEffect } from 'react';
import '../styles/globals.scss';

import { AuthUserProvider } from '../shared/contexts/AuthUserContext';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        if (!localStorage.getItem('theme')) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        }

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
        }
    }, []);

    return (
      <AuthUserProvider>
          <Component {...pageProps} />
      </AuthUserProvider>
    );
}

export default MyApp;
