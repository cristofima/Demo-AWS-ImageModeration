import * as dotenv from 'dotenv';
import * as fs from 'fs';

export function loadConfig() {
    const environment = (process.env.NODE_ENV ?? 'local').trim(); // Determine the current environment, defaulting to 'local'

    // Read and parse the .env file associated with the current environment
    const data: any = dotenv.parse(fs.readFileSync(`.env.${environment}`));

    // Set the parsed variables to the process.env
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            process.env[key] = data[key];
        }
    }
}