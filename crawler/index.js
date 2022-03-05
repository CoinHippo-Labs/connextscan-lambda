/************************************************
 * This code is a function for collect data from APIs.
 * Deploy on AWS Lambda (triggered by AWS EventBridge)
 ************************************************/
exports.handler = async (event, context, callback) => {
  // import module for submitting request.
  const axios = require('axios');

  // import modules
  const _ = require('lodash');
  const moment = require('moment');
  const BigNumber = require('bignumber.js');

  BigNumber.config({ DECIMAL_PLACES: Number(40), EXPONENTIAL_AT: [-7, Number(40)] });

  /************************************************
   * Internal API information for requesting data
   * You can setup these environment variables below on the AWS Lambda function's configuration.
   ************************************************/
  const env = {
    network: process.env.NETWORK || 'testnet',
    requester: {
      api_host: process.env.REQUESTER_API_HOST || '{YOUR_REQUESTER_API_HOST}',
    },
    opensearcher: {
      api_host: process.env.OPENSEARCHER_API_HOST || '{YOUR_OPENSEARCHER_API_HOST}',
    },
    index_name: process.env.INDEX_NAME || 'day_metrics',
    chains: JSON.parse(process.env.CHAINS || '{YOUR_CHAINS}'),
    chains_v0: JSON.parse(process.env.CHAINS_V0 || '{YOUR_CHAINS_V0}'),
    max_page: process.env.MAX_PAGE ? Number(process.env.MAX_PAGE) : 3,
  };

  // initial request object
  const requester = axios.create({ baseURL: env.requester.api_host });
  const opensearcher = axios.create({ baseURL: env.opensearcher.api_host });

  const getTokens = async (chain_id, addresses, params) => {
    params = {
      ...params,
      module: 'tokens',
      chain_id,
      addresses,
    };

    // send request
    const res = await requester.get(null, { params })
      // set response data from error handled by exception
      .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });

    return res?.data?.data;
  };

  const time = moment();
  const hours = time.hours();
  const minutes = time.minutes();

  const tx_query = (skip, size) => `
    {
      transactions(orderBy: preparedTimestamp, orderDirection: desc, skip: ${skip}, first: ${size}) {
        id
        status
        chainId
        preparedTimestamp
        receivingChainTxManagerAddress
        user {
          id
        }
        router {
          id
        }
        initiator
        sendingAssetId
        receivingAssetId
        sendingChainFallback
        callTo
        receivingAddress
        callDataHash
        transactionId
        sendingChainId
        receivingChainId
        amount
        expiry
        preparedBlockNumber
        encryptedCallData
        prepareCaller
        bidSignature
        encodedBid
        prepareTransactionHash
        prepareMeta
        relayerFee
        signature
        callData
        externalCallSuccess
        externalCallIsContract
        externalCallReturnData
        fulfillCaller
        fulfillTransactionHash
        fulfillMeta
        fulfillTimestamp
        cancelCaller
        cancelTransactionHash
        cancelMeta
        cancelTimestamp
      }
    }
  `;

  const chains_params = env.chains.map(c => {
    return {
      chain_id: c,
      skip: 0,
      hasMore: true,
    };
  });

  while (chains_params.findIndex(c => c.hasMore) > -1) {
    for (let i = 0; i < chains_params.length; i++) {
      const { chain_id } = chains_params[i];
      let { skip, hasMore } = chains_params[i];
      const size = env.network === 'testnet' ? 10 : 25;

      while (hasMore) {
        const params = {
          module: 'subgraph',
          chain_id,
          query: tx_query(skip, size),
        };

        // send request
        const res = await requester.get(null, { params })
          // set response data from error handled by exception
          .catch(error => { return { data: { error } }; });

        hasMore = res?.data?.data?.transactions?.length === size;

        if (hasMore) {
          skip += size;
        }

        hasMore = skip < size;

        chains_params[i].skip = skip;
        chains_params[i].hasMore = hasMore;
      }
    }
  }

  if (minutes < 1) {
    const tokens = {}, versions = ['v0', ''];
    for (let i = 0; i < versions.length; i++) {
      const version = versions[i];

      for (let j = 0; j < env[`chains${version ? `_${version}` : ''}`].length; j++) {
        const chain_id = env[`chains${version ? `_${version}` : ''}`][j];
        const size = 1000;
        let skip = 0, hasMore = true;

        while (hasMore && (skip / size < env.max_page)) {
          const params = {
            module: 'subgraph',
            api_version: version,
            api_type: !version ? 'analytic' : '',
            chain_id,
            query: `
              {
                dayMetrics(orderBy: dayStartTimestamp, orderDirection: desc, skip: ${skip}, first: ${size}) {
                  id
                  dayStartTimestamp
                  assetId
                  sendingTxCount
                  receivingTxCount
                  cancelTxCount
                  volume
                  volumeIn
                  relayerFee
                }
              }
            `,
          };

          // send request
          const res = await requester.get(null, { params })
            // set response data from error handled by exception
            .catch(error => { return { data: { error } }; });

          if (res?.data?.data?.dayMetrics) {
            const data = res.data.data.dayMetrics.map(d => {
              return {
                ...d,
                dayStartTimestamp: Number(d.dayStartTimestamp),
                sendingTxCount: Number(d.sendingTxCount) || 0,
                receivingTxCount: Number(d.receivingTxCount) || 0,
                cancelTxCount: Number(d.cancelTxCount) || 0,
                volume: d.volume,
                volumeIn: d.volumeIn,
                relayerFee: d.relayerFee,
                chain_id,
                version,
              };
            });

            for (let k = 0; k < data.length; k++) {
              let record = data[k];

              if (record?.id && record.assetId && (record.sendingTxCount > 0 || record.receivingTxCount > 0 || record.cancelTxCount > 0)) {
                record.assetId = record.assetId?.toLowerCase();
                const date = record.dayStartTimestamp * 1000;
                const date_string = moment(date).format('YYYY-MM-DD');
                let token = tokens[chain_id]?.find(c => c?.contract_address === record.assetId && c.key === `${record.assetId}_${date_string}`);
                if (!token) {
                  const _tokens = await getTokens(chain_id, record.assetId, { date });
                  if (_tokens) {
                    tokens[chain_id] = _.uniqBy(_.concat(_tokens?.map(c => { return { ...c, key: `${c?.contract_address}_${date_string}` } }) || [], tokens[chain_id] || []), 'key');
                    token = tokens[chain_id]?.find(c => c?.contract_address === record.assetId);
                  }
                }
                const price = token?.price;

                record = {
                  ...record,
                  id: `${chain_id}_${record.id}`,
                  price,
                  volume_value: token?.contract_decimals && typeof price === 'number' && (BigNumber(!isNaN(record.volume) ? record.volume : 0).shiftedBy(-token.contract_decimals).toNumber() * price),
                  volumeIn_value: token?.contract_decimals && typeof price === 'number' && (BigNumber(!isNaN(record.volumeIn) ? record.volumeIn : 0).shiftedBy(-token.contract_decimals).toNumber() * price),
                  relayerFee_value: token?.contract_decimals && typeof price === 'number' && (BigNumber(!isNaN(record.relayerFee) ? record.relayerFee : 0).shiftedBy(-token.contract_decimals).toNumber() * price),
                };

                if ((record.volume_value > 0 || record.volumeIn_value > 0 || record.relayerFee_value > 0) && (record.sendingTxCount > 0 || record.receivingTxCount > 0 || record.cancelTxCount > 0)) {
                  // send request
                  await opensearcher.post('', { index: env.index_name, method: 'update', id: record.id, ...record })
                    // set response data from error handled by exception
                    .catch(error => { return { data: { error } }; });
                }
              }
            }
          }

          hasMore = res?.data?.data?.dayMetrics?.length === size;

          if (hasMore) {
            skip += size;
          }
        }
      }
    }
  }

  return;
};