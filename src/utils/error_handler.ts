import { existsSync, mkdirSync, writeFile } from "fs";
import { DateHelper } from "./date_helper.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class ErrorHandler {
    static record(filepathPrefix: string, message: string, err: Error | any) {
        try {
            const filepath = path.join(__dirname, '..', '..', 'error', `${filepathPrefix}_${DateHelper.getCurrentDate(true)}.txt`);
            if (err instanceof Error) message += `\n${err.name}: ${err.message}\nStack: ${err.stack}\n`;
            else if (typeof err === 'object') message += `\n${JSON.stringify(err)}\n`;
            else message += `\n${err}\n`;

            const dirpath = dirname(filepath);
            if (!existsSync(dirpath)) {
                mkdirSync(dirpath, { recursive: true });
            }
            writeFile(filepath, message, (err) => {
                if (err) {
                    console.log(err);
                }
                console.log(`Error log saved to ${filepath}`);
            });
        } catch (e: Error | any) {
            console.log(e.name, e.message);
        }
    }
}