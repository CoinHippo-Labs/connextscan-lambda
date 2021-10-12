/************************************************
 * This code is a function for CRUD data from AWS DynamoDB.
 * Deploy on AWS Lambda (triggered by AWS API Gateway & AWS EventBridge)
 ************************************************/
exports.handler = async (event, context, callback) => {
  // import modules
  const moment = require('moment');
  const AWS = require('aws-sdk');

  // constant
  // aws for connect dynamodb
  AWS.config.update({
    accessKeyId: process.env.DYNAMODB_AWS_ACCESS_KEY_ID || '{YOUR_DYNAMODB_AWS_ACCESS_KEY_ID}',
    secretAccessKey: process.env.DYNAMODB_AWS_SECRET_ACCESS_KEY || '{YOUR_DYNAMODB_AWS_SECRET_ACCESS_KEY}',
    region: process.env.DYNAMODB_AWS_REGION || 'us-west-1',
  });
  // aws dynamodb
  const db = new AWS.DynamoDB();
  const dc = new AWS.DynamoDB.DocumentClient();

  // normalize item
  // input for dynamodb validation
  const normalizeInputObject = item => {
    Object.keys(item).forEach(i => {
      try {
        if (i !== 'Json') {
          item[i] = JSON.parse(item[i]);
        }
      } catch (error) {}

      try {
        if (typeof item[i] === 'object') {
          Object.keys(item[i]).forEach(j => {
            try {
              if (typeof item[i][j] !== 'object') {
                item[i][j] = item[i][j].toString();
              }
            } catch (error) {}
          });
        }
        else {
          if (typeof item[i] === 'string') {
            item[i] = { S: item[i] };
          }
          else if (typeof item[i] === 'number') {
            item[i] = { N: item[i].toString() };
          }
        }
      } catch (error) {}
    });

    return item;
  };

  // output for client
  const normalizeOutputObject = item => {
    Object.keys(item).forEach(i => {
      try {
        if (typeof item[i] === 'object' && Object.keys(item[i]).length === 1) {
          Object.keys(item[i]).forEach(j => {
            try {
              if (typeof item[i][j] !== 'object') {
                if (j === 'S') {
                  item[i] = item[i][j].toString();
                }
                else if (j === 'N') {
                  item[i] = Number(item[i][j]);
                }
              }
            } catch (error) {}
          });
        }
      } catch (error) {}
    });

    return item;
  };

  // query records
  const query = params => new Promise(resolve => {
    db.query(params, (err, data) => {
      if (err) resolve(null);
      else resolve(data.Items && data.Items.map(item => normalizeOutputObject(item)));
    });
  });

  // scan records
  const scan = params => new Promise(resolve => {
    db.scan(params, (err, data) => {
      if (err) resolve(null);
      else resolve(data.Items && data.Items.map(item => normalizeOutputObject(item)));
    });
  });

  // get record
  const get = params => new Promise(resolve => {
    db.getItem(params, (err, data) => {
      if (err) resolve(null);
      else resolve(data.Item);
    });
  });

  // put record
  const put = params => new Promise(resolve => {
    db.putItem(params, (err, data) => {
      if (err) resolve(null);
      else resolve(data);
    });
  });

  // update record
  const update = params => new Promise(resolve => {
    db.update(params, (err, data) => {
      if (err) resolve(null);
      else resolve(data);
    });
  });

  // delete record
  const deleteItem = params => new Promise(resolve => {
    dc.delete(params, (err, data) => {
      if (err) resolve(null);
      else resolve(data);
    });
  });

  // response data variable
  let response = null;

  const body = (event.body && JSON.parse(event.body)) || event.queryStringParameters;

  if (body && body.table_name) {
    const current_timestamp = moment().unix();

    const _body = { ...body };

    // remove path
    if (body.path === '') {
      delete body.path;
    }

    // set table name
    const table_name = _body.table_name;
    delete body.table_name;
    // set method
    const method = _body.method; // query, scan, get, put, update, delete
    delete body.method;
    // set limit
    const limit = _body.limit || 25;
    delete body.limit;
    // set order
    const order = _body.order || 'asc';
    delete body.order;
    // set projection expression
    const projection = _body.projection || 'ID, CreatedAt, UpdatedAt, Json';
    delete body.projection;
    // set filter expression
    const filter = _body.filter;
    delete body.filter;
    // set filter expression
    const attr_names = _body.attr_names;
    delete body.attr_names;
    // set key expression
    const key = _body.key;
    delete body.key;
    // set update expression
    const update = _body.update;
    delete body.update;

    // parameters for action
    const params = {
      TableName: table_name,
    };

    // do action
    switch(method) {
      case 'query':
        params.Limit = limit;
        params.ScanIndexForward = order === 'asc';
        params.ProjectionExpression = projection;
        if (key) {
          params.KeyConditionExpression = key;
        }
        if (filter) {
          params.FilterExpression = filter;
        }
        if (attr_names) {
          try {
            params.ExpressionAttributeNames = JSON.parse(attr_names);
          } catch (error) {}
        }
        params.ExpressionAttributeValues = normalizeInputObject({ ...body });
        response = { data: await query(params) };
        break;
      case 'scan':
        params.Limit = limit;
        params.ProjectionExpression = projection;
        if (filter) {
          params.FilterExpression = filter;
        }
        params.ExpressionAttributeValues = normalizeInputObject({ ...body });
        response = { data: await scan(params) };
        break;
      case 'get':
        params.Key = normalizeInputObject({ ...body });
        response = { data: normalizeOutputObject(await get(params)) };
        break;
      case 'put':
        params.Item = normalizeInputObject({ ...body, CreatedAt: current_timestamp, UpdatedAt: current_timestamp });
        response = { data: await put(params), SortKey: body.SortKey };
        break;
      case 'update':
        params.Key = normalizeInputObject({ ...key });
        if (update) {
          params.UpdateExpression = update;
        }
        params.ExpressionAttributeValues = normalizeInputObject({ ...body, UpdatedAt: current_timestamp });
        response = { data: await update(params) };
        break;
      case 'delete':
        params.Key = { ...body };
        response = { data: await deleteItem(params) };
        break;
      default:
        break;
    }
  }
  // auto migrate data
  else {
    const table_names = ['connext-contracts'];

    for (let i = 0; i < table_names.length; i++) {
      const table_name = table_names[i];

      let params = {
        TableName: table_name,
        Limit: 100,
        ProjectionExpression: table_name === 'connext-contracts' ? 'ID, Expired' : 'ID, SortKey, CreatedAt',
        FilterExpression: table_name === 'connext-contracts' ? 'Expired < :time' : 'CreatedAt < :time',
        ExpressionAttributeValues: {
          ':time': { N: (moment().subtract(table_name === 'connext-contracts' ? 0 : 4, 'hours').unix() * (['connext-contracts'].includes(table_name) ? 1000 : 1)).toString() },
        },
      };

      response = { data: await scan(params) };

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const { data } = { ...response };

        params = {
          TableName: table_name,
        };

        for (let j = 0; j < data.length; j++) {
          try {
            params.Key = {
              ID: data[j].ID,
            };

            if (data[j].SortKey) {
              params.Key.SortKey = data[j].SortKey;
            }

            await deleteItem(params);
          } catch (error) {}
        }
      }
    }
  }

  // return data
  return response;
};