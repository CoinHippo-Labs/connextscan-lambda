/************************************************
 * This code is a function for send meta tags to social meta tags resolver and crawler.
 * Deploy on AWS Lambda (using AWS Lambda@Edge)
 ************************************************/
 exports.handler = async (event, context, callback) => {
   // import module for submitting request.
  // import module for submitting request.
  const axios = require('axios');

  // import modules
  const _ = require('lodash');

  /************************************************
   * Internal API information for requesting data
   * You can setup these environment variables below on the AWS Lambda function's configuration.
   ************************************************/
  const env = {
    network: process.env.NETWORK || 'mainnet',
    requester: {
      api_host: process.env.REQUESTER_API_HOST || 'https://api.connextscan.io/',
    },
    app_name: process.env.APP_NAME || 'Connext',
    site_url: process.env.SITE_URL || 'https://bridge.connext.network',
    default_title: process.env.DEFAULT_TITLE || 'Connext | Cross-Chain Transfer',
    default_description: process.env.DEFAULT_DESCRIPTION || 'Transfer token between chains using NXTP',
    bot_user_agent_patterns: ['facebook','twitter','google','slack','linkedin','pinterest'],
    ignore_path_patterns: ['.js','.json','.css','.txt','.png','.xml','sitemap','/static','favicon'],
  };

  // function for generate custom name
  const capitalize = s => typeof s !== 'string' ? '' : s.trim().split(' ').join('_').split('-').join('_').split('_').map(x => x.trim()).filter(x => x).map(x => `${x.substr(0, 1).toUpperCase()}${x.substr(1)}`).join(' ');

  const names = {};

  const getName = (s, data) => names[s] ? names[s] : data && data.name && data.id === s ? data.name : s && s.length <= 3 ? s.toUpperCase() : capitalize(s);

  // function for generate header meta tags
  const meta = (path, data, chains, assets) => {
    path = !path ? '/' : path.toLowerCase();
    path = path.includes('?') ? path.substring(0, path.indexOf('?')) : path;

    const pathSplit = path.split('/').filter(x => x);

    let title = `${_.cloneDeep(pathSplit).reverse().map(x => getName(x, data)).join(' - ')}${pathSplit.length > 0 ? ` | ${env.app_name}` : env.default_title}`;
    let description = env.default_description;
    let image = `${env.site_url}/images/ogimage.png`;
    const url = `${env.site_url}${path}`;

    if (path.includes('from-') && path.includes('to-')) {
      const paths = path.replace('/', '').split('-');
      const fromChainId = paths[paths.indexOf('from') + 1];
      const toChainId = paths[paths.indexOf('to') + 1];
      const fromChainTitle = chains?.find(c => c.id === fromChainId)?.title || getName(fromChainId);
      const toChainTitle = chains?.find(c => c.id === toChainId)?.title || getName(toChainId);
      const assetId = paths[0] !== 'from' ? paths[0] : null;
      const assetTitle = assets?.find(a => a.id === assetId || a.symbol?.toLowerCase() === assetId)?.symbol || 'tokens';

      title = `Bridge ${assetTitle} ${fromChainTitle ? `from ${fromChainTitle} ` : ''}${toChainTitle ? `to ${toChainTitle} ` : ''}with Connext`;
      description = `The most secure ${fromChainTitle} bridge to ${toChainTitle} to move tokens across blockchains in a trustless way`;
    }

    return {
      title,
      description,
      url,
      image,
    };
  };

  // initial request object
  const requester = axios.create({ baseURL: env.requester.api_host });

  const chains = async params => {
    params = { ...params, module: 'bridge_config', collection: 'chains', network: env.network };
    // send request
    const res = await requester.get(null, { params })
      // set response data from error handled by exception
      .catch(error => { return { data: null }; });
    return res?.data || [];
  };

  const assets = async params => {
    params = { ...params, module: 'bridge_config', collection: 'assets', network: env.network };
    // send request
    const res = await requester.get(null, { params })
      // set response data from error handled by exception
      .catch(error => { return { data: null }; });
    return res?.data || [];
  };

  // request object
  const request = event.Records[0].cf.request;
  // uri path
  const path = request?.uri;

  if (path && request.headers && request.headers['user-agent'] && env.bot_user_agent_patterns.findIndex(p => request.headers['user-agent'].findIndex(u => u.value.toLowerCase().indexOf(p) > -1) > -1) > -1) {
    if (env.ignore_path_patterns.findIndex(p => path.indexOf(p) > -1) > -1) {
      // return
      callback(null, request);
    }
    else {
      // get bridge config
      const chains_data = await chains(), assets_data = await assets();
      // get header meta
      const headMeta = meta(path, null, chains_data, assets_data);

      // meta tag to body
      const body = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#050707" />
            <meta name="robots" content="index, follow" />
            <meta name="description" content="${headMeta.description}" />
            <meta name="og:site_name" property="og:site_name" content="${headMeta.title}" />
            <meta name="og:title" property="og:title" content="${headMeta.title}" />
            <meta name="og:description" property="og:description" content="${headMeta.description}" />
            <meta name="og:type" property="og:type" content="website" />
            <meta name="og:image" property="og:image" content="${headMeta.image}" />
            <meta name="og:url" property="og:url" content="${headMeta.url}" />
            <meta itemprop="name" content="${headMeta.title}" />
            <meta itemprop="description" content="${headMeta.description}" />
            <meta itemprop="thumbnailUrl" content="${headMeta.image}" />
            <meta itemprop="image" content="${headMeta.image}" />
            <meta itemprop="url" content="${headMeta.url}" />
            <meta itemprop="headline" content="${headMeta.title}" />
            <meta itemprop="publisher" content="${headMeta.title}" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${headMeta.title}" />
            <meta name="twitter:description" content="${headMeta.description}" />
            <meta name="twitter:image" content="${headMeta.image}" />
            <meta name="twitter:url" content="${headMeta.url}" />
            <link rel="image_src" href="${headMeta.image}" />
            <link rel="canonical" href="${headMeta.url}" />
            <link rel="manifest" href="${env.site_url}/manifest.json" />
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="${env.site_url}/icons/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="${env.site_url}/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" href="${env.site_url}/favicon.png" />
            <link rel="shortcut icon" type="image/png" sizes="16x16" href="${env.site_url}/icons/favicon-16x16.png" />
            <link rel="shortcut icon" type="image/png" sizes="32x32" href="${env.site_url}/icons/favicon-32x32.png" />
            <link rel="shortcut icon" type="image/png" href="${env.site_url}/favicon.png" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#050707" />
            <meta name="msapplication-TileColor" content="#050707" />
            <title>${headMeta.title}</title>
          </head>
          <body>
            <h1>${headMeta.title}</h1>
            <h2>${headMeta.description}</h2>
            <p>url: ${headMeta.url}</p>
          </body>
         </html>
      `;

      // set response
      const response = {
        status: '200',
        statusDescription: 'OK',
        body,
        headers: {
          'cache-control': [{
            key: 'Cache-Control',
            value: 'max-age=100'
          }],
          'content-type': [{
            key: 'Content-Type',
            value: 'text/html'
          }]
        }
      };

      // return response
      callback(null, response);
    }
  }
  else {
    // return
    callback(null, request);
  }
};