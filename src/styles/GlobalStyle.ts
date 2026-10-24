import { createGlobalStyle } from 'styled-components';
import { colors, font } from './tokens';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    overflow-x: hidden;
    background: ${colors.appBackground};
    color: ${colors.ink};
    font-family: ${font};
    font-size: 16px;
    line-height: 1.4;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  h1, h2, h3, p, dl, dd, ul, ol {
    margin: 0;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }

  a {
    color: ${colors.brand};
    font-weight: 700;
    text-decoration: none;
  }

  input::placeholder,
  textarea::placeholder {
    color: ${colors.inkSoft};
    opacity: 1;
  }

  :focus-visible {
    outline: 3px solid ${colors.brand};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
