import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/archivo-black/400.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/sections.css';
import './styles/admin.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
