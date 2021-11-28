/************************************************
 * This code is a function for request data from APIs.
 * Deploy on AWS Lambda (triggered by AWS API Gateway)
 ************************************************/
exports.handler = async (event, context, callback) => {
  // import module for submitting request.
  const axios = require('axios');

  // import modules
  const { contracts } = require('./data');
  const bridge_config = require('./bridge_config');
  const _ = require('lodash');
  const moment = require('moment');

  /************************************************
   * Internal API information for requesting data
   * You can setup these environment variables below on the AWS Lambda function's configuration.
   ************************************************/
  const env = {
    subgraph_eth: {
      api_host: process.env.SUBGRAPH_ETH_API_HOST || '{YOUR_SUBGRAPH_ETH_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_ETH_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_ETH_API_HOST_ANALYTIC}',
    },
    subgraph_bsc: {
      api_host: process.env.SUBGRAPH_BSC_API_HOST || '{YOUR_SUBGRAPH_BSC_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_BSC_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_BSC_API_HOST_ANALYTIC}',
      api_host_v0: process.env.SUBGRAPH_BSC_API_HOST_V0 || '{YOUR_SUBGRAPH_BSC_API_HOST_V0}',
    },
    subgraph_matic: {
      api_host: process.env.SUBGRAPH_MATIC_API_HOST || '{YOUR_SUBGRAPH_MATIC_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_MATIC_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MATIC_API_HOST_ANALYTIC}',
      api_host_v0: process.env.SUBGRAPH_MATIC_API_HOST_V0 || '{YOUR_SUBGRAPH_MATIC_API_HOST_V0}',
    },
    subgraph_arb: {
      api_host: process.env.SUBGRAPH_ARB_API_HOST || '{YOUR_SUBGRAPH_ARB_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_ARB_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_ARB_API_HOST_ANALYTIC}',
      api_host_v0: process.env.SUBGRAPH_ARB_API_HOST_V0 || '{YOUR_SUBGRAPH_ARB_API_HOST_V0}',
    },
    subgraph_opt: {
      api_host: process.env.SUBGRAPH_OPT_API_HOST || '{YOUR_SUBGRAPH_OPT_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_OPT_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_OPT_API_HOST_ANALYTIC}',
    },
    subgraph_avax: {
      api_host: process.env.SUBGRAPH_AVAX_API_HOST || '{YOUR_SUBGRAPH_AVAX_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_AVAX_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_AVAX_API_HOST_ANALYTIC}',
    },
    subgraph_ftm: {
      api_host: process.env.SUBGRAPH_FTM_API_HOST || '{YOUR_SUBGRAPH_FTM_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_FTM_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_FTM_API_HOST_ANALYTIC}',
      api_host_v0: process.env.SUBGRAPH_FTM_API_HOST_V0 || '{YOUR_SUBGRAPH_FTM_API_HOST_V0}',
    },
    subgraph_xdai: {
      api_host: process.env.SUBGRAPH_XDAI_API_HOST || '{YOUR_SUBGRAPH_XDAI_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_XDAI_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_XDAI_API_HOST_ANALYTIC}',
      api_host_v0: process.env.SUBGRAPH_XDAI_API_HOST_V0 || '{YOUR_SUBGRAPH_XDAI_API_HOST_V0}',
    },
    subgraph_movr: {
      api_host: process.env.SUBGRAPH_MOVR_API_HOST || '{YOUR_SUBGRAPH_MOVR_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_MOVR_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MOVR_API_HOST_ANALYTIC}',
    },
    subgraph_heco: {
      api_host: process.env.SUBGRAPH_HECO_API_HOST || '{YOUR_SUBGRAPH_HECO_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_HECO_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_HECO_API_HOST_ANALYTIC}',
    },
    subgraph_mbase: {
      api_host: process.env.SUBGRAPH_MBASE_API_HOST || '{YOUR_SUBGRAPH_MBASE_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_MBASE_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MBASE_API_HOST_ANALYTIC}',
    },
    subgraph_rop: {
      api_host: process.env.SUBGRAPH_ROP_API_HOST || '{YOUR_SUBGRAPH_ROP_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_ROP_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_ROP_API_HOST_ANALYTIC}',
    },
    subgraph_rin: {
      api_host: process.env.SUBGRAPH_RIN_API_HOST || '{YOUR_SUBGRAPH_RIN_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_RIN_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_RIN_API_HOST_ANALYTIC}',
    },
    subgraph_gor: {
      api_host: process.env.SUBGRAPH_GOR_API_HOST || '{YOUR_SUBGRAPH_GOR_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_GOR_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_GOR_API_HOST_ANALYTIC}',
    },
    subgraph_kov: {
      api_host: process.env.SUBGRAPH_KOV_API_HOST || '{YOUR_SUBGRAPH_KOV_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_KOV_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_KOV_API_HOST_ANALYTIC}',
    },
    subgraph_bsct: {
      api_host: process.env.SUBGRAPH_BSCT_API_HOST || '{YOUR_SUBGRAPH_BSCT_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_BSCT_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_BSCT_API_HOST_ANALYTIC}',
    },
    subgraph_mum: {
      api_host: process.env.SUBGRAPH_MUM_API_HOST || '{YOUR_SUBGRAPH_MUM_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_MUM_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MUM_API_HOST_ANALYTIC}',
    },
    subgraph_arbr: {
      api_host: process.env.SUBGRAPH_ARBR_API_HOST || '{YOUR_SUBGRAPH_ARBR_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_ARBR_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_ARBR_API_HOST_ANALYTIC}',
    },
    subgraph_optk: {
      api_host: process.env.SUBGRAPH_OPTK_API_HOST || '{YOUR_SUBGRAPH_OPTK_API_HOST}',
      api_host_analytic: process.env.SUBGRAPH_OPTK_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_OPTK_API_HOST_ANALYTIC}',
    },
    coingecko: {
      api_host: process.env.COINGECKO_API_HOST || 'https://api.coingecko.com/api/v3/',
    },
    covalent: {
      api_host: process.env.COVALENT_API_HOST || 'https://api.covalenthq.com/v1/',
      api_key: process.env.COVALENT_API_KEY || '{YOUR_COVALENT_API_KEY}',
      stable_threshold: Number(process.env.STABLE_THRESHOLD) || 0.05,
    },
    ens: {
      api_host: process.env.ENS_SUBGRAPH_API_HOST || '{YOUR_ENS_SUBGRAPH_API_HOST}',
    },
    cache_contracts: {
      api_host: process.env.DYNAMODB_API_HOST || '{YOUR_DYNAMODB_API_HOST}',
      table_name: process.env.DYNAMODB_CACHE_CONTRACTS_TABLE_NAME || '{YOUR_DYNAMODB_CACHE_CONTRACTS_TABLE_NAME}',
    },
    blockscout: {
      api_host: process.env.BLOCKSCOUT_API_HOST || 'https://blockscout.com/',
    },
    bridge_config: {},
  };

  // get logo
  const getLogoFromContract = (contract_address, chain_id) => contract_address ? contracts?.find(contract => contract.addresses.findIndex(address => address.contract_address === contract_address && (!address.chain_id || address.chain_id === chain_id)) > -1)?.logo_url : null;

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
    const apiVersion = event.queryStringParameters.api_version;
    // remove api_version parameter before setup query string parameters
    delete event.queryStringParameters.api_version;
    const apiType = event.queryStringParameters.api_type;
    // remove api_type parameter before setup query string parameters
    delete event.queryStringParameters.api_type;

    // initial requester object
    const requester = axios.create({ baseURL: env[apiName][`api_host${apiVersion ? `_${apiVersion}` : ''}${apiType ? `_${apiType}` : ''}`] });

    const coingecker = axios.create({ baseURL: env.coingecko.api_host });

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

          const chain_id = Number(path.split('/').filter(_path => _path)[2]);

          cacheId = `${chain_id}-${_.last(path.split('/').filter(_path => _path))}`;

          // get cache
          resCache = await getCache(cacheId);

          if (resCache?.data?.data?.Json && resCache.data.data.Expired > time.valueOf()) {
            res = { data: JSON.parse(resCache.data.data.Json) };
          }
          else {
            // set cache
            setCache = async data => await cacher.post('', { table_name: env.cache_contracts.table_name, method: 'put', ...data })
              .catch(error => { return { data: null }; });
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
                }

                res.data = { data };
              }
            }
            else if ([3, 4, 5, 69].includes(chain_id)) {
              if (res.data.error) {
                const data = [];

                for (let i = 0; i < contract_addresses.length; i++) {
                  const contract_address = contract_addresses[i];

                  data.push({
                    contract_decimals: 18,
                    contract_name: 'Test Token',
                    contract_ticker_symbol: 'TEST',
                    contract_address,
                    prices: [{ price: 1 }],
                  });
                }

                res.data = { data };
              }
            }
            else if ([42, 97, 80001, 421611].includes(chain_id)) {
              if (res.data.data) {
                const data = res.data.data;

                for (let i = 0; i < contract_addresses.length; i++) {
                  const contract_address = contract_addresses[i];

                  const index = data.findIndex(contract => contract.contract_address === contract_address);
  
                  if (index > -1 && contracts.flatMap(contract => contract.addresses.filter(_address => _address.contract_address === contract_address && _address.chain_id === chain_id && _address.coingecko_id)).length < 1) {
                    data[index] = {
                      ...data[index],
                      prices: data[index]?.prices?.[0]?.price ? data[index].prices : [{ price: 1 }],
                    };
                  }
                }

                res.data = { data };
              }
            }

            if (res?.data?.data) {
              const _contracts = contracts.flatMap(contract => contract.addresses.filter(_address => (!_address.chain_id || _address.chain_id === chain_id) && _address.coingecko_id).map(_address => { return { ..._address, is_stable: contract?.is_stable } }));
              for (let i = 0; i < _contracts.length; i++) {
                const _contract = _contracts[i];

                if (contract_addresses.includes(_contract.contract_address?.toLowerCase()) && (res.data.data.findIndex(contract => contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase()) < 0 || res.data.data.findIndex(contract => contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase() && (typeof contract?.prices?.[0]?.price !== 'number' || (_contract.is_stable && (Math.abs(contract?.prices?.[0]?.price - 1) > env.covalent.stable_threshold)))) > -1)) {
                  // send request
                  const resCoin = await coingecker.get(`/coins/${_contract.coingecko_id}`)
                    // set response data from error handled by exception
                    .catch(error => { return { data: { error } }; });

                  if (typeof resCoin?.data?.market_data?.current_price?.usd === 'number') {
                    if (res.data.data.findIndex(contract => contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase()) > -1) {
                      res.data.data = res.data.data.map(contract => {
                        if (contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase()) {
                          contract = {
                            ...contract,
                            ..._contract,
                            prices: [{ price: resCoin.data.market_data.current_price.usd }],
                            logo_url: resCoin.data.image?.large || resCoin.image?.thumb,
                            contract_name: resCoin.data.name || _contract.contract_name || contract.contract_name,
                            contract_ticker_symbol: resCoin.data.symbol?.toUpperCase() || _contract.contract_ticker_symbol || contract.contract_ticker_symbol,
                          };
                        }

                        return contract;
                      });
                    }
                    else {
                      res.data.data.push({
                        ..._contract,
                        prices: [{ price: resCoin.data.market_data.current_price.usd }],
                        logo_url: resCoin.data.image?.large || resCoin.image?.thumb,
                        contract_name: resCoin.data.name || _contract.contract_name,
                        contract_ticker_symbol: resCoin.data.symbol?.toUpperCase() || _contract.contract_ticker_symbol,
                      });
                    }
                  }
                }
              }

              res.data.data = res.data.data.map(contract => {
                return {
                  ...contract,
                  logo_url: _.uniq(_.concat(getLogoFromContract(contract?.contract_address, chain_id), contract?.logo_url).filter(url => url)),
                };
              });
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

                params = { module: 'account', action: 'balance', address };

                // send request
                res = await blockscouter.get(path, { params })
                  // set response data from error handled by exception
                  .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });

                if (res?.data?.result) {
                  data = {
                    items: _.concat(data?.items || [], [res.data.result].map(balance => {
                      return {
                        contract_decimals: 18,
                        contract_name: 'xDai',
                        contract_ticker_symbol: 'xDAI',
                        contract_address: '0x0000000000000000000000000000000000000000',
                        supports_erc: ['erc20'],
                        type: 'cryptocurrency',
                        balance: Number(balance),
                        quote_rate: 1,
                        quote: 1 * Number(balance) / Math.pow(10, 18),
                      };
                    })),
                  };
                }

                res.data = { data };
              }
            }
            else if ([42, 97, 80001, 421611].includes(chain_id)) {
              if (res.data.data?.items) {
                const data = res.data.data.items;

                for (let i = 0; i < data.length; i++) {
                  const balance = data[i];

                  if (balance?.contract_address && contracts.flatMap(contract => contract.addresses.filter(_address => _address.contract_address === balance?.contract_address && _address.chain_id === chain_id && _address.coingecko_id)).length < 1) {
                    data[i] = {
                      ...balance,
                      quote_rate: balance.quote_rate || 1,
                      quote: balance.quote ||(1 * Number(balance.balance) / Math.pow(10, Number(balance.contract_decimals))),
                    };
                  }
                }

                res.data = { data: { items: data } };
              }
            }

            if (res?.data?.data?.items) {
              const _contracts = contracts.flatMap(contract => contract.addresses.filter(_address => (!_address.chain_id || _address.chain_id === chain_id) && _address.coingecko_id).map(_address => { return { ..._address, is_stable: contract?.is_stable } }));
              for (let i = 0; i < _contracts.length; i++) {
                const _contract = _contracts[i];

                if (res.data.data.items.findIndex(balance => balance?.contract_address === _contract.contract_address && typeof balance?.quote_rate !== 'number' || (_contract.is_stable && (Math.abs(balance?.quote_rate - 1) > env.covalent.stable_threshold))) > -1) {
                  // send request
                  const resCoin = await coingecker.get(`/coins/${_contract.coingecko_id}`)
                    // set response data from error handled by exception
                    .catch(error => { return { data: { error } }; });

                  if (typeof resCoin?.data?.market_data?.current_price?.usd === 'number') {
                    res.data.data.items = res.data.data.items.map(balance => {
                      if (balance?.contract_address === _contract.contract_address) {
                        balance = {
                          ...balance,
                          quote_rate: resCoin.data.market_data.current_price.usd,
                          quote: resCoin.data.market_data.current_price.usd * Number(balance.balance) / Math.pow(10, Number(balance.contract_decimals || _contract.contract_decimals)),
                          logo_url: resCoin.data.image?.large || resCoin.image?.thumb,
                          contract_name: resCoin.data.name || _contract.contract_name || balance.contract_name,
                          contract_ticker_symbol: resCoin.data.symbol?.toUpperCase() || _contract.contract_ticker_symbol || balance.contract_ticker_symbol,
                        };
                      }

                      return balance;
                    });
                  }
                }
              }

              res.data.data.items = res.data.data.items.map(balance => {
                return {
                  ...balance,
                  logo_url: _.uniq(_.concat(getLogoFromContract(balance?.contract_address, chain_id), balance?.logo_url).filter(url => url)),
                };
              });
            }
          }
        }

        if (cacheId && res?.data?.data && setCache) {
          // set cache
          await setCache({ ID: cacheId, Expired: moment(time).add(4, 'hours').valueOf(), Json: JSON.stringify(res.data) });
        }
        break;
      case 'ens':
        // normalize path parameter
        path = path || '';
        // setup query string parameters
        params = { ...event.queryStringParameters };
        // send request
        res = await requester.post(path, { ...params })
          // set response data from error handled by exception
          .catch(error => { return { data: { error } }; });
        break;
      case 'bridge_config':
        res = { data: bridge_config[`${event.queryStringParameters.class}${event.queryStringParameters.network ? `_${event.queryStringParameters.network}` : ''}`] };

        if (event.queryStringParameters.class === 'chains') {
          if (res?.data) {
            res.data = res.data.map(_chain => { return { ..._chain, subgraph: [env[`subgraph_${_chain.id}`]?.api_host] } });
          }
        }
      default: // do nothing
    }

    // set response data
    if (res?.data) {
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