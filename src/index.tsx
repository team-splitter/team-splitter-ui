import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {withConfigurationProvider} from './services/context/ConfigurationContext';
import {compose} from './utils/ComposeUtils'
import { Auth0Provider } from "@auth0/auth0-react";

import {Config, configSingleton} from 'services/configurationService';


const config = configSingleton.getConfig();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <Auth0Provider
    domain={`${config?.auth.domain}`}
    clientId={`${config?.auth.clientId}`}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    cacheLocation='localstorage'
  >
    <App />
  </Auth0Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
