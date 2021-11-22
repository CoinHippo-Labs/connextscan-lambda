const contracts = [
  {
    logo_url: '/logos/contracts/usdt.png',
    is_stable: true,
    addresses: [
      {
        contract_address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        chain_id: 42161,
        contract_decimals: 6,
        coingecko_id: 'tether',
      },
      {
        contract_address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
        chain_id: 10,
        contract_decimals: 6,
        coingecko_id: 'tether',
      },
      {
        contract_address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        chain_id: 137,
        coingecko_id: 'tether',
      },
      {
        contract_address: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
        chain_id: 250,
        coingecko_id: 'tether',
      },
      {
        contract_address: '0x55d398326f99059ff775485246999027b3197955',
        chain_id: 56,
        coingecko_id: 'tether',
      },
      {
        contract_address: '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
        chain_id: 100,
        contract_decimals: 6,
        coingecko_id: 'tether',
      },
      {
        contract_address: '0xc7198437980c041c805a1edcba50c1ce5db95118',
        chain_id: 43114,
        coingecko_id: 'tether',
      },
      {
        contract_address: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
        chain_id: 1285,
        coingecko_id: 'tether',
      },
    ],
  },
  {
    logo_url: '/logos/contracts/usdc.png',
    is_stable: true,
    addresses: [
      {
        contract_address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        chain_id: 42161,
        contract_decimals: 6,
        coingecko_id: 'usd-coin',
      },
      {
        contract_address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
        chain_id: 10,
        contract_decimals: 6,
        coingecko_id: 'usd-coin',
      },
      {
        contract_address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        chain_id: 137,
        coingecko_id: 'usd-coin',
      },
      {
        contract_address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
        chain_id: 250,
        coingecko_id: 'usd-coin',
      },
      {
        contract_address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        chain_id: 56,
        coingecko_id: 'usd-coin',
      },
      {
        contract_address: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
        chain_id: 100,
        contract_decimals: 6,
        coingecko_id: 'usd-coin',
      },
      {
        contract_address: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
        chain_id: 43114,
        coingecko_id: 'usd-coin',
      },
    ],
  },
  {
    logo_url: '/logos/contracts/dai.png',
    is_stable: true,
    addresses: [
      {
        contract_address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        chain_id: 42161,
        contract_decimals: 18,
        coingecko_id: 'dai',
      },
      {
        contract_address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
        chain_id: 10,
        contract_decimals: 18,
        coingecko_id: 'dai',
      },
      {
        contract_address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        chain_id: 137,
        coingecko_id: 'dai',
      },
      {
        contract_address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
        chain_id: 250,
        coingecko_id: 'dai',
      },
      {
        contract_address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
        chain_id: 56,
        coingecko_id: 'dai',
      },
      {
        contract_address: '0x44fA8E6f47987339850636F88629646662444217',
        chain_id: 100,
        contract_decimals: 18,
        coingecko_id: 'dai',
      },
      {
        contract_address: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
        chain_id: 43114,
        coingecko_id: 'dai',
      },
    ],
  },
  {
    logo_url: '/logos/contracts/xdai.png',
    is_stable: true,
    addresses: [
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 100,
        contract_decimals: 18,
        contract_name: 'xDai',
        contract_ticker_symbol: 'XDAI',
        coingecko_id: 'xdai',
      },
    ],
  },
  {
    logo_url: '/logos/contracts/eth.png',
    addresses: [
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 1,
        contract_decimals: 18,
        contract_name: 'Ethereum',
        contract_ticker_symbol: 'ETH',
        coingecko_id: 'ethereum',
      },
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 42161,
        contract_decimals: 18,
        contract_name: 'Ethereum',
        contract_ticker_symbol: 'ETH',
        coingecko_id: 'ethereum',
      },
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 10,
        contract_decimals: 18,
        contract_name: 'Ethereum',
        contract_ticker_symbol: 'ETH',
        coingecko_id: 'ethereum',
      },
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 3,
        contract_decimals: 18,
        contract_name: 'Ethereum',
        contract_ticker_symbol: 'ETH',
        coingecko_id: 'ethereum',
      },
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 4,
        contract_decimals: 18,
        contract_name: 'Ethereum',
        contract_ticker_symbol: 'ETH',
        coingecko_id: 'ethereum',
      },
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 5,
        contract_decimals: 18,
        contract_name: 'Ethereum',
        contract_ticker_symbol: 'ETH',
        coingecko_id: 'ethereum',
      },
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 42,
        contract_decimals: 18,
        contract_name: 'Ethereum',
        contract_ticker_symbol: 'ETH',
        coingecko_id: 'ethereum',
      },
    ],
  },
  {
    logo_url: null,
    addresses: [
      {
        contract_address: '0x0000000000000000000000000000000000000000',
        chain_id: 1285,
        contract_decimals: 18,
        contract_name: 'Moonriver',
        contract_ticker_symbol: 'MOVR',
        coingecko_id: 'moonriver',
      },
    ],
  },
  {
    logo_url: null,
    addresses: [
      {
        contract_address: '0xabc6790673a60b8a7f588450f59d2d256b1aef7f',
        chain_id: 56,
        contract_decimals: 18,
        coingecko_id: 'omni-people-driven',
      },
      {
        contract_address: '0xabc6790673a60b8a7f588450f59d2d256b1aef7f',
        chain_id: 137,
        contract_decimals: 18,
        coingecko_id: 'omni-people-driven',
      },
    ],
  },
  {
    logo_url: null,
    addresses: [
      {
        contract_address: '0xc0b2983a17573660053beeed6fdb1053107cf387',
        chain_id: 137,
        contract_decimals: 18,
        coingecko_id: 'minerva-wallet',
      },
      {
        contract_address: '0x63e62989d9eb2d37dfdb1f93a22f063635b07d51',
        chain_id: 100,
        contract_decimals: 18,
        coingecko_id: 'minerva-wallet',
      },
    ],
  },
];

module.exports = { contracts };