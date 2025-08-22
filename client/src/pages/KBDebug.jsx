import { useEffect } from 'react';
import api from '../lib/api';

export default function KBDebug() {
  useEffect(() => {
    async function testToken() {
      try {
        const { data } = await api.get('/kb/debug'); // your debug endpoint
        console.log('Decoded token info:', data);
      } catch (err) {
        console.error('Error fetching debug:', err.response?.data || err.message);
      }
    }

    testToken();
  }, []);

  return <div>Check console for debug info</div>;
}