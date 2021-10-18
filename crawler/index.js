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

  /************************************************
   * Internal API information for requesting data
   * You can setup these environment variables below on the AWS Lambda function's configuration.
   ************************************************/
  const env = {
    requester: {
      api_host: process.env.REQUESTER_API_HOST || '{YOUR_REQUESTER_API_HOST}',
    },
    opensearcher: {
      api_host: process.env.OPENSEARCHER_API_HOST || '{YOUR_OPENSEARCHER_API_HOST}',
    },
    chains: (process.env.CHAINS || '{YOUR_CHAINS}').split(','),
    chains_v0: (process.env.CHAINS_V0 || '{YOUR_CHAINS_V0}').split(','),
    max_page: process.env.MAX_PAGE ? Number(process.env.MAX_PAGE) : 10,
    currency: process.env.CURRENCY || 'usd',
  };

  // initial requester object
  const requester = axios.create({ baseURL: env.requester.api_host });

  const opensearcher = axios.create({ baseURL: env.opensearcher.api_host });

  const getContracts = async (chain_id, contract_addresses, params) => {
    const path = '';
    params = {
      api_name: 'covalent',
      path: `/pricing/historical_by_addresses_v2/${chain_id}/${env.currency}/${contract_addresses}/`,
      ...params,
    };

    // send request
    const res = await requester.get(path, { params })
      // set response data from error handled by exception
      .catch(error => { return { data: { data: null, error: true, error_message: error.message, error_code: error.code } }; });

    return res?.data?.data;
  };

  let contracts = [];

  const versions = ['v0', ''];

  for (let i = 0; i < versions.length; i++) {
    const version = versions[i];

    for (let j = 0; j < env[`chains${version ? `_${version}` : ''}`].length; j++) {
      const chain_id = env[`chains${version ? `_${version}` : ''}`][j];

      const size = 1000;
      let skip = 0;
      let hasMore = true;

      while (hasMore && (skip / size < env.max_page)) {
        const path = '';
        const params = {
          api_name: 'subgraph',
          api_version: version,
          chain_id,
          query: `
            {
              dayMetrics(orderBy: dayStartTimestamp, orderDirection: desc, skip: ${skip}, first: ${size}) {
                id,
                dayStartTimestamp,
                assetId,
                volume,
                txCount
              }
            }
          `,
        };

        // send request
        const res = await requester.get(path, { params })
          // set response data from error handled by exception
          .catch(error => { return { data: { error } }; });

        if (res?.data?.data?.dayMetrics) {
          const data = res.data.data.dayMetrics.map(dayMetric => {
            return {
              ...dayMetric,
              dayStartTimestamp: Number(dayMetric.dayStartTimestamp),
              volume: Number(dayMetric.volume),
              txCount: Number(dayMetric.txCount),
              chain_id,
              version,
            };
          });

          for (let k = 0; k < data.length; k++) {
            let record = data[k];

            if (record?.id && record.assetId) {
              let contract = contracts.find(_contract => _contract.contract_address === record.assetId);

              if (!contract) {
                const _contracts = await getContracts(chain_id, record.assetId);

                if (_contracts) {
                  contracts = _.uniqBy(_.concat(_contracts, contracts), 'contract_address');

                  contract = contracts.find(_contract => _contract.contract_address === record.assetId);
                }
              }

              record = { ...record, normalize_volume: contract?.contract_decimals && typeof contract?.prices?.[0].price === 'number' && (record.volume * contract.prices[0].price / Math.pow(10, contract.contract_decimals)) };

              // send request
              await opensearcher.post('', { ...record, index: 'day_metrics', method: 'update', id: record.id })
                // set response data from error handled by exception
                .catch(error => { return { data: { error } }; });
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

  return;
};