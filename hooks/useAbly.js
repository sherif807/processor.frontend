import { useEffect, useRef } from 'react';
import Ably from 'ably';

export function useAbly(channelName, callbackOnMessage) {
  const ablyRef = useRef(null);

  useEffect(() => {
    if (!ablyRef.current) {
      ablyRef.current = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_KEY);
    }

    const channel = ablyRef.current.channels.get(channelName);


    return () => {
        
        try {
            // Close the Ably connection when done
            if (ablyRef.current.connection.state === 'connected' || ablyRef.current.connection.state === 'connecting' || ablyRef.current.connection.state === 'closed') {
            channel.unsubscribe(callbackOnMessage);
          ablyRef.current.close();
        }
      } catch (error) {
        console.error('Error during Ably cleanup:', error);
      }
    };
  }, [channelName, callbackOnMessage]);
}
