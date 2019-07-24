import { FilterTypes } from '../Enums/filter-types.enum';

export class FilterFunctions {

    public static getFilterFunction(FormatCode: string): any {
        let f;
        if (!FormatCode) return FilterFunctions.String;
        const category = FormatCode.split('.')[0];
        if (category === 's') {
            f = FilterFunctions.String;
        } else if (category === 'c') {
            f = FilterFunctions.Currency;
        } else if (category === 'n') {
            f = FilterFunctions.Number;
        } else if (category === 'p') {
            f = FilterFunctions.Percent;
        } else if (category === 'd') {
            f = FilterFunctions.String;
        }
        return f;
    }

    public static String(cell: any, search: string, operation: string) {
        //console.log('filter', cell, search);
        if (!cell){
            cell = '';
        }

        cell = cell.toString().toLowerCase();
        search = search.toString().toLowerCase();
        return FilterFunctions.filter(cell, search, operation);
    }

    public static Number(cell: any, search: any, operation: string) {
        if (!cell) {
            cell = 'n/a';
            search = search.toLowerCase();
        } else {
            cell = Number(cell.toString());
            search = search.toLowerCase() === 'n/a' ? 'n/a' : Number(search.toString().replace(/[,%$/]/g, ''));
        }
        return FilterFunctions.filter(cell, search, operation);
    }

    public static Currency(cell: any, search: any, operation: string) {
        if (!cell) {
            cell = 'n/a';
            search = search.toLowerCase();
        } else {
            cell = Number(cell.toString());
            search = search.toLowerCase() === 'n/a' ? 'n/a' : Number(search.toString().replace(/[$,%/]/g, ''));
        }
        return FilterFunctions.filter(cell, search, operation);
    }

    public static Percent(cell: any, search: any, operation: string) {
        if (!cell) {
            cell = 'n/a';
            search = search.toLowerCase();
        } else {
            cell = Number(parseFloat(cell.toString()) * 100);
            search = search.toLowerCase() === 'n/a' ? 'n/a' : Number(search.replace(/[$,%/]/g, ''));
        }
        return FilterFunctions.filter(cell, search, operation);
    }

    // public static Date(cell: any, search: string, operation: string) {
    //     cell = cell.replace(/[/]/g, '');
    //     search = search.toString().replace(/[/]/g, '');
    //     return cell.indexOf(search) > -1;
    // }

    public static contains(cell, search): boolean {

        if ( search === 'n/a' && cell === 'n/a') return true;
        return cell.indexOf(search) > -1;
    }

    public static endsWith(cell, search): boolean {

        const searchLength = search.length;
        const cellLength = cell.length;
        // if ()
        const endsWith = cell.substring(cellLength - searchLength) === search;
        return endsWith;
    }

    public static equals(cell, search): boolean {
        if ( search === 'n/a' && cell === 'n/a') return true;
        return cell === search;
    }

    public static greaterThan(cell, search): boolean {
        return cell > search;
    }

    public static greaterThanOrEqual(cell, search): boolean {
        return cell >= search;
    }

    public static lessThan(cell, search): boolean {
        return cell < search;
    }

    public static lessThanOrEqual(cell, search): boolean {
        return cell <= search;
    }

    public static notEqual(cell, search): boolean {
            if ( search === 'n/a' && cell === 'n/a') return false;
            return cell !== search;
    }

    public static startsWith(cell, search): boolean {
        const searchLength = search.length;
        const cellLength = cell.length;
        // if ()
        const startsWith = cell.substring(0, searchLength) === search;
        return startsWith;
    }





    public static filter(cell, search, operation ) {
        switch (operation) {
            case (FilterTypes.Contains): {
                return FilterFunctions.contains(cell.toString(), search.toString());
            }
            case (FilterTypes.EndsWith): {
                return FilterFunctions.endsWith(cell.toString(), search.toString());
            }
            case (FilterTypes.Equals): {
                return FilterFunctions.equals(cell, search);
            }
            case (FilterTypes.GraterThanOrEqual): {
                return FilterFunctions.greaterThanOrEqual(cell, search);
            }
            case (FilterTypes.GreaterThan): {
                return FilterFunctions.greaterThan(cell, search);
            }
            case (FilterTypes.LessThan): {
                return FilterFunctions.lessThan(cell, search);
            }
            case (FilterTypes.LessThanOrEqualTo): {
                return FilterFunctions.lessThanOrEqual(cell, search);
            }
            case (FilterTypes.NotEqual): {
                return FilterFunctions.notEqual(cell, search);
            }
            case (FilterTypes.StartsWith): {
                return FilterFunctions.startsWith(cell.toString(), search.toString());
            }
            default: {
                break;
            }
        }


    }
}