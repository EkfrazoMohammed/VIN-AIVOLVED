import { ConfigProvider, Table } from "antd";
import React, { useEffect } from "react";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import useApiInterceptor from "../../../hooks/useInterceptor";
import { useSelector } from "react-redux";
import { encryptAES } from "../../../redux/middleware/encryptPayloadUtils";
import PermissionModal from "./PermissionModal";
import { toast } from "react-toastify";

const UserTable = ({ userData }) => {
  const apiInterceptor = useApiInterceptor();

  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );

  const [permissions, setPermission] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
    },
    {
      title: "Location",
      dataIndex: "location_name",
    },
    {
      title: "Role",
      dataIndex: "role_name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
    },
    {
      title: "Edit",
      render: (record) => (
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            setModalOpen(true);
            fetchPermissions(record.id);
          }}
        >
            {
                record?.role !== "User" && 
          <EditOutlined   />
            }
        </button>
      ),
    },
  ];

  const fetchPermissions = async (id) => {
    try {
      if (!accessToken) {
        return;
      }
      const encryptedId = encryptAES(JSON.stringify(id));
      const res = await apiInterceptor.get(`/user-permissions/${encryptedId}/`);
      const { results } = res.data;
      setPermission(results);
      if (results) {
        //   setPlants(results);
      } else {
        console.warn("No results found in the response");
      }
    } catch (err) {
      console.log("Error fetching plant data:");
      if (err.response && err.response.data.code === "token_not_valid") {
        console.log("Token is invalid or expired.");
      } else {
        console.log("Error:", err.message || "Unknown log occurred");
      }
    }
  };

  const handleUpdatePermission = async (updatedPermissions) => {
    try {
      if (!accessToken) {
        return;
      }
    
      const encryptedData = encryptAES(JSON.stringify(updatedPermissions));
      const encryptedID = encryptAES(JSON.stringify(updatedPermissions.id));
      const res = await apiInterceptor.put(
        `/user-permissions/${encryptedID}/`,
        { data: encryptedData }
      );
      if (res.status === 200) {
      toast.success("Permissions updated successfully!");
        setModalOpen(false);
        fetchPermissions(updatedPermissions.user); 
      } else {
        console.error("Failed to update permissions:", res.data);
      }
    } catch (err) {
      console.error("Error updating permissions:", err);
    }
  }

  return (
    <>
      <PermissionModal
        permissionData={permissions}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        handleUpdatePermission={handleUpdatePermission}
      />

      <ConfigProvider
        theme={{
          components: {
            Table: {
              colorBgContainer: "#fff",
              colorPrimary: "#000",
              colorFillAlter: "#fff",
              controlHeight: 48,
              headerBg: "#43996a",
              headerColor: "#fff",
              rowHoverBg: "#e6f7ff",
              padding: "1rem",
              boxShadowSecondary:
                "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
              fontWeightStrong: 500,
            },
          },
        }}
      >
        <Table rowKey="id" columns={columns} dataSource={userData} />
      </ConfigProvider>
    </>
  );
};

export default UserTable;
