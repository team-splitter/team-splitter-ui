import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {withConfigurationProvider} from './services/context/ConfigurationContext';
import {compose} from './utils/ComposeUtils'
import { Auth0Provider } from "@auth0/auth0-react";

import {Config, configSingleton} from 'services/configurationService';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';

Amplify.configure(amplifyconfig);


const config = configSingleton.getConfig();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
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

reportWebVitals();
