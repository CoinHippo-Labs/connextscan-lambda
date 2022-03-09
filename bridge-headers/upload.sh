#!/bin/bash
if [ -z "$1" ]
then
  NETWORK="mainnet"
else
  NETWORK=$1
fi

LAMBDA_FUNC_NAME=connext-bridge-headers-${NETWORK}
PROJECT_PATH=~/Desktop/connext/lambda/bridge-headers

cd ${PROJECT_PATH}
zip -r ${LAMBDA_FUNC_NAME}.zip .
aws lambda update-function-code --function-name ${LAMBDA_FUNC_NAME} --zip-file fileb://${PROJECT_PATH}/${LAMBDA_FUNC_NAME}.zip --region us-east-1
rm ${LAMBDA_FUNC_NAME}.zip
