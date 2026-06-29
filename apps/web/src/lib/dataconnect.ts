import { getDataConnect, terminate } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';
import app from '@/firebase/firebaseConfig';

export let dataConnect = getDataConnect(app, connectorConfig);

export const terminateDataConnect = async () => {
  await terminate(dataConnect);
  dataConnect = getDataConnect(app, connectorConfig);
};
