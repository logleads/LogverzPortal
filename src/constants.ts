export const DEVELOPMENT_MODE = 'development';
export const PRODUCTION_MODE = 'production';

// dotenv-webpack plugin throws error if env variables are empty
export const REGION = process.env.REGION as string;
export const ACCOUNT_NUMBER = process.env.ACCOUNT_NUMBER as string;
export const BASE_URL = process.env.BASE_URL as string;
export const STAGE_NAME = process.env.STAGE_NAME as string;

//hints
export const DCH_AVAILABLE_BUCKETS = process.env.DCH_AVAILABLE_BUCKETS as string;
export const DCH_S3_FOLDERS = process.env.DCH_S3_FOLDERS as string;
export const DCH_LOG_VOLUME = process.env.DCH_LOG_VOLUME as string;
export const DCH_QUERY_TYPE_SELECTOR = process.env.DCH_QUERY_TYPE_SELECTOR as string;
export const DCH_DB_SERVER_ALIAS = process.env.DCH_DB_SERVER_ALIAS as string;
export const DCH_TABLE_NAME = process.env.DCH_TABLE_NAME as string;
export const DCH_TABLE_DESCRIPTION = process.env.DCH_TABLE_DESCRIPTION as string;
export const DCH_TABLE_OWNERS = process.env.DCH_TABLE_OWNERS as string;
export const DCH_TABLE_ACCESS = process.env.DCH_TABLE_ACCESS as string;
export const DCH_S3_ENUMERATION_DEPTH = process.env.DCH_S3_ENUMERATION_DEPTH as string;
export const DCH_PREFERRED_WORKED_NUMBER = process.env.DCH_PREFERRED_WORKED_NUMBER as string;
export const DCH_ALLOCATION_STRATEGY = process.env.DCH_ALLOCATION_STRATEGY as string;
export const DCH_QUERY_HISTORY = process.env.DCH_QUERY_HISTORY as string;

export const AW_NAME = process.env.AW_NAME as string;
export const AW_TYPE = process.env.AW_TYPE as string;
export const AW_GROUPS = process.env.AW_GROUPS as string;
export const AW_POLICIES = process.env.AW_POLICIES as string;
export const AD_HTML_TAG = process.env.AD_HTML_TAG as string;
export const AD_HTML_TAG_ID = process.env.AD_HTML_TAG_ID as string;
export const AD_SCRIPT_SRC = process.env.AD_SCRIPT_SRC as string;

export const notShowDatatypeSelector: string[] = ['ProcessingErrors', 'Invocations'];

export const MSSQL_PREFIX = 'Logverz.dbo';

export const RTC_PORT = process.env.RTC_PORT as string;
export const USR_RTC_DESCRIPTION = process.env.USR_RTC_DESCRIPTION as string;

export const NOTIFICATION_GLOBAL_NEWS_URL = process.env.NOTIFICATION_GLOBAL_NEWS_URL as string;



export const filter = [
    // ['Product_Current_Inventory', '<>', 0],
    // 'or',
    // [
    //   ['Product_Name', 'contains', 'HD'],
    //   'and',
    //   ['Product_Cost', '<', 200],
    // ],
  ];
  
  export const fields = [
    {
    //   caption: 'ID',
    //   width: 50,
      dataField: 'Product_ID',
    //   dataType: 'number',
    },
    //  {
    //   dataField: 'Product_Name',
    //   dataType: 'string',
    // }, {
    //   caption: 'Cost',
    //   dataField: 'Product_Cost',
    //   dataType: 'number',
    //   format: 'currency',
    // }, {
    //   dataField: 'Product_Sale_Price',
    //   caption: 'Sale Price',
    //   dataType: 'number',
    //   format: 'currency',
    // }, {
    //   dataField: 'Product_Retail_Price',
    //   caption: 'Retail Price',
    //   dataType: 'number',
    //   format: 'currency',
    // }, {
    //   dataField: 'Product_Current_Inventory',
    //   dataType: 'number',
    //   caption: 'Inventory',
    // },
  ];
  