import { useEffect, useRef } from 'react';
import Ably from 'ably';

export function useAbly(channelName, callbackOnMessage) {
  const ablyRef = useRef(null);

  useEffect(() => {
    if (!ablyRef.current) {
      ablyRef.current = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_KEY);
    }

    const ably = ablyRef.current;

    if (ably.connection.state === 'connected' || ably.connection.state === 'connecting') {
      const channel = ably.channels.get(channelName);
      channel.subscribe(callbackOnMessage);

      return () => {
        channel.unsubscribe(callbackOnMessage);

        try {
          if (ably.connection.state === 'connected' || ably.connection.state === 'connecting') {
            ably.close();
          }
        } catch (error) {
          console.error('Error during Ably cleanup:', error);
        }
      };
    } else {
      console.error('Ably connection is not active');
    }
  }, [channelName, callbackOnMessage]);
}
