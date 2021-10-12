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
    cache_contracts: {
      api_host: process.env.DYNAMODB_API_HOST || '{YOUR_DYNAMODB_API_HOST}',
      table_name: process.env.DYNAMODB_CACHE_CONTRACTS_TABLE_NAME || '{YOUR_DYNAMODB_CACHE_CONTRACTS_TABLE_NAME}',
    },
    blockscout: {
      api_host: process.env.BLOCKSCOUT_API_HOST || 'https://blockscout.com/',
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

    // initial current time
    const time = moment();

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

        let resCache = null;
        let cacheId = null;
        let setCache = null;

        if (path?.startsWith('/pricing/historical_by_addresses_v2/')) {
          // initial cacher object
          const cacher = axios.create({ baseURL: env.cache_contracts.api_host });

          // get cache
          const getCache = async id => await cacher.get('', { params: { table_name: env.cache_contracts.table_name, method: 'get', ID: id } })
            .catch(error => { return { data: null }; });

          // set cache
          setCache = async data => await cacher.post('', { table_name: env.cache_contracts.table_name, method: 'put', ...data })
            .catch(error => { return { data: null }; });

          cacheId = _.last(path.split('/').filter(_path => _path));

          // get cache
          resCache = await getCache(cacheId);

          if (resCache?.data?.data?.Json && resCache.data.data.Expired > time.valueOf()) {
            res = { data: JSON.parse(resCache.data.data.Json) };
          }
        }

        if (!res) {
          // send request
          res = await requester.get(path, { params })
            // set response data from error handled by exception
            .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });
        }

        if (res.data) {
          if (path?.startsWith('/pricing/historical_by_addresses_v2/')) {
            const chain_id = Number(path.split('/').filter(_path => _path)[2]);
            const contract_addresses = _.last(path.split('/').filter(_path => _path))?.split(',') || [];

            if (chain_id === 100) {
              if (res.data.error) {
                const blockscouter = axios.create({ baseURL: env.blockscout.api_host });

                const data = [];

                for (let i = 0; i < contract_addresses.length; i++) {
                  const contract_address = contract_addresses[i];

                  path = '/xdai/mainnet/api';
                  params = { module: 'token', action: 'getToken', contractaddress: contract_address };

                  // send request
                  res = await blockscouter.get(path, { params })
                    // set response data from error handled by exception
                    .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });

                  if (res?.data?.result) {
                    const contract_data = res.data.result;

                    data.push({
                      contract_decimals: Number(contract_data.decimals),
                      contract_name: contract_data.name,
                      contract_ticker_symbol: contract_data.symbol,
                      contract_address: contract_data.contractAddress,
                      supports_erc: ['ERC-20'].includes(contract_data.type) ? ['erc20'] : [],
                      prices: ['usdt', 'usdc', 'dai'].includes(contract_data.symbol?.toLowerCase()) ? [{ price: 1 }] : null,
                    });
                  }
                  else if (contract_address === '0x0000000000000000000000000000000000000000') {
                    data.push({
                      contract_decimals: 18,
                      contract_name: 'xDai',
                      contract_ticker_symbol: 'XDAI',
                      contract_address,
                      prices: [{ price: 1 }],
                    });
                  }
                }

                res.data = { data };
              }
            }
            else if (chain_id === 42161) {
              if (res.data.data) {
                const data = res.data.data;

                for (let i = 0; i < contract_addresses.length; i++) {
                  const contract_address = contract_addresses[i];

                  if (['0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'].includes(contract_address)) {
                    const index = data.findIndex(contract => contract.contract_address === contract_address);
    
                    if (index > -1) {
                      data[index] = {
                        ...data[index],
                        prices: [{ price: 1 }],
                      };
                    }
                  }
                }

                res.data = { data };
              }
            }
          }
          else if (path?.endsWith('/balances_v2/')) {
            const chain_id = Number(path.split('/').filter(_path => _path)[0]);
            const address = path.split('/').filter(_path => _path)[2];

            if (chain_id === 100) {
              if (res.data.error) {
                const blockscouter = axios.create({ baseURL: env.blockscout.api_host });

                let data;

                path = '/xdai/mainnet/api';
                params = { module: 'account', action: 'tokenlist', address };

                // send request
                res = await blockscouter.get(path, { params })
                  // set response data from error handled by exception
                  .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });

                if (res?.data?.result) {
                  data = {
                    items: res.data.result.map(balance => {
                      return {
                        contract_decimals: Number(balance.decimals),
                        contract_name: balance.name,
                        contract_ticker_symbol: balance.symbol,
                        contract_address: balance.contractAddress,
                        supports_erc: ['ERC-20'].includes(balance.type) ? ['erc20'] : [],
                        type: 'cryptocurrency',
                        balance: balance.balance,
                        quote_rate: ['usdt', 'usdc', 'dai'].includes(balance.symbol?.toLowerCase()) ? 1 : null,
                        quote: ['usdt', 'usdc', 'dai'].includes(balance.symbol?.toLowerCase()) ? 1 * Number(balance.balance) / Math.pow(10, Number(balance.decimals)) : null,
                      };
                    }),
                  };
                }

                res.data = { data };
              }
            }
          }
        }

        if (cacheId && res?.data?.data && setCache) {
          // set cache
          await setCache({ ID: cacheId, Expired: moment(time).add(4, 'hours').valueOf(), Json: JSON.stringify(res.data) });
        }
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