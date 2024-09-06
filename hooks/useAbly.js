import { useEffect, useRef } from 'react';
import Ably from 'ably';

export function useAbly(channelName, callbackOnMessage) {
  const ablyRef = useRef(null);

  useEffect(() => {
    if (!ablyRef.current) {
      ablyRef.current = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_KEY);
    }

    const ably = ablyRef.current;

    const handleConnectionStateChange = (stateChange) => {
      console.log('Connection state changed:', stateChange.current);
      
      if (stateChange.current === 'connected') {
        const channel = ably.channels.get(channelName);
        channel.subscribe(callbackOnMessage);
      }
    };

    // Attach listener for connection state changes
    ably.connection.on('connectionStateChange', handleConnectionStateChange);

    return () => {
      const channel = ably.channels.get(channelName);
      channel.unsubscribe(callbackOnMessage);

      try {
        if (ably.connection.state === 'connected' || ably.connection.state === 'connecting') {
          ably.close();
        }
      } catch (error) {
        console.error('Error during Ably cleanup:', error);
      }

      ably.connection.off('connectionStateChange', handleConnectionStateChange);
    };
  }, [channelName, callbackOnMessage]);
}
