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
  const AWS = require('aws-sdk');

  // data
  const crosschain_config = require('./crosschain_config');
  const bridge_config = require('./bridge_config');

  const { contracts } = require('./data');

  /************************************************
   * Internal API information for requesting data
   * You can setup these environment variables below on the AWS Lambda function's configuration.
   ************************************************/
  const env = {
    network: process.env.NETWORK || 'testnet',
    subgraph: {
      1: {
        api_host: process.env.SUBGRAPH_ETH_API_HOST || '{YOUR_SUBGRAPH_ETH_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_ETH_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_ETH_API_HOST_ANALYTIC}',
      },
      56: {
        api_host: process.env.SUBGRAPH_BSC_API_HOST || '{YOUR_SUBGRAPH_BSC_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_BSC_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_BSC_API_HOST_ANALYTIC}',
        api_host_v0: process.env.SUBGRAPH_BSC_API_HOST_V0 || '{YOUR_SUBGRAPH_BSC_API_HOST_V0}',
      },
      137: {
        api_host: process.env.SUBGRAPH_MATIC_API_HOST || '{YOUR_SUBGRAPH_MATIC_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_MATIC_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MATIC_API_HOST_ANALYTIC}',
        api_host_v0: process.env.SUBGRAPH_MATIC_API_HOST_V0 || '{YOUR_SUBGRAPH_MATIC_API_HOST_V0}',
      },
      42161: {
        api_host: process.env.SUBGRAPH_ARB_API_HOST || '{YOUR_SUBGRAPH_ARB_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_ARB_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_ARB_API_HOST_ANALYTIC}',
        api_host_v0: process.env.SUBGRAPH_ARB_API_HOST_V0 || '{YOUR_SUBGRAPH_ARB_API_HOST_V0}',
      },
      10: {
        api_host: process.env.SUBGRAPH_OPT_API_HOST || '{YOUR_SUBGRAPH_OPT_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_OPT_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_OPT_API_HOST_ANALYTIC}',
      },
      43114: {
        api_host: process.env.SUBGRAPH_AVAX_API_HOST || '{YOUR_SUBGRAPH_AVAX_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_AVAX_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_AVAX_API_HOST_ANALYTIC}',
      },
      250: {
        api_host: process.env.SUBGRAPH_FTM_API_HOST || '{YOUR_SUBGRAPH_FTM_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_FTM_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_FTM_API_HOST_ANALYTIC}',
        api_host_v0: process.env.SUBGRAPH_FTM_API_HOST_V0 || '{YOUR_SUBGRAPH_FTM_API_HOST_V0}',
      },
      100: {
        api_host: process.env.SUBGRAPH_XDAI_API_HOST || '{YOUR_SUBGRAPH_XDAI_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_XDAI_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_XDAI_API_HOST_ANALYTIC}',
        api_host_v0: process.env.SUBGRAPH_XDAI_API_HOST_V0 || '{YOUR_SUBGRAPH_XDAI_API_HOST_V0}',
      },
      1284: {
        api_host: process.env.SUBGRAPH_MBEAM_API_HOST || '{YOUR_SUBGRAPH_MBEAM_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_MBEAM_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MBEAM_API_HOST_ANALYTIC}',
      },
      1285: {
        api_host: process.env.SUBGRAPH_MOVR_API_HOST || '{YOUR_SUBGRAPH_MOVR_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_MOVR_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MOVR_API_HOST_ANALYTIC}',
      },
      122: {
        api_host: process.env.SUBGRAPH_FUSE_API_HOST || '{YOUR_SUBGRAPH_FUSE_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_FUSE_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_FUSE_API_HOST_ANALYTIC}',
      },
      3: {
        api_host: process.env.SUBGRAPH_ROP_API_HOST || '{YOUR_SUBGRAPH_ROP_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_ROP_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_ROP_API_HOST_ANALYTIC}',
      },
      4: {
        api_host: process.env.SUBGRAPH_RIN_API_HOST || '{YOUR_SUBGRAPH_RIN_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_RIN_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_RIN_API_HOST_ANALYTIC}',
      },
      5: {
        api_host: process.env.SUBGRAPH_GOR_API_HOST || '{YOUR_SUBGRAPH_GOR_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_GOR_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_GOR_API_HOST_ANALYTIC}',
      },
      42: {
        api_host: process.env.SUBGRAPH_KOV_API_HOST || '{YOUR_SUBGRAPH_KOV_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_KOV_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_KOV_API_HOST_ANALYTIC}',
      },
      97: {
        api_host: process.env.SUBGRAPH_BSCT_API_HOST || '{YOUR_SUBGRAPH_BSCT_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_BSCT_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_BSCT_API_HOST_ANALYTIC}',
      },
      80001: {
        api_host: process.env.SUBGRAPH_MUM_API_HOST || '{YOUR_SUBGRAPH_MUM_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_MUM_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MUM_API_HOST_ANALYTIC}',
      },
      421611: {
        api_host: process.env.SUBGRAPH_ARBR_API_HOST || '{YOUR_SUBGRAPH_ARBR_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_ARBR_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_ARBR_API_HOST_ANALYTIC}',
      },
      69: {
        api_host: process.env.SUBGRAPH_OPTK_API_HOST || '{YOUR_SUBGRAPH_OPTK_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_OPTK_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_OPTK_API_HOST_ANALYTIC}',
      },
      1287: {
        api_host: process.env.SUBGRAPH_MBASE_API_HOST || '{YOUR_SUBGRAPH_MBASE_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_MBASE_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MBASE_API_HOST_ANALYTIC}',
      },
    },
    tokens: {
      currency: 'usd',
      stable_threshold: Number(process.env.STABLE_THRESHOLD) || 0.005,
    },
    opensearcher: {
      api_host: process.env.OPENSEARCHER_API_HOST || '{YOUR_OPENSEARCHER_API_HOST}',
    },
    coingecko: {
      api_host: process.env.COINGECKO_API_HOST || 'https://api.coingecko.com/api/v3/',
    },
    ens: {
      api_host: process.env.ENS_SUBGRAPH_API_HOST || '{YOUR_ENS_SUBGRAPH_API_HOST}',
    },
    covalent: {
      api_host: process.env.COVALENT_API_HOST || 'https://api.covalenthq.com/v1/',
      api_key: process.env.COVALENT_API_KEY || '{YOUR_COVALENT_API_KEY}',
    },
    blockscout: {
      api_host: process.env.BLOCKSCOUT_API_HOST || 'https://blockscout.com/',
    },
    blockscout_moonbeam: {
      api_host: process.env.BLOCKSCOUT_MOONBEAM_API_HOST || 'https://blockscout.moonbeam.network/',
    },
    blockscout_fuse: {
      api_host: process.env.BLOCKSCOUT_FUSE_API_HOST || 'https://explorer.fuse.io/',
    },
    crosschain_config: {},
    bridge_config: {
      git_repo: process.env.BRIDGE_CONFIG_GIT_REPO || 'CoinHippo-Labs/connext-network-xpollinate',
      s3_url: process.env.BRIDGE_CONFIG_S3_URL || 'https://s3.us-west-1.amazonaws.com',
      s3_bucket: process.env.BRIDGE_CONFIG_S3_BUCKET || 'config.xpollinate.connext.network',
    },

    cache_contracts: {
      api_host: process.env.DYNAMODB_API_HOST || 'https://d66d5igy57.execute-api.us-west-1.amazonaws.com/default/connext-dynamodb-testnet',
      table_name: process.env.DYNAMODB_CACHE_CONTRACTS_TABLE_NAME || 'connext-contracts-testnet',
    },
  };

  // aws s3
  AWS.config.update({
    accessKeyId: process.env.BRIDGE_CONFIG_AWS_ACCESS_KEY_ID || '{YOUR_BRIDGE_CONFIG_AWS_ACCESS_KEY_ID}',
    secretAccessKey: process.env.BRIDGE_CONFIG_AWS_SECRET_ACCESS_KEY || '{YOUR_BRIDGE_CONFIG_AWS_SECRET_ACCESS_KEY}',
    region: process.env.BRIDGE_CONFIG_AWS_REGION || 'us-west-1',
  });
  const s3 = new AWS.S3();

  // response data variable
  let response = null;

  // check module parameter exist
  if (Object.keys(env).indexOf(event.queryStringParameters?.module?.trim().toLowerCase()) > -1) {
    // normalize module parameter
    const _module = event.queryStringParameters.module.trim().toLowerCase();
    // remove module parameter before setup query string parameters
    delete event.queryStringParameters.module;

    const chainId = Number(event.queryStringParameters.chain_id);
    if (['subgraph'].includes(_module)) {
      // remove chain_id parameter before setup query string parameters
      delete event.queryStringParameters.chain_id;
    }

    const apiVersion = event.queryStringParameters.api_version;
    // remove api_version parameter before setup query string parameters
    delete event.queryStringParameters.api_version;

    const apiType = event.queryStringParameters.api_type;
    // remove api_type parameter before setup query string parameters
    delete event.queryStringParameters.api_type;

    // initial request object
    const requester = axios.create({ baseURL: ['subgraph'].includes(_module) ? env[_module][chainId]?.[`api_host${apiVersion ? `_${apiVersion}` : ''}${apiType ? `_${apiType}` : ''}`] : env[_module].api_host });
    const opensearcher = axios.create({ baseURL: env.opensearcher.api_host });
    const coingecker = axios.create({ baseURL: env.coingecko.api_host });
    const covalentor = axios.create({ baseURL: env.covalent.api_host });
    const blockscouter = axios.create({ baseURL: env.blockscout.api_host });
    const blockscouter_moonbeam = axios.create({ baseURL: env.blockscout_moonbeam.api_host });
    const blockscouter_fuse = axios.create({ baseURL: env.blockscout_fuse.api_host });

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
    switch (_module) {
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
      case 'tokens':
        // normalize path parameter
        path = path || '';
        // setup query string parameters
        params = { ...event.queryStringParameters };

        const assets = crosschain_config[`assets_${env.network}`];
        const index_name = `tokens${['testnet'].includes(env.network) ? `_${env.network}` : ''}`;
        const addresses = _.uniq((params.addresses || params.address)?.split(',').map(a => a?.trim().toLowerCase()).filter(a => a) || []);
        const date = params.date;

        if (chainId && addresses.length > 0) {
          const query = {
            bool: {
              must: [
                { match: { chain_id: chainId } },
              ],
              should: addresses.map(a => {
                return {
                  match: { contract_address: a },
                }
              }),
            },
          };

          const resCache = !date && await opensearcher.post('', { index: index_name, method: 'search', query, size: addresses.length })
            .catch(error => { return { data: { error } }; });

          const data = addresses.map(a => { return { chain_id: chainId, contract_address: a } });

          if (resCache?.data?.hits?.hits) {
            resCache.data.hits.hits.map(t => t?._source).filter(t => t).forEach(t => {
              if (data.findIndex(d => d.contract_address === t?.contract_address) > -1) {
                data[data.findIndex(d => d.contract_address === t?.contract_address)] = { ...t };
              }
            });
          }

          let toUpdateData = data.filter(d => !d?.updated_at || d.updated_at < time.subtract(1, 'hours'));

          const coingeckoIds = toUpdateData.map(d => assets?.find(a => a?.contracts?.findIndex(c => c?.chain_id === chainId && c.contract_address === d.contract_address) > -1 && a.coingecko_id)?.coingecko_id).filter(id => id);

          if (coingeckoIds.length > 0) {
            if (date) {
              for (let i = 0; i < coingeckoIds.length; i++) {
                // send request
                const resTokens = await coingecker.get(`/coins/${coingeckoIds[i]}/history`, { params: { id: coingeckoIds[i], date: moment(Number(date)).format('DD-MM-YYYY'), localization: 'false' } })
                  // set response data from error handled by exception
                  .catch(error => { return { data: { error } }; });

                if (resTokens?.data) {
                  [resTokens.data].map(t => {
                    const asset = assets?.find(a => a?.coingecko_id === t?.id);
                    const contract = asset?.contracts?.find(c => c?.chain_id === chainId);
                    const symbol = contract?.symbol || asset?.symbol || t?.symbol?.toUpperCase();
                    let price = t?.market_data?.current_price?.[env[_module].currency];
                    price = asset?.is_stable && Math.abs(price - 1) > env[_module].stable_threshold ? 1 : price;

                    return {
                      ...contract,
                      chain_id: chainId,
                      name: contract?.name || asset?.name || t?.name || symbol,
                      symbol,
                      image: contract?.image || asset?.image || t?.image?.thumb,
                      price,
                    };
                  }).forEach(t => {
                    if (data.findIndex(d => d.contract_address === t?.contract_address) > -1) {
                      const index = data.findIndex(d => d.contract_address === t?.contract_address);
                      const d = data[index];
                      data[index] = { ...d, ...t };
                    }
                  });
                }
              }
            }
            else {
              // send request
              const resTokens = await coingecker.get('/coins/markets', { params: { vs_currency: env[_module].currency, ids: coingeckoIds.join(','), per_page: 250 } })
                // set response data from error handled by exception
                .catch(error => { return { data: { error } }; });

              if (resTokens?.data?.length > 0) {
                resTokens.data.map(t => {
                  const asset = assets?.find(a => a?.coingecko_id === t?.id);
                  const contract = asset?.contracts?.find(c => c?.chain_id === chainId);
                  const symbol = contract?.symbol || asset?.symbol || t?.symbol?.toUpperCase();
                  let price = t?.current_price;
                  price = asset?.is_stable && Math.abs(price - 1) > env[_module].stable_threshold ? 1 : price;

                  return {
                    ...contract,
                    chain_id: chainId,
                    name: contract?.name || asset?.name || t?.name || symbol,
                    symbol,
                    image: contract?.image || asset?.image || t?.image,
                    price,
                  };
                }).forEach(t => {
                  if (data.findIndex(d => d.contract_address === t?.contract_address) > -1) {
                    const index = data.findIndex(d => d.contract_address === t?.contract_address);
                    const d = data[index];
                    data[index] = { ...d, ...t };
                  }
                });
              }
            }
          }

          toUpdateData = toUpdateData.filter(d => data.findIndex(_d => _d?.contract_address === d?.contract_address && !('symbol' in _d)) > -1);
        
          const contractAddresses = toUpdateData.map(d => d?.contract_address).filter(a => a);

          if (contractAddresses.length > 0) {
            let bs, bsPath;

            switch (chainId) {
              case 100:
                if (!bs) {
                  bs = blockscouter;
                  bsPath = '/xdai/mainnet/api';
                }
              case 1284:
                if (!bs) {
                  bs = blockscouter_moonbeam;
                  bsPath = '/api';
                }
              case 122:
                if (!bs) {
                  bs = blockscouter_fuse;
                  bsPath = '/api';
                }

                for (let i = 0; i < contractAddresses.length; i++) {
                  params = { module: 'token', action: 'getToken', contractaddress: contractAddresses[i] };

                  // send request
                  res = await bs.get(bsPath, { params })
                    // set response data from error handled by exception
                    .catch(error => { return { data: { result: null, error: true, error_message: error.message, error_code: error.code } }; });

                  if (res?.data?.result) {
                    let t = res.data.result;
                    const asset = assets?.find(a => a?.contracts?.find(c => c?.chain_id === chainId && c?.contract_address === t?.contractAddress?.toLowerCase()));
                    const contract = asset?.contracts?.find(c => c?.chain_id === chainId);
                    const symbol = contract?.symbol || asset?.symbol || t?.symbol;
                    let price = asset?.is_stable ? 1 : null;
                    price = asset?.is_stable && Math.abs(price - 1) > env[_module].stable_threshold ? 1 : price;

                    t = {
                      ...contract,
                      chain_id: chainId,
                      contract_address: contract?.contract_address || t?.contractAddress?.toLowerCase(),
                      contract_decimals: contract?.contract_decimals || Number(t?.decimals),
                      name: contract?.name || asset?.name || t?.name || symbol,
                      symbol,
                      image: contract?.image || asset?.image,
                      price,
                    };

                    if (data.findIndex(d => d.contract_address === t?.contract_address) > -1) {
                      const index = data.findIndex(d => d.contract_address === t?.contract_address);
                      const d = data[index];
                      data[index] = { ...d, ...t };
                    }
                  }
                }
                break;
              case 3:
              case 4:
              case 5:
              case 69:
                for (let i = 0; i < data.length; i++) {
                  if (!('symbol' in data[i])) {
                    data[i] = {
                      ...data[i],
                      chain_id: chainId,
                      contract_decimals: 18,
                      name: 'Test Token',
                      symbol: 'TEST',
                      price: 1,
                    };
                  }
                }
                break;
              default:
                params = { key: env.covalent.api_key };
                if (date) {
                  params.from = moment(Number(date)).format('YYYY-MM-DD');
                  params.to = moment(Number(date)).format('YYYY-MM-DD');
                }

                // send request
                const resTokens = await covalentor.get(`/pricing/historical_by_addresses_v2/${chainId}/${env[_module].currency}/${contractAddresses.join(',')}/`, { params })
                  // set response data from error handled by exception
                  .catch(error => { return { data: { error } }; });

                if (resTokens?.data?.data?.length > 0) {
                  resTokens.data.data.map(t => {
                    const asset = assets?.find(a => a?.contracts?.find(c => c?.chain_id === chainId && c?.contract_address === t?.contract_address?.toLowerCase()));
                    const contract = asset?.contracts?.find(c => c?.chain_id === chainId);
                    const symbol = contract?.symbol || asset?.symbol || t?.contract_ticker_symbol;
                    let price = t?.prices?.[0]?.price;
                    price = asset?.is_stable && Math.abs(price - 1) > env[_module].stable_threshold ? 1 : price;

                    return {
                      ...contract,
                      chain_id: chainId,
                      contract_address: contract?.contract_address || t?.contract_address?.toLowerCase(),
                      contract_decimals: contract?.contract_decimals || t?.contract_decimals,
                      name: contract?.name || asset?.name || t?.contract_name || symbol,
                      symbol,
                      image: contract?.image || asset?.image || t?.logo_url,
                      price,
                    };
                  }).forEach(t => {
                    if (data.findIndex(d => d.contract_address === t?.contract_address) > -1) {
                      const index = data.findIndex(d => d.contract_address === t?.contract_address);
                      const d = data[index];
                      data[index] = { ...d, ...t };
                    }
                  });
                }
            }
          }

          const toUpdateCache = !date && data.filter(d => (!d?.updated_at || d.updated_at < time.subtract(1, 'hours')) && 'symbol' in d);

          if (toUpdateCache?.length > 0) {
            toUpdateCache.forEach(d => {
              const id = `${d?.chain_id || chainId}_${d?.contract_address?.toLowerCase()}`;

              // send request
              opensearcher.post('', { index: index_name, method: 'update', path: `/tokens/_update/${id}`, id, ...d })
                // set response data from error handled by exception
                .catch(error => { return { data: { error } }; });
            });
          }

          res = { data: { data } };
        }
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
      case 'crosschain_config':
        res = { data: crosschain_config[event.queryStringParameters.collection] };
        break;
      case 'bridge_config':
        // normalize path parameter
        path = path || '';
        // setup query string parameters
        params = { ...event.queryStringParameters };

        if (path === '/set') {
          if (['announcement'].includes(params.collection)) {
            try {
              const data = JSON.stringify({ data: params.data });

              res = {
                data: await new Promise(resolve =>
                  s3.putObject({
                    Bucket: env.bridge_config.s3_bucket,
                    Key: `${params.collection}${params.network ? `_${params.network}` : ''}.json`,
                    Body: data,
                    ACL: 'private'
                  }, (err, data) => resolve(data?.Body ? data.Body.toString() : null))
                ),
              };
            } catch (error) {}
          }
        }
        else {
          if (['announcement'].includes(params.collection)) {
            const s3_url = `${env.bridge_config.s3_url}/${env.bridge_config.s3_bucket}/${params.collection}${params.network ? `_${params.network}` : ''}.json`;

            try {
              res = await axios.get(s3_url);
            } catch (error) {
              res = null;
            }
          }
          else {
            const git_url = `https://raw.githubusercontent.com/${env.bridge_config.git_repo}/main/config/${params.collection}${['testnet'].includes(params.network) ? `_${params.network}` : ''}.json`;

            try {
              res = await axios.get(git_url);
            } catch (error) {
              res = null;
            }

            if (!res?.data) {
              res = { data: bridge_config[`${params.collection}${params.network ? `_${params.network}` : ''}`] };
            }
          }
        }
        break;

      case 'covalent':
        // normalize path parameter
        path = path || '';
        path = `${path}${!path.endsWith('/') ? '/' : ''}`;
        // setup query string parameters including API key
        params = { key: env[_module].api_key, ...event.queryStringParameters };

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

          let contract_addresses = _.last(path.split('/').filter(_path => _path));
          if (contract_addresses) {
            contract_addresses = _.orderBy(contract_addresses.split(',').map(address => { return { address } }), ['address'], ['asc']).map(address => address?.address).join(',');
          }

          cacheId = `${chain_id}-${contract_addresses}`;

          // get cache
          resCache = !params?.to && await getCache(cacheId);

          if (resCache?.data?.data?.Json && resCache.data.data.Expired > time.valueOf()) {
            res = { data: JSON.parse(resCache.data.data.Json) };
          }
          else if (!params?.to) {
            // set cache
            setCache = async data => await cacher.post('', { table_name: env.cache_contracts.table_name, method: 'put', ...data })
              .catch(error => { return { data: null }; });
          }
        }

        if (!res) {
          const chain_id = Number(path.split('/').filter(_path => _path)[2]);
          const contract_addresses = _.last(path.split('/').filter(_path => _path))?.split(',') || [];

          const is_unsupported_chains = [100, 1284, 122].includes(chain_id);

          if (is_unsupported_chains || (path?.startsWith('/pricing/historical_by_addresses_v2/') && params?.to && (
            path?.includes('/0x0000000000000000000000000000000000000000') ||
            contracts.findIndex(contract => contract.addresses.findIndex(_address => (!_address.chain_id || _address.chain_id === chain_id) && contract_addresses?.includes(_address.contract_address) && _address.coingecko_id) > -1) > -1
          ))) {
            res = { data: { data: [], error: is_unsupported_chains } };
          }
          else {
            // send request
            res = await requester.get(path, { params })
              // set response data from error handled by exception
              .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });
          }
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
            else if (chain_id === 1284) {
              if (res.data.error) {
                const data = [];

                for (let i = 0; i < contract_addresses.length; i++) {
                  const contract_address = contract_addresses[i];

                  path = '/api';
                  params = { module: 'token', action: 'getToken', contractaddress: contract_address };

                  // send request
                  res = await blockscouter_moonbeam.get(path, { params })
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

            if ((params?.to || [122].includes(chain_id)) && !res?.data?.data) {
              res = { data: { data: [] } };
            }

            if (res?.data?.data) {
              const _contracts = contracts.flatMap(contract => contract.addresses.filter(_address => (!_address.chain_id || _address.chain_id === chain_id) && _address.coingecko_id).map(_address => { return { ..._address, is_stable: contract?.is_stable } }));
              for (let i = 0; i < _contracts.length; i++) {
                const _contract = _contracts[i];

                if (_contract?.is_stable) {
                  const index = res.data.data.findIndex(contract => contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase());

                  if (index > -1) {
                    res.data.data[index] = {
                      ...res.data.data[index],
                      prices: [{ price: 1, date: params?.to }],
                    };
                  }
                }

                if (contract_addresses.includes(_contract.contract_address?.toLowerCase()) && (res.data.data.findIndex(contract => contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase()) < 0 || res.data.data.findIndex(contract => contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase() && (typeof contract?.prices?.[0]?.price !== 'number' || (_contract.is_stable && (Math.abs(contract?.prices?.[0]?.price - 1) > env.tokens.stable_threshold)))) > -1)) {
                  // send request
                  const resCoin = await coingecker.get(`/coins/${_contract.coingecko_id}${params?.to ? '/history' : ''}`, params?.to ? { params: { date: _.reverse(params.to.split('-')).join('-'), localization: 'false' } } : null)
                    // set response data from error handled by exception
                    .catch(error => { return { data: { error } }; });

                  if (typeof resCoin?.data?.market_data?.current_price?.usd === 'number') {
                    if (res.data.data.findIndex(contract => contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase()) > -1) {
                      res.data.data = res.data.data.map(contract => {
                        if (contract.contract_address?.toLowerCase() === _contract.contract_address?.toLowerCase()) {
                          contract = {
                            ...contract,
                            ..._contract,
                            prices: [{ price: resCoin.data.market_data.current_price.usd, date: params?.to }],
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
                        prices: [{ price: resCoin.data.market_data.current_price.usd, date: params?.to }],
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
            else if (chain_id === 1284) {
              if (res.data.error) {
                const blockscouter = axios.create({ baseURL: env.blockscout_mbeam.api_host });

                let data;

                path = '/api';
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
                        contract_name: 'Glimmer',
                        contract_ticker_symbol: 'GLMR',
                        contract_address: '0x0000000000000000000000000000000000000000',
                        supports_erc: ['erc20'],
                        type: 'cryptocurrency',
                        balance: Number(balance),
                        quote_rate: null,
                        quote: null * Number(balance) / Math.pow(10, 18),
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

                if (res.data.data.items.findIndex(balance => balance?.contract_address === _contract.contract_address && typeof balance?.quote_rate !== 'number' || (_contract.is_stable && (Math.abs(balance?.quote_rate - 1) > env.tokens.stable_threshold))) > -1) {
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
      default: // do nothing
    }

    // set response data
    if (res?.data) {
      response = res.data;

      // remove error config
      if (response.error?.config) {
        delete response.error.config;
      }
    }
  }

  // return response data
  return response;
};