/************************************************
 * This code is a function for request data from APIs.
 * Deploy on AWS Lambda (triggered by AWS API Gateway)
 ************************************************/
exports.handler = async (event, context, callback) => {
  // import module for submitting request.
  const axios = require('axios');

  // import modules
  const _ = require('lodash');
  const moment = require('moment');

  /************************************************
   * Internal API information for requesting data
   * You can setup these environment variables below on the AWS Lambda function's configuration.
   ************************************************/
  const env = {
    subgraph_eth: {
      api_host: process.env.SUBGRAPH_ETH_API_HOST || '{YOUR_SUBGRAPH_ETH_API_HOST}',
    },
    subgraph_bsc: {
      api_host: process.env.SUBGRAPH_BSC_API_HOST || '{YOUR_SUBGRAPH_BSC_API_HOST}',
    },
    subgraph_matic: {
      api_host: process.env.SUBGRAPH_MATIC_API_HOST || '{YOUR_SUBGRAPH_MATIC_API_HOST}',
    },
    subgraph_avax: {
      api_host: process.env.SUBGRAPH_AVAX_API_HOST || '{YOUR_SUBGRAPH_AVAX_API_HOST}',
    },
    subgraph_arb: {
      api_host: process.env.SUBGRAPH_ARB_API_HOST || '{YOUR_SUBGRAPH_ARB_API_HOST}',
    },
    subgraph_xdai: {
      api_host: process.env.SUBGRAPH_XDAI_API_HOST || '{YOUR_SUBGRAPH_XDAI_API_HOST}',
    },
    subgraph_ftm: {
      api_host: process.env.SUBGRAPH_FTM_API_HOST || '{YOUR_SUBGRAPH_FTM_API_HOST}',
    },
    subgraph_heco: {
      api_host: process.env.SUBGRAPH_HECO_API_HOST || '{YOUR_SUBGRAPH_HECO_API_HOST}',
    },
    subgraph_mbase: {
      api_host: process.env.SUBGRAPH_MBASE_API_HOST || '{YOUR_SUBGRAPH_MBASE_API_HOST}',
    },
    coingecko: {
      api_host: process.env.COINGECKO_API_HOST || 'https://api.coingecko.com/api/v3/',
    },
    covalent: {
      api_host: process.env.COVALENT_API_HOST || 'https://api.covalenthq.com/v1/',
      api_key: process.env.COVALENT_API_KEY || '{YOUR_COVALENT_API_KEY}',
    },
  };

  // response data variable
  let response = null;

  // check api_name parameter exist
  if (event.queryStringParameters && event.queryStringParameters.api_name && Object.keys(env).indexOf(`${event.queryStringParameters.api_name.trim().toLowerCase()}${event.queryStringParameters.chain_id ? `_${event.queryStringParameters.chain_id.trim().toLowerCase()}` : ''}`) > -1) {
    // normalize api_name parameter
    const apiName = `${event.queryStringParameters.api_name.trim().toLowerCase()}${event.queryStringParameters.chain_id ? `_${event.queryStringParameters.chain_id.trim().toLowerCase()}` : ''}`;
    // remove api_name parameter before setup query string parameters
    delete event.queryStringParameters.api_name;
    // remove chain_id parameter before setup query string parameters
    delete event.queryStringParameters.chain_id;

    // initial requester object
    const requester = axios.create({ baseURL: env[apiName].api_host });

    // initial response object
    let res = null;

    // initial path parameter
    let path = event.queryStringParameters.path;
    // remove path parameter (if exist) before setup query string parameters
    if (path) {
      delete event.queryStringParameters.path;
    }

    // initial params parameter
    let params = null;

    // seperate each api
    switch (apiName && apiName.startsWith('subgraph_') ? _.head(apiName.split('_')) : apiName) {
      case 'subgraph':
        // normalize path parameter
        path = path || '';
        // setup query string parameters
        params = { ...event.queryStringParameters };
        // send request
        res = await requester.post(path, { ...params })
          // set response data from error handled by exception
          .catch(error => { return { data: { error } }; });
        break;
      case 'coingecko':
        // normalize path parameter
        path = path || '';
        // setup query string parameters
        params = { ...event.queryStringParameters };

        // send request
        res = await requester.get(path, { params })
          // set response data from error handled by exception
          .catch(error => { return { data: { error } }; });
        break;
      case 'covalent':
        // normalize path parameter
        path = path || '';
        path = `${path}${!path.endsWith('/') ? '/' : ''}`;
        // setup query string parameters including API key
        params = { key: env[apiName].api_key, ...event.queryStringParameters };

        // send request
        res = await requester.get(path, { params })
          // set response data from error handled by exception
          .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });
        break;
      default: // do nothing
    }

    // set response data
    if (res && res.data) {
      response = res.data;

      // remove error config
      if (response.error && response.error.config) {
        delete response.error.config;
      }
    }
  }

  // return response data
  return response;
};