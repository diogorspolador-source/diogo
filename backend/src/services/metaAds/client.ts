import axios from 'axios';
import { config } from '../../config.js';

export const metaClient = axios.create({
  baseURL: 'https://graph.facebook.com/v19.0',
  params: {
    access_token: config.metaAccessToken,
  },
});
