import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './assets/index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core';
import App from './App.tsx'
import { Notifications } from '@mantine/notifications';
import { mantineThemOptions } from './utils/constant.ts';

const theme = createTheme(mantineThemOptions);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
      <Notifications position="top-center" zIndex={1000} />
    </MantineProvider>
  </React.StrictMode>,
)
