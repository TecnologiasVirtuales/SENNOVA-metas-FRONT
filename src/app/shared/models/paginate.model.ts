export interface PaginateModel<T>{
    count:number,
    num_pages:number;
    current_page:number;
    results:T[];
}