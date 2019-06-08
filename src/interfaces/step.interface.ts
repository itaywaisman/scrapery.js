export interface IStep {
    init(options?: any) : void;
    execute(data: any, parameters?: any): Promise<any>;
}
