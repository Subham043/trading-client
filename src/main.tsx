import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './assets/index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, MantineProvider, rem } from '@mantine/core';
import App from './App.tsx'
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  /** Put your mantine theme override here */
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: 'blue',

  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
      <Notifications position="top-center" zIndex={1000} />
    </MantineProvider>
  </React.StrictMode>,
)
