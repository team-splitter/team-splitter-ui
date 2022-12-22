import localConfigJson from '../config/local.json';
import prodConfigJson from '../config/prod.json';
// import {get} from '../commons/client/http';

export const environments = {
    LOCAL: 'local',
    PROD: 'prod',
};

export interface Config {
    reactAppEnv: string,
    backend: {
        url: string
    }
}

const localConfig: Config = localConfigJson;
const prodConfig: Config = prodConfigJson;

/**
 * The method to get a configuration based on environment name
 * @param env: string - environment name from the environments constant
 * @returns Config
 * @example const config = getConfig(environments.DEV);
 */
export const getConfig = (env: string): Config => {

    switch (env) {
        case environments.LOCAL:
            return localConfig;
        case environments.PROD:
            return prodConfig;
        default:
            return localConfig;
    }
};

let instance: AppConfig | null = null;

class AppConfig {
    private config?: Config;

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    setConfig(config: Config) {
        this.config = config;
    }

    getConfig(): Config | undefined {
        return this.config;
    }
}

/**
* The configuration singleton object to get config out of a component. To inject configuration into UI Component use withConfiguration HOC.
* Must be a part of React lifecycle.
* @returns AppConfig singleton object
* @example
* import {configSingleton} from 'services/configurationService';
* const config = configSingleton.getConfig();
*/

export const configSingleton = new AppConfig();

//TODO remove it and replace with ConfigContext
const appConfig = getConfig('local');
configSingleton.setConfig(appConfig);

