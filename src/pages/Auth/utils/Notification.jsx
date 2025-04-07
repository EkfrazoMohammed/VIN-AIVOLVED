import {
    notification,
  } from "antd";
  
  export const openNotification = (status, message) => {
    notification[status]({
      message: (
        <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#000" }}>
          {message}
        </div>
      ),
      duration: 2,
    });
  };