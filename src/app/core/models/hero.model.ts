export interface IHero {
    readonly id: number;
    name: string;
    description: string;
    powers: IKeyValue<string>[];
}

export interface IKeyValue<T> {
    readonly id: number;
    value: T;
}