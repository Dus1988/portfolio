import { DataMapFormatter } from "../../../@core/utils/DataMapFormatter/data-map-formatter.util";
import { CustomFormatter } from "../../../@shared/util/custom-util";
import * as moment from 'moment';

export class SortFunctions {

    static getSortFunction(FormatCode: string): any {
        let f;
        if (!FormatCode) return SortFunctions.String;
        const category = FormatCode.split('.')[0];
        if (category === 's') {
            f = SortFunctions.String;
        } else if (category === 'c'){
            f = SortFunctions.Number;
        } else if (category === 'n'){
            f = SortFunctions.Number;
        } else if (category === 'p') {
            f = SortFunctions.Number;
        } else if (category === 'd') {
            f = SortFunctions.Date;
        }
        return f;
    }
        

    static String(a, b, key: string, direction: string) {
        if (direction === 'desc'){
            if (a[key] > b[key]) {
                return -1;
            } else if (a[key] === b[key]) {
                return 0;
            } else {
                return 1;
            }
        } else if (direction === 'asc') {
            if (a[key] < b[key]) {
                return -1;
            } else if (a[key] === b[key]) {
                return 0;
            } else {
                return 1;
            }
        }
    }

    static Number(a, b, key: string, direction: string, formatCode: string) {
        const aNumber = Number(a[key]);
        const bNumber = Number(b[key]);

        if (isNaN(aNumber) || isNaN(bNumber)){
            return;
        } else {
            if (direction === 'desc'){
                if (aNumber > bNumber) {
                    return -1;
                } else if (aNumber === bNumber) {
                    return 0;
                } else {
                    return 1;
                }
            } else if (direction === 'asc') {
                if (aNumber < bNumber) {
                    return -1;
                } else if (aNumber === bNumber) {
                    return 0;
                } else {
                    return 1;
                }
            }
        }
    }

    static Date(a, b, key: string, direction: string, formatCode: string) {
        const aDate = moment(a[key]);
        const bDate = moment(b[key]);

        if (direction === 'desc'){
            if (!a[key] || a[key] === '12:00:00 AM' || aDate.year() === 1900){
                return 1;
            } else if (aDate > bDate) {
                return -1;
            } else if (aDate === bDate) {
                return 0;
            } else {
                return 1;
            }
        } else if (direction === 'asc') {
            if (!a[key] || a[key] === '12:00:00 AM' || aDate.year() === 1900){
                return -1;
            } else if (aDate < bDate) {
                return -1;
            } else if (aDate === bDate) {
                return 0;
            } else {
                return 1;
            }
        }
    }

    // static Percentages(a, b, key: string, direction: string, formatCode: string) {

    // }

}