import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import App from './App';
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
