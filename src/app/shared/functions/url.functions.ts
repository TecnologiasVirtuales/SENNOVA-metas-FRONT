import {QueryUrlModel} from "@shared/models/query-url.model";
import { normalizeString } from "./string.functions";

export function getQueryUrl(url: string, data?: QueryUrlModel) {
    if (data) {
        url += '?';
        const { included, filter,page_number,page_size } = data;
        if (included) {
            url += `included=${included.join(',')}`;
        }

        if (filter) {
            if(url.at(-1)!== '?') url+="&";
            Object.keys(filter).forEach((key, index, array) => {
                let filter_value: string = '';
                
                if (typeof filter[key] === 'number') {
                    filter_value = filter[key].toString();
                } else {
                    filter_value = filter[key] as string;
                }
                
                filter_value = filter_value.split(',').map((val)=>normalizeString(val)).join(',')

                filter_value = filter_value.replace(/ /g, '-').toLowerCase();
                
                url += `filters[${key}]=${filter_value}`;

                if (index < array.length - 1) {
                    url += '&';
                }
            });
        }

        if(page_number){
            if(url.at(-1)!== '?') url+="&";
            url+=`page_number=${page_number}`;
        }

        if(page_size){
            if(url.at(-1)!== '?') url+="&";
            url+=`page_size=${page_size}`;
        }

    }
    return url;
}