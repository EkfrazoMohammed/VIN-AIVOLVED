// WebSocketService.js

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const useWebSocket = () => {
  const [notifications, setNotifications] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [prevNotificationLength, setPrevNotificationLength] = useState(0);

  useEffect(() => {
    const socket = new WebSocket(`wss://hul.aivolved.in/ws/notifications/`);

    socket.onopen = () => {
      //console.log("WebSocket connection established");
      setIsSocketConnected(true);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setNotifications(prevNotifications => {
        const newNotifications = [...prevNotifications, message.notification];
        // Display toast notification
        toast.error(message.notification, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return newNotifications;
      });
    };

    socket.onclose = () => {
      //console.log("WebSocket connection closed");
      setIsSocketConnected(false);
    };

    socket.onerror = (error) => {
      //console.error("WebSocket error:", error);
      setIsSocketConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (notifications.length > prevNotificationLength) {
      setPrevNotificationLength(notifications.length);
    }
  }, [notifications]);

  return {
    notifications,
    isSocketConnected,
  };
};

export default useWebSocket;
