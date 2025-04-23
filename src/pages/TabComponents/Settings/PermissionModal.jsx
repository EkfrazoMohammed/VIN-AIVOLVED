import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col } from "antd";

const PermissionModal = ({
  permissionData,
  selectedRole,
  modalOpen,
  setModalOpen,
  handleUpdatePermission,
}) => {
  const [permissionState, setPermissionState] = useState({});

  // Initialize permissionState only with boolean fields from permissionData
  useEffect(() => {
    if (permissionData) {
      
      const booleanFields = Object.entries(permissionData)
        .filter(([_, value]) => typeof value === "boolean")
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
  
      if (selectedRole === "User") {
        const filteredFields = Object.entries(booleanFields)
          .filter(([key]) => key !== "plant" && key !== "location")
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});
  
        setPermissionState(filteredFields);
      } else if (selectedRole === "Manager") {
        const filteredFields = Object.entries(booleanFields)
        .filter(([key]) => key !== "location")
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        setPermissionState(filteredFields);
      }
    }
  }, [permissionData, selectedRole]);
  

  // Handle checkbox change
  const handleCheckboxChange = (key) => {
    setPermissionState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handlePost = async () => {
    const payload = {
      ...permissionState,
      id: permissionData.id,
      user: permissionData.user,
    };
    handleUpdatePermission(payload);
  };

  if (!permissionData) return null;

  return (
    <Modal
      open={modalOpen}
      centered
      title="Update Permission"
      onCancel={() => setModalOpen(false)}
      footer={[
        <Button
          key="cancel"
          className="commButton border-0"
          type="primary"
          style={{ color: "#fff" }}
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          className="commButton border-0"
          type="primary"
          style={{ color: "#fff" }}
          onClick={handlePost}
        >
          Update Permission
        </Button>,
      ]}
    >
      <Row
        gutter={[16, 16]}
        style={{ margin: "1rem", display: "flex", flexDirection: "column" }}
      >
        <Col className="flex flex-wrap gap-4">
          {Object.entries(permissionState).map(([key, value]) => (
            <div className="flex gap-2 w-[45%]" key={key}>
              <label
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleCheckboxChange(key)}
                  className="h-4 w-4 cursor-pointer"
                  disabled={key === "dashboard"}
                />
                <span className="text-md">
                  {key.replace(/_/g, " ").toUpperCase()}
                </span>
              </label>
            </div>
          ))}
        </Col>
      </Row>
    </Modal>
  );
};

export default PermissionModal;
