// hooks/useAbly.js

import { useEffect, useRef } from 'react';
import Ably from 'ably';

export function useAbly(channelName, callbackOnMessage) {
  const ablyRef = useRef(null);

  useEffect(() => {
    const ably = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_KEY);
    ablyRef.current = ably;
    const channel = ably.channels.get(channelName);

    const onMessage = (message) => {
      callbackOnMessage(message);
    };

    channel.subscribe(onMessage);

    // Cleanup function
    return () => {
      try {
        channel.unsubscribe(onMessage);
        if (ably.connection.state === 'connected') {
          ably.close();
        }
      } catch (error) {
        console.error('Error during cleanup of Ably connection:', error);
      }
    };
  }, [channelName, callbackOnMessage]);

  return ablyRef.current;
}
