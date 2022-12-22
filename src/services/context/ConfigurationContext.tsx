
import { FC, useEffect, createContext, useReducer } from 'react';
import {
    Config as ConfigType,
    configSingleton,
    getConfig,
} from '../configurationService';


interface State {
    isLoading: boolean;
    isConfigured: boolean;
    config?: ConfigType;
}

export type Config = ConfigType;

const initialState: State = {
    isLoading: false,
    isConfigured: false,
};

const ConfigContext = createContext(initialState);
ConfigContext.displayName = 'ConfigContext';

interface DispatchProps {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
}

const reducer = (state: State, { type, payload }: DispatchProps) => {
    switch (type) {
        case 'config':
            return {
                ...state,
                config: payload,
                isLoading: false,
                isConfigured: true,
            };
        case 'loading':
            return {
                ...state,
                isLoading: payload,
            };
        case 'configured':
            return {
                ...state,
                isLoading: false,
                isConfigured: payload,
            };
        default:
            return state;
    }
};


/**
 * HOC to provide a Configuration Context. Use it on root component level.
 * @returns JSX.Element
 * @example export default withConfigurationProvider(Root);
 */
export const withConfigurationProvider = (Component: FC) => () => {
    const [configContext, dispatch] = useReducer(reducer, initialState);

    const loadConfig = async () => {
        dispatch({ type: 'loading', payload: true });
        try {
            let reactAppEnv = 'local';

            const appConfig = getConfig(reactAppEnv);
            configSingleton.setConfig(appConfig);
            dispatch({ type: 'config', payload: appConfig });
        } catch (error) {
            const err = error as Error;
            console.log(
                `Error initializing application configuration: ${JSON.stringify(err.stack)}`
            );
            dispatch({ type: 'configured', payload: false });
        }
    };

    useEffect(() => {
        if (process && process.env && process.env.REACT_APP_ENV === 'dev') {
            // The app is running in development mode locally using webpack
            const appConfig = getConfig('local');
            configSingleton.setConfig(appConfig);
            dispatch({ type: 'config', payload: appConfig });
        } else {
            // The app is running in the Nginx container. Pulling config.
            loadConfig();
        }
    }, []);

    return (
        <ConfigContext.Provider value={configContext} >
            <Component />
        </ConfigContext.Provider>
    );
};

/**
* The type of config state property been injected to a component using withConfiguration HOC
* @example
* interface Props {
*  config: ConfigStateProps;
* }
*/
export type ConfigStateProps = State;

interface ConfigContextProps {
    config: ConfigStateProps;
}


/**
 * HOC to consume a Configuration Context. Injects config property into component's properties. Use it with any component under Root component level. THe HOC uses condition.
 * @returns JSX.Element
 * @example export default withConfiguration(isConfigured)(MyComponent);
 */
const withConfiguration = <P extends ConfigContextProps>(
    condition: (configContext: State) => boolean
) =>
    (Component: FC<P>) =>
        (props: P) => {
            return (
                <ConfigContext.Consumer>
                    {configContext =>
                        condition(configContext) ? (
                            <Component {...props} config={configContext.config} />
                        ) : null
                    }
                </ConfigContext.Consumer>
            );
        };


export default withConfiguration;

/**
 * Condition method of withConfiguration HOC to return wrapped component only when the configuration was initialized by withConfigurationProvider HOC
 * @returns boolean
 * @example export default withConfiguration(isConfigured)(MyComponent);
 */
export const isConfigured = (configContext: State): boolean =>
    !!configContext?.isConfigured;