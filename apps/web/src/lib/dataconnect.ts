import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

export const dataConnect = getDataConnect(connectorConfig);
