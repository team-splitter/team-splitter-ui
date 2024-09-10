import https from 'https';
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient();

const command = new GetParametersCommand({
  Names: ["TELEGRAM_TOKEN"].map(
    (secretName) => process.env[secretName]
  ),
  WithDecryption: true,
});

const defaultOptions = {
    host: 'api.telegram.org',
    headers: {
        'Content-Type': 'application/json'
    }
};

const post = (path, payload) => new Promise((resolve, reject) => {
    const options = { ...defaultOptions, path, method: 'POST' };
    const req = https.request(options, res => {
        let buffer = '';
        res.on('data', chunk => buffer += chunk);
        res.on('end', () => resolve(JSON.parse(buffer)));
    });
    req.on('error', e => reject(e.message));
    req.write(JSON.stringify((payload)));
    req.end();
})

export const sendMessage = async (payload) => {
    const { Parameters } = await client.send(command);
    const telegramToken = Parameters.pop().Value

    console.log(`token=${telegramToken}, payload=${JSON.stringify(payload)}`);
    return await post(`/${telegramToken}/sendMessage`, payload);
}
