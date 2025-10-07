import type { IDBConfig } from "./IDBConfig.js";
import type { IUWSConfig } from "./IUWSConfig.js";

export interface IAppConfig {
    port: number;
    db: IDBConfig;
    uws: IUWSConfig;
}
