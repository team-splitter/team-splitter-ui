import {flowRight} from 'lodash';

/**
 * Compose higher order components
 * @param  {Function[]} ...fns
 */
export const compose = flowRight;
