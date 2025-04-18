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
// Do this once in your application root file
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const theme = createTheme(mantineThemOptions);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
      <Notifications position="top-center" zIndex={1000} />
    </MantineProvider>
  </React.StrictMode>,
)
