import React, { useEffect, useState } from 'react';
import { ConfigProvider, Table } from 'antd';
import { Hourglass } from 'react-loader-spinner';
import { getDefectNotification } from '../services/dashboardApi';
import useApiInterceptor from '../hooks/useInterceptor';
import { useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';

const Insights = () => {
const [loading , setLoading] = useState(false)
  const apiCallInterceptor = useApiInterceptor();

  const columns = [
    { title: 'Notification Text', dataIndex: 'notification_text', key: 'notification_text', responsive: ['md'], render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div> },
    { title: 'RCA 1', dataIndex: 'rca1', key: 'rca1', responsive: ['md'], render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div> },
    { title: 'RCA 2', dataIndex: 'rca2', key: 'rca2', responsive: ['md'], render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div> },
    { title: 'RCA 3', dataIndex: 'rca3', key: 'rca3', responsive: ['md'], render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div> },
    { title: 'RCA 4', dataIndex: 'rca4', key: 'rca4', responsive: ['md'], render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div> },
    { title: 'RCA 5', dataIndex: 'rca5', key: 'rca5', responsive: ['md'], render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div> },
    { title: 'RCA 6', dataIndex: 'rca6', key: 'rca6', responsive: ['md'], render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div> },
    { title: 'Recorded Date & Time', dataIndex: 'recorded_date_time', key: 'recorded_date_time', responsive: ['md'], render: (text) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div> },
    { title: 'Defect', dataIndex: 'defect', key: 'defect', responsive: ['md'] },
  ];

  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    position: ['topRight'],
    showSizeChanger: true,
  });

  const localPlantData = useSelector((state) => state?.plant?.plantData[0]);

  const defectNotification = async () => {
    try {
      setLoading(true)
      const response = await getDefectNotification(localPlantData.id, apiCallInterceptor , pagination.current , pagination.pageSize);
      setLoading(false)
      const { page_size, total_count, results } = response;
      setTableData(results);
      setPagination((prev) => ({
        ...prev,
        total: total_count,
        pageSize: page_size,
      }));
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  useEffect(() => {
    defectNotification();
  }, [pagination.current , pagination.pageSize]);

const handleTableChange =  (pagination) =>{
setPagination(pagination)
  }

  return (
    <div className="layout-content">
      {loading ? (
        <div
          style={{
            height: '60vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            marginTop: '1rem',
            borderRadius: '10px',
          }}
        >
          <Hourglass visible={true} height="40" width="40" ariaLabel="hourglass-loading" colors={['#06175d', '#06175d']} />
        </div>
      ) : (
                  <ConfigProvider
                  theme={{
                    components: {
                      Table: {
                        colorBgContainer: '#fff',
                        colorPrimary: '#000',
                        colorFillAlter: '#fff',
                        controlHeight: 48,
                        headerBg: '#43996a',
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
                  <Table columns={columns} dataSource={tableData} pagination={pagination} scroll={{ x: 'max-content' }} onChange={handleTableChange} style={{ margin: '1rem 0' }} />
                </ConfigProvider>
      )}
    </div>
  );
};

export default Insights;
