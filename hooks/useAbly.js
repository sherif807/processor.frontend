import { useEffect } from 'react';
import Ably from 'ably';

export function useAbly(channelName, callbackOnMessage) {
  useEffect(() => {
    const ably = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_KEY);
    const channel = ably.channels.get(channelName);

    channel.subscribe(callbackOnMessage);

    return () => {
      channel.unsubscribe(callbackOnMessage);

      try {
        // Check if Ably is still active before closing
        // if (ably.connection.state === 'connected' || ably.connection.state === 'connecting') {
        //   ably.close();
        // }
      } catch (error) {
        console.error('Error during Ably cleanup:', error);
      }
    };
  }, [channelName, callbackOnMessage]);
}
