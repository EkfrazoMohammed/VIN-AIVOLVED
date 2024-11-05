import React, { useEffect, useState } from 'react';
import { Badge, Table, Switch, ConfigProvider } from 'antd';
import useApiInterceptor from '../../hooks/useInterceptor';
import { useSelector } from 'react-redux';
import { getTriggerDefects, postTriggerData } from '../../services/defectTriggerApi';

const App = () => {
    const [expandedRowKey, setExpandedRowKey] = useState(null);

    const apiCallInterceptor = useApiInterceptor();

    const localPlantData = useSelector((state) => state?.plant?.plantData[0]);
    const defectTrigger = useSelector(state => state?.defectTrigger)

    const expandColumns = (parentRow) => [
        {
            title: 'Defect Name',
            dataIndex: 'name',
            key: 'defect',
        },
        {
            title: 'Defect Id',
            dataIndex: 'id',
            key: 'defect_id',
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (text) => <Badge status={text ? 'success' : 'error'} text={text ? 'Active' : 'Inactive'} />,
        },
        {
            title: 'Color',
            dataIndex: 'color_code',
            key: 'color',
            render: (text) => <div className="h-8 w-8 rounded-full" style={{ backgroundColor: text }}></div>,
        },
        {
            title: 'Color Code',
            dataIndex: 'color_code',
            key: 'color_code',
        },
        {
            title: 'Toggle',
            key: 'state',
            render: (innerRow) => (
                <ConfigProvider
                    theme={{
                        components: {
                            Switch: {
                                colorPrimary: '#298f29',
                            },
                        },
                    }}
                >
                    <Switch
                        defaultChecked={innerRow.is_active}
                        onChange={(e) => handleChange(e, parentRow, innerRow)}
                    />
                </ConfigProvider>
            ),
        },
    ];

    const columns = [
        {
            title: 'Machine Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Machine ID',
            dataIndex: 'id',
            key: 'id',
        },
    ];

    useEffect(() => {
        getTriggerDefects(localPlantData.id, apiCallInterceptor)
    }, [])

    let requestQueue = Promise.resolve();
    const handleChange = async (e, parentRow, innerRow) => {
        const triggeredDefect = {
            machine_id: parentRow.id,
            machine_name: parentRow.name,
            defect_id: innerRow.id,
            defect_name: innerRow.name,
            defect_active: e,
        };

        // Update the defects array for the parentRow
        const updatedDefects = parentRow.defects.map((item) =>
            item.id === innerRow.id ? { ...item, is_active: e } : item
        );

        // Update the parent row with new defects
        const updatedParentRow = {
            ...parentRow,
            defects: updatedDefects,
        };

        // Update resultsData by finding the corresponding machine and replacing its defects
        const updatedResultsData = defectTrigger?.resultsData?.map((val) =>
            val.id === parentRow.id ? { ...val, defects: updatedParentRow.defects } : val
        );

        // PostData includes the updated result data
        const postData = {
            plant: localPlantData.id,
            current_status: updatedResultsData,
            triggered_defect: triggeredDefect,
        };
        // Add the current API call to the queue
        requestQueue = requestQueue.then(async () => {
            try {
                await postTriggerData(apiCallInterceptor, postData);
                getTriggerDefects(localPlantData.id, apiCallInterceptor)
            } catch (error) {
                console.error("API call failed:", error);
            }
        });
    };



    const expandDataSource = (defects) =>
        defects.map((defect, i) => ({
            key: i.toString(),
            name: defect.name,
            id: defect.id,
            is_active: defect.is_active,
            color_code: defect.color_code,
        }));

    const dataSource = defectTrigger?.triggeredData?.machinesData.map((machine, i) => ({
        key: i.toString(),
        name: machine.name,
        id: machine.id,
        defects: defectTrigger?.triggeredData?.defects[machine.id], // Get defects for this machine
    }));

    const expandedRowRender = (parentRow) => (
        <Table
            columns={expandColumns(parentRow)}
            dataSource={expandDataSource(defectTrigger?.triggeredData?.defects[parentRow.id])}
            pagination={false}
        />
    );

    // Function to handle row expansion (accordion style)
    const handleRowExpand = (expanded, record) => {
      if (expanded) {
        setExpandedRowKey(record.key);  // Open the clicked row
      } else {
        setExpandedRowKey(null);  // Close the row
      }
    };

    return (
        <ConfigProvider
        theme={{
          components: {
            Table: {
              colorBgContainer: '#fff',
              colorPrimary: '#000',
              colorFillAlter: '#fff',
              controlHeight: 48,
              headerBg: '#ad3737',
              headerColor: '#fff',
              rowHoverBg: '#e6f7ff',
              padding: '1rem',
              boxShadowSecondary:
                '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
              fontWeightStrong: 500,
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          expandable={{
            expandedRowRender,  
            expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
            onExpand: handleRowExpand,  
          }}
          className="custom-table"
          style={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        />
      </ConfigProvider>
    );

};

export default App;
