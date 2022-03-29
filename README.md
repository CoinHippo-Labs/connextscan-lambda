# Connext Network Explorer - Lambda functions
This repository is a subproject of the [Connext Network Explorer](https://connextscan.io). The implemented services here are used for retrieving, normalizing, processing, aggregating, and managing the [Connext Network Explorer Website](https://github.com/CoinHippo-Labs/connextscan). We design and implement them as serverless services to interact with `Subgraph Endpoints`, `Covalent API`, `Coingecko API` and `Blockscout API`.

The implementation is based on Amazon Web Services' services, including ([AWS Lambda](https://aws.amazon.com/lambda), [AWS API Gateway](https://aws.amazon.com/api-gateway), [AWS EventBridge](https://aws.amazon.com/eventbridge) and [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service).

## Functions
- [requester](/requester) - A function for requesting data from `Subgraph`, `Covalent API`, `Coingecko API` and `Blockscout API`. The [AWS API Gateway](https://aws.amazon.com/api-gateway) is used as the trigger.
- [opensearcher](/opensearcher) - A function for interacting with our implemented indexers, which is resposible for indexing day metrics (from subgraph v0 & current version), etc. The functionalities of this part are implemented based on the [Amazon OpenSearch Service](https://aws.amazon.com/opensearch-service).
- [crawler](/crawler) - A function for collecting data from `Subgraph` and indexing data to OpenSearch Service, which is implemented based on [AWS EventBridge](https://aws.amazon.com/eventbridge).

## Architecture Design
<img width="857" alt="explorer-architecture" src="https://user-images.githubusercontent.com/13881651/138571018-9f20fb13-483e-42ce-ab7a-c01d0285a8ac.png">

## Follow us
- [Website](https://coinhippo.io)
- [Twitter](https://twitter.com/coinhippoHQ)
- [Telegram](https://t.me/CoinHippoChannel)
