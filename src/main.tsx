import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import App from './App';
// Interim Cera Pro stand-in (same five styles: Light/Italic/Medium/Bold/Black).
// TODO: swap to licensed Cera Pro — see the @font-face note in styles/tokens.css.
import '@fontsource/jost/300.css';
import '@fontsource/jost/400-italic.css';
import '@fontsource/jost/500.css';
import '@fontsource/jost/700.css';
import '@fontsource/jost/900.css';
import './styles/tokens.css';
import './index.css';
import './styles/components.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element with id="root" not found.');
}

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>,
);
