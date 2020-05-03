import { default as QueryParamsService } from '../../services/query-params';
export interface ITransformOptions<T> {
    deserialize?: (queryParam: string) => T;
    serialize?: (queryParam: T) => string;
}
export declare type Args<T> = [] | [string, ITransformOptions<T>] | [ITransformOptions<T>] | [string];
export declare function extractArgs<T>(args: Args<T>, propertyKey: string): [string, ITransformOptions<T>];
export declare function tryDeserialize<T>(value: any, options: ITransformOptions<T>): any;
export declare function trySerialize<T>(value: any, options: ITransformOptions<T>): any;
export declare function ensureService(context: any): QueryParamsService;
export declare function getQPService(context: any): any;
