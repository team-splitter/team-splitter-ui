import https from 'https';
import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

const client = new SSMClient();

const defaultOptions = {
    host: 'api.telegram.org',
    headers: {
        'Content-Type': 'application/json'
    }
};

const post = (path, method, payload) => new Promise((resolve, reject) => {
    const options = { ...defaultOptions, path, method: 'POST' };
    const req = https.request(options, res => {
        let buffer = '';
        res.on('data', chunk => buffer += chunk);
        res.on('end', () => {
            const response = JSON.parse(buffer);
            console.log(`${method} response: statusCode=${res.statusCode}, ok=${response.ok}, body=${buffer}`);
            resolve(response);
        });
    });
    req.on('error', e => {
        console.log(`${method} request error: ${e.message}`);
        reject(e.message);
    });
    req.write(JSON.stringify((payload)));
    req.end();
})

export const sendMessage = async (payload) => {
    const telegramToken = await getTelegramToken();

    console.log(`Send Message payload=${JSON.stringify(payload)}`);
    return await post(`/${telegramToken}/sendMessage`, 'sendMessage', payload);
}

export const sendPoll = async (payload) => {
    const telegramToken = await getTelegramToken();

    console.log(`Send Poll payload=${JSON.stringify(payload)}`);
    return await post(`/${telegramToken}/sendPoll`, 'sendPoll', payload);
}

export const stopPoll = async (payload) => {
    const telegramToken = await getTelegramToken();

    console.log(`Stop Poll payload=${JSON.stringify(payload)}`);
    return await post(`/${telegramToken}/stopPoll`, 'stopPoll', payload);
}

export const deleteMessage = async (payload) => {
    const telegramToken = await getTelegramToken();

    console.log(`Delete Message payload=${JSON.stringify(payload)}`);
    return await post(`/${telegramToken}/deleteMessage`, 'deleteMessage', payload);
}

export const editMessageText = async (payload) => {
    const telegramToken = await getTelegramToken();

    console.log(`Edit Message payload=${JSON.stringify(payload)}`);
    return await post(`/${telegramToken}/editMessageText`, 'editMessageText', payload);
}

const getTelegramToken = async () => {
    const command = new GetParametersCommand({
        Names: ["TELEGRAM_TOKEN"].map(
            (secretName) => process.env[secretName]
        ),
        WithDecryption: true,
    });
    const { Parameters } = await client.send(command);
    return Parameters.pop().Value;
}
