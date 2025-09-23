import type { IDBConfig } from "./IDBConfig";
import type { IUWSConfig } from "./IUWSConfig";

export interface IAppConfig {
    port: number;
    db: IDBConfig;
    uws: IUWSConfig;
}
