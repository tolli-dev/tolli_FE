const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'tolli_FE',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

