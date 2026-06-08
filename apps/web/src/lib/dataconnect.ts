import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';
import app from '@/firebase/firebaseConfig';

export const dataConnect = getDataConnect(app, connectorConfig);
