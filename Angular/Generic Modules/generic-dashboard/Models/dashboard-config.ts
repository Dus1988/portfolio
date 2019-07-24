

import * as moment from 'moment';

export interface DashboardConfigOptions {
    clientGroup: number;
    dateFrom: string;
    dateTo: string;
    dashRoute?: string;
}


export class DashboardConfig {
         /**
          * Dashboard config is used to configure a generic dashboard
          */
         constructor(config: DashboardConfigOptions = {
             clientGroup: 0, dateFrom: moment().format('dd/mm/yyyy'),
             dateTo: moment().format('dd/mm/yyyy'),
            }) {
             Object.keys(config).forEach((key, index) => {
                 this[key] = config[key];
             });
         }

         public clientGroup: number;
         public dateFrom: string;
         public dateTo: string;
         public dashRoute: string;
       }
