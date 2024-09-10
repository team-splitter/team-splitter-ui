import { Amplify } from "aws-amplify";

//workaround to get API endpoint dynamicaly based on the environment
export const backendUrl = () => {
   return `${Amplify.getConfig().API?.REST?.teamsplitterapi.endpoint}/api/v1`; 
};

export default backendUrl;