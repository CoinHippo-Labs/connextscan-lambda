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
  const BigNumber = require('bignumber.js');

  BigNumber.config({ DECIMAL_PLACES: Number(40), EXPONENTIAL_AT: [-7, Number(40)] });

  // data
  const crosschain_config = require('./crosschain_config');
  const bridge_config = require('./bridge_config');

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
      2001: {
        api_host: process.env.SUBGRAPH_MMEDA_API_HOST  || '{YOUR_SUBGRAPH_MMEDA_API_HOST  }',
        api_host_analytic: process.env.SUBGRAPH_MMEDA_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_MMEDA_API_HOST_ANALYTIC}',
      },
      288: {
        api_host: process.env.SUBGRAPH_BOBA_API_HOST || '{YOUR_SUBGRAPH_BOBA_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_BOBA_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_BOBA_API_HOST_ANALYTIC}',
      },
      1666600000: {
        api_host: process.env.SUBGRAPH_HARMONY_API_HOST || '{YOUR_SUBGRAPH_HARMONY_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_HARMONY_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_HARMONY_API_HOST_ANALYTIC}',
      },
      192837465: {
        api_host: process.env.SUBGRAPH_GTH_API_HOST || '{YOUR_SUBGRAPH_GTH_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_GTH_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_GTH_API_HOST_ANALYTIC}',
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
      2221: {
        api_host: process.env.SUBGRAPH_KAVAA_API_HOST || '{YOUR_SUBGRAPH_KAVAA_API_HOST}',
        api_host_analytic: process.env.SUBGRAPH_KAVAA_API_HOST_ANALYTIC || '{YOUR_SUBGRAPH_KAVAA_API_HOST_ANALYTIC}',
      },
    },
    tokens: {
      currency: 'usd',
      stable_threshold: Number(process.env.STABLE_THRESHOLD) || 0.005,
    },
    requester: {
      api_host: process.env.REQUESTER_API_HOST || '{YOUR_REQUESTER_API_HOST}',
    },
    opensearcher: {
      api_host: process.env.OPENSEARCHER_API_HOST || '{YOUR_OPENSEARCHER_API_HOST}',
    },
    coingecko: {
      api_host: process.env.COINGECKO_API_HOST || 'https://api.coingecko.com/api/v3/',
    },
    ens: {
      api_host: process.env.ENS_SUBGRAPH_API_HOST || 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
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
    blockscout_milkomeda: {
      api_host: process.env.BLOCKSCOUT_MILKOMEDA_API_HOST || 'https://rpc.c1.milkomeda.com:4000/',
    },
    blockscout_boba: {
      api_host: process.env.BLOCKSCOUT_BOBA_API_HOST || 'https://blockexplorer.boba.network/',
    },
    blockscout_gather: {
      api_host: process.env.BLOCKSCOUT_GTH_API_HOST || 'https://explorer.gather.network/',
    },
    blockscout_kava_alpha: {
      api_host: process.env.BLOCKSCOUT_KAVA_ALPHA_API_HOST || 'https://explorer.evm-alpha.kava.io/',
    },
    crosschain_config: {},
    bridge_config: {
      git_repo: process.env.BRIDGE_CONFIG_GIT_REPO || 'CoinHippo-Labs/connext-bridge',
      s3_url: process.env.BRIDGE_CONFIG_S3_URL || 'https://s3.us-west-1.amazonaws.com',
      s3_bucket: process.env.BRIDGE_CONFIG_S3_BUCKET || 'config.bridge.connext.network',
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
    const _requester = axios.create({ baseURL: env.requester.api_host });
    const opensearcher = axios.create({ baseURL: env.opensearcher.api_host });
    const coingecker = axios.create({ baseURL: env.coingecko.api_host });
    const covalentor = axios.create({ baseURL: env.covalent.api_host });
    const blockscouter = axios.create({ baseURL: env.blockscout.api_host });
    const blockscouter_moonbeam = axios.create({ baseURL: env.blockscout_moonbeam.api_host });
    const blockscouter_fuse = axios.create({ baseURL: env.blockscout_fuse.api_host });
    const blockscouter_milkomeda = axios.create({ baseURL: env.blockscout_milkomeda.api_host });
    const blockscouter_boba = axios.create({ baseURL: env.blockscout_boba.api_host });
    const blockscouter_gather = axios.create({ baseURL: env.blockscout_gather.api_host });
    const blockscouter_kava_alpha = axios.create({ baseURL: env.blockscout_kava_alpha.api_host });

    const tx_manager = {
      chain_tx: tx => {
        switch (tx?.status) {
          case 'Fulfilled':
            return tx?.fulfillTransactionHash;
          case 'Prepared':
            return tx?.prepareTransactionHash;
          default:
            return tx?.cancelTransactionHash;
        }
      },
      from: tx => tx?.initiator,
    };

    const getTokens = async (chain_id, addresses, params) => {
      params = {
        ...params,
        module: 'tokens',
        chain_id,
        addresses,
      };

      // send request
      const res = await _requester.get(null, { params })
        // set response data from error handled by exception
        .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });

      return res?.data?.data;
    };

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

        if (params.query?.includes('transactions(')) {
          if (res?.data?.data?.transactions?.length > 0 || res?.data?.data?.user?.transactions?.length > 0) {
            const tokens = {}, index_name = `transactions${['testnet'].includes(env.network) ? `_${env.network}` : ''}`, transactions = res.data.data.transactions || res.data.data.user.transactions;

            if (transactions) {
              for (let i = 0; i < transactions.length; i++) {
                const t = transactions[i];

                if (t) {
                  const tx = {
                    ...t,
                    chainTx: tx_manager.chain_tx(t),
                    chainId: Number(t.chainId),
                    preparedTimestamp: Number(t.preparedTimestamp) * 1000,
                    fulfillTimestamp: Number(t.fulfillTimestamp) * 1000,
                    cancelTimestamp: Number(t.cancelTimestamp) * 1000,
                    expiry: Number(t.expiry) * 1000,
                    sendingAddress: tx_manager.from(t),
                    sendingChainId: Number(t.sendingChainId),
                    receivingChainId: Number(t.receivingChainId),
                  };

                  const chain_id = tx.chainId;
                  const side = chain_id === tx.sendingChainId ? 'sending' : 'receiving';
                  const asset_id = tx[`${side}AssetId`]?.toLowerCase();
                  const date = tx.preparedTimestamp;
                  const date_string = moment(date).format('YYYY-MM-DD');
                  let token = tokens[chain_id]?.find(c => c?.contract_address === asset_id && c.key === `${asset_id}_${date_string}`);
                  if (!token) {
                    const _tokens = await getTokens(chain_id, asset_id, { date });
                    if (_tokens) {
                      tokens[chain_id] = _.uniqBy(_.concat(_tokens?.map(c => { return { ...c, key: `${c?.contract_address}_${date_string}` } }) || [], tokens[chain_id] || []), 'key');
                      token = tokens[chain_id]?.find(c => c?.contract_address === asset_id);
                    }
                  }
                  const price = token?.price;

                  tx.price = price;
                  tx.amount_value = token?.contract_decimals && typeof price === 'number' && (BigNumber(!isNaN(tx.amount) ? tx.amount : 0).shiftedBy(-token.contract_decimals).toNumber() * price);
                  tx.relayerFee_value = token?.contract_decimals && typeof price === 'number' && (BigNumber(!isNaN(tx.relayerFee) ? tx.relayerFee : 0).shiftedBy(-token.contract_decimals).toNumber() * price);

                  const body = { index: index_name, method: 'update', path: `/${index_name}/_update/${tx.transactionId}`, id: tx.transactionId, [`${side}`]: tx };

                  if (params.sync === 'true') {
                    await opensearcher.post('', body)
                      .catch(error => { return { data: { error } }; });
                  }
                  else {
                    opensearcher.post('', body)
                      .catch(error => { return { data: { error } }; });
                  }
                }
              }
            }
          }
        }
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

          let toUpdateData = data.filter(d => !d?.updated_at || d.updated_at < time.subtract(1, 'hours').valueOf());

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
              case 2001:
                if (!bs) {
                  bs = blockscouter_milkomeda;
                  bsPath = '/api';
                }
              case 288:
                if (!bs) {
                  bs = blockscouter_boba;
                  bsPath = '/api';
                }
              case 192837465:
                if (!bs) {
                  bs = blockscouter_gather;
                  bsPath = '/api';
                }
              case 2221:
                if (!bs) {
                  bs = blockscouter_kava_alpha;
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

          const toUpdateCache = !date && data.filter(d => (!d?.updated_at || d.updated_at < time.subtract(1, 'hours').valueOf()) && 'symbol' in d);

          if (toUpdateCache?.length > 0) {
            toUpdateCache.forEach(d => {
              const id = `${d?.chain_id || chainId}_${d?.contract_address?.toLowerCase()}`;
              d.updated_at = moment().valueOf();

              // send request
              opensearcher.post('', { index: index_name, method: 'update', path: `/${index_name}/_update/${id}`, id, ...d })
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