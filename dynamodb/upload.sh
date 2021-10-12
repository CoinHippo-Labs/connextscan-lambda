#!/bin/bash
if [ -z "$1" ]
then
	NETWORK="mainnet"
else
	NETWORK=$1
fi

LAMBDA_FUNC_NAME=connext-${NETWORK}-dynamodb
PROJECT_PATH=~/Desktop/connext/lambda/dynamodb

cd ${PROJECT_PATH}
zip -r ${LAMBDA_FUNC_NAME}.zip .
aws lambda update-function-code --function-name ${LAMBDA_FUNC_NAME} --zip-file fileb://${PROJECT_PATH}/${LAMBDA_FUNC_NAME}.zip --region us-west-1
rm ${LAMBDA_FUNC_NAME}.zip
