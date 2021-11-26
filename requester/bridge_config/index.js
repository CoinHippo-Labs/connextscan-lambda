const chains = [
  {
    id: 'eth',
    title: 'Ethereum',
    short_name: 'ETH',
    chain_id: 1,
    provider_params: [
      {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        rpcUrls: ['https://api.mycryptoapi.com/eth', 'https://cloudflare-eth.com'],
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://etherscan.io'],
      },
    ],
  },
  {
    id: 'bsc',
    title: 'Binance Smart Chain',
    short_name: 'BSC',
    chain_id: 56,
    provider_params: [
      {
        chainId: '0x38',
        chainName: 'Binance Smart Chain Mainnet',
        rpcUrls: ['https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed2.ninicoin.io', 'https://bsc-dataseed3.ninicoin.io', 'https://bsc-dataseed1.binance.org', 'https://bsc-dataseed2.binance.org', 'https://bsc-dataseed3.binance.org', 'https://bsc-dataseed4.binance.org', 'https://bsc-dataseed1.defibit.io', 'https://bsc-dataseed2.defibit.io', 'https://bsc-dataseed3.defibit.io', 'https://bsc-dataseed4.defibit.io', 'wss://bsc-ws-node.nariox.org'],
        nativeCurrency: {
          name: 'Binance Chain Native Token',
          symbol: 'BNB',
          decimals: 18,
        },
        blockExplorerUrls: ['https://bscscan.com'],
      },
    ],
  },
  {
    id: 'matic',
    title: 'Polygon',
    short_name: 'MATIC',
    chain_id: 137,
    provider_params: [
      {
        chainId: '0x89',
        chainName: 'Matic Mainnet',
        rpcUrls: ['https://polygon-rpc.com', 'https://polygon-mainnet.infura.io/v3/e02a34c8aa5d4156aeed1142ea2173c8'/*, 'https://rpc-mainnet.matic.network'*/, 'wss://ws-mainnet.matic.network'],
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://polygonscan.com/'],
      },
    ],
  },
  {
    id: 'arb',
    title: 'Arbitrum',
    short_name: 'ARB',
    chain_id: 42161,
    provider_params: [
      {
        chainId: '0xa4b1',
        chainName: 'Arbitrum One',
        rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        nativeCurrency: {
          name: 'Arbitrum Ether',
          symbol: 'tETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://arbiscan.io'],
      },
    ],
  },
  {
    id: 'opt',
    title: 'Optimism',
    short_name: 'OPT',
    chain_id: 10,
    provider_params: [
      {
        chainId: '0xa',
        chainName: 'Optimism Mainnet',
        rpcUrls: ['https://mainnet.optimism.io'],
        nativeCurrency: {
          name: 'Ether',
          symbol: 'OETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://optimistic.etherscan.io'],
      },
    ],
  },
  {
    id: 'avax',
    title: 'Avalanche',
    short_name: 'AVAX',
    chain_id: 43114,
    provider_params: [
      {
        chainId: '0xa86a',
        chainName: 'Avalanche Mainnet C-Chain',
        rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
        nativeCurrency: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18,
        },
        blockExplorerUrls: ['https://cchain.explorer.avax.network/'],
      },
    ],
  },
  {
    id: 'ftm',
    title: 'Fantom',
    short_name: 'FTM',
    chain_id: 250,
    provider_params: [
      {
        chainId: '0xfa',
        chainName: 'Fantom Opera',
        rpcUrls: ['https://rpc.ftm.tools', 'https://rpcapi.fantom.network'],
        nativeCurrency: {
          name: 'Fantom',
          symbol: 'FTM',
          decimals: 18,
        },
        blockExplorerUrls: ['https://ftmscan.com'],
      },
    ],
  },
  {
    id: 'xdai',
    title: 'xDAI Chain',
    short_name: 'xDAI',
    chain_id: 100,
    provider_params: [
      {
        chainId: '0x64',
        chainName: 'xDAI Chain',
        rpcUrls: ['https://xdai.poanetwork.dev', 'https://rpc.xdaichain.com', 'wss://rpc.xdaichain.com/wss', 'wss://xdai.poanetwork.dev/wss', 'http://xdai.poanetwork.dev', 'https://dai.poa.network', 'ws://xdai.poanetwork.dev:8546'],
        nativeCurrency: {
          name: 'xDAI',
          symbol: 'xDAI',
          decimals: 18,
        },
        blockExplorerUrls: ['https://blockscout.com/poa/xdai/'],
      },
    ],
  },
  {
    id: 'movr',
    title: 'Moonriver',
    short_name: 'MOVR',
    chain_id: 1285,
    provider_params: [
      {
        chainId: '0x0505',
        chainName: 'Moonriver',
        rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
        nativeCurrency: {
          name: 'Moonriver',
          symbol: 'MOVR',
          decimals: 18,
        },
        blockExplorerUrls: ['https://blockscout.moonriver.moonbeam.network'],
      },
    ],
  },
];

const chains_testnet = [
  {
    id: 'rop',
    title: 'Ropsten',
    short_name: 'ROP',
    chain_id: 3,
    provider_params: [
      {
        chainId: '0x3',
        chainName: 'Ethereum Testnet Ropsten',
        rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        nativeCurrency: {
          name: 'Ropsten Ether',
          symbol: 'ROP',
          decimals: 18,
        },
        blockExplorerUrls: ['https://ropsten.etherscan.io'],
      },
    ],
  },
  {
    id: 'rin',
    title: 'Rinkeby',
    short_name: 'RIN',
    chain_id: 4,
    provider_params: [
      {
        chainId: '0x4',
        chainName: 'Ethereum Testnet Rinkeby',
        rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        nativeCurrency: {
          name: 'Rinkeby Ether',
          symbol: 'RIN',
          decimals: 18,
        },
        blockExplorerUrls: ['https://rinkeby.etherscan.io'],
      },
    ],
  },
  {
    id: 'gor',
    title: 'Görli',
    short_name: 'GOR',
    chain_id: 5,
    provider_params: [
      {
        chainId: '0x5',
        chainName: 'Ethereum Testnet Görli',
        rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        nativeCurrency: {
          name: 'Görli Ether',
          symbol: 'GOR',
          decimals: 18,
        },
        blockExplorerUrls: ['https://goerli.etherscan.io'],
      },
    ],
  },
  {
    id: 'kov',
    title: 'Kovan',
    short_name: 'KOV',
    chain_id: 42,
    provider_params: [
      {
        chainId: '0x2a',
        chainName: 'Ethereum Testnet Kovan',
        rpcUrls: ['https://kovan.poa.network', 'http://kovan.poa.network:8545', 'ws://kovan.poa.network:8546'],
        nativeCurrency: {
          name: 'Kovan Ether',
          symbol: 'KOV',
          decimals: 18,
        },
        blockExplorerUrls: ['https://kovan.etherscan.io'],
      },
    ],
  },
  {
    id: 'bsct',
    title: 'Binance Smart Chain Testnet',
    short_name: 'BSCT',
    chain_id: 97,
    provider_params: [
      {
        chainId: '0x61',
        chainName: 'Binance Smart Chain Testnet',
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545', 'https://data-seed-prebsc-2-s1.binance.org:8545', 'https://data-seed-prebsc-1-s2.binance.org:8545', 'https://data-seed-prebsc-2-s2.binance.org:8545', 'https://data-seed-prebsc-1-s3.binance.org:8545', 'https://data-seed-prebsc-2-s3.binance.org:8545'],
        nativeCurrency: {
          name: 'Binance Chain Native Token',
          symbol: 'BNB',
          decimals: 18,
        },
        blockExplorerUrls: ['https://testnet.bscscan.com'],
      },
    ],
  },
  {
    id: 'mum',
    title: 'Mumbai',
    short_name: 'MUM',
    chain_id: 80001,
    provider_params: [
      {
        chainId: '0x13881',
        chainName: 'Matic Testnet Mumbai',
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/', 'https://rpc-mumbai.matic.today', 'wss://ws-mumbai.matic.today'],
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com'],
      },
    ],
  },
  {
    id: 'arbr',
    title: 'Arbitrum Rinkeby',
    short_name: 'ARBR',
    chain_id: 421611,
    provider_params: [
      {
        chainId: '0x66eeb',
        chainName: 'Arbitrum Testnet Rinkeby',
        rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
        nativeCurrency: {
          name: 'Arbitrum Ether',
          symbol: 'tETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://rinkeby-explorer.arbitrum.io/#/'],
      },
    ],
  },
  {
    id: 'optk',
    title: 'Optimism Kovan',
    short_name: 'OPTK',
    chain_id: 69,
    provider_params: [
      {
        chainId: '0x45',
        chainName: 'Optimism Testnet Kovan',
        rpcUrls: ['https://kovan.optimism.io'],
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
      },
    ],
  },
];

module.exports = { chains, chains_testnet };