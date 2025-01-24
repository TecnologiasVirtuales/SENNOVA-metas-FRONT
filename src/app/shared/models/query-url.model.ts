export interface QueryUrlModel{
    included?:string[];
    filter?:{[key:string]:string|number}
    page_number?:number;
    page_size?:number;
}