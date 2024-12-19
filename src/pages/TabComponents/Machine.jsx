import React, { useEffect, useReducer, useState } from 'react';
import { Badge, Table, Switch, ConfigProvider, Button, Row, Col , Spin } from 'antd';
import useApiInterceptor from '../../hooks/useInterceptor';
import { useSelector } from 'react-redux';
// import { getTriggerDefects, postTriggerData } from '../../services/defectTriggerApi';
import { encryptAES } from '../../redux/middleware/encryptPayloadUtils';
import Modal from '../../components/common/Modal_Defect_component';
import ModalComponent from "../../components/common/ModalComponent";

// IMPORTING DEFECT IMAGE
import defectImage from "../../assets/images/add_defects_icon.png"

const Machine = ({ machinesdata, defectsData, plantData }) => {
  const apiCallInterceptor = useApiInterceptor();
  const [expandedRowKey, setExpandedRowKey] = useState(null);
  const [reloadKey, setReloadKey] = useState(0); // Used to force re-render
//  const defectTrigger  = [];
  const initialState = {
    loading: false,
    modalOpen: false,
    machineDefectsDatas: [],
    machineActive: {},
    defectActiveData: [],
    modalMachineOpen:false,
    machineNameCreate:null,
    machineError:"",
  };




  const reducer = (state, action) => {
    switch (action.type) {
      case 'LOADING':
        return { ...state, loading: action.payload };
      case 'MODAL_OPEN':
        return { ...state, modalOpen: action.payload };
      case 'MACHINE_DEFECTS_DATA':
        return { ...state, machineDefectsDatas: action.payload };
      case 'MACHINE_ACTIVE':
        return { ...state, machineActive: action.payload };
      case 'DEFECTS_ACTIVE_DATA':
        return { ...state, defectActiveData: action.payload };
      case 'MODAL_MACHINE_OPEN':
        return {...state,modalMachineOpen:action.payload};
      case 'CREATE_MACHINE':
        return{...state,machineNameCreate:action.payload };
      case "MACHINE_ERROR":
        return {...state,machineError:action.payload}  
      default:
        return state;
    }
  };

  const [state, dispatchModalReducer] = useReducer(reducer, initialState);

  const getDefectsData = async (record) => {
    try {
      dispatchModalReducer({ type: 'MACHINE_ACTIVE', payload: record });
      const encryptedMachineId = encryptAES(JSON.stringify(record.id));
      let url = `machine/${encryptedMachineId}/`;
      const response = await apiCallInterceptor.get(url);
      if (response && response?.data?.results?.defect_status === null) {
        dispatchModalReducer({ type: 'MACHINE_DEFECTS_DATA', payload: defectsData });
      } else {
        dispatchModalReducer({ type: 'MACHINE_DEFECTS_DATA', payload: response?.data?.results?.defect_status });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDefectsMachine = async (record) => {
    try {
      getDefectsData(record);
      dispatchModalReducer({ type: 'MODAL_OPEN', payload: true });
    } catch (error) {
      console.log(error);
    }
  };
 

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
      key: 'state',
      render: (innerRow) => (
        <Badge
          status={
            state.machineDefectsDatas?.active_defects?.includes(innerRow?.id)
              ? 'success'
              : 'error'
          }
          text={
            state.machineDefectsDatas?.active_defects?.includes(innerRow?.id)
              ? 'Active'
              : 'Inactive'
          }
        />
      ),
    },
    {
      title: 'Color',
      dataIndex: 'color_code',
      key: 'color',
      render: (text) => (
        <div
          className="h-8 w-8 rounded-full"
          style={{ backgroundColor: text }}
        ></div>
      ),
    },
    {
      title: 'Color Code',
      dataIndex: 'color_code',
      key: 'color_code',
    },
    {
      title: 'Toggle',
      key: 'toggle',
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
            checked={state.machineDefectsDatas?.active_defects?.includes(
              innerRow?.id
            )}
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
    {
      title:"Add Defects",
      dataIndex: 'id',
      render: (id, record) => <button className=' rounded-md text-white shadow-xl' onClick={() => handleAddDefectsMachine(record)}>
        <img src={defectImage} alt=""  className='w-10 h-auto'/>
      </button>
    },
  ];

  const handleChange = async (e, parentRow, innerRow) => {

      try {

        const activeDefects = state?.machineDefectsDatas?.active_defects 
        const nonActiveDefects = state?.machineDefectsDatas?.non_active_defects 

        if (e) {
            // Add to active_defects
            if (!activeDefects.includes(innerRow.id)) {
                activeDefects.push(innerRow.id);
            }
            // Remove from non_active_defects
            const index = nonActiveDefects.indexOf(innerRow.id);
            if (index > -1) {
                nonActiveDefects.splice(index, 1);
            }
        }
        
        if(!e) {
            // Add to non_active_defects
            if (!nonActiveDefects.includes(innerRow.id)) {
                nonActiveDefects.push(innerRow.id);
            }
            // Remove from active_defects
            const index = activeDefects.indexOf(innerRow.id);
            if (index > -1) {
                activeDefects.splice(index, 1);
            }
        }

 
           const encryptedMachineId = encryptAES(JSON.stringify(parentRow.id));
                const url = `machine/${encryptedMachineId}/`;
                const payload = {
                    name: parentRow.name,
                    plant: plantData.id,
                    defect_status: {
                        active_defects:activeDefects ,
                        non_active_defects: nonActiveDefects,
                    },
                    machine:parentRow.id,
                    defect:innerRow.id,
                    status:e ? 1 : 0
                };
    
                const data = encryptAES(JSON.stringify(payload));
                const response = await apiCallInterceptor.put(url, { data });
             
                dispatchModalReducer({type:"MACHINE_DEFECTS_DATA", payload:payload.defect_status})
    
} catch (error) {
    console.log(error)
}



    // const triggeredDefect = {
    //   machine_id: parentRow.id,
    //   machine_name: parentRow.name,
    //   defect_id: innerRow.id,
    //   defect_name: innerRow.name,
    //   defect_active: e,
    // };

    // const updatedDefects = parentRow.defects.map((item) =>
    //   item.id === innerRow.id ? { ...item, is_active: e } : item
    // );

    // const updatedParentRow = {
    //   ...parentRow,
    //   defects: updatedDefects,
    // };

    // const updatedResultsData = defectTrigger?.resultsData?.map((val) =>
    //   val.id === parentRow.id ? { ...val, defects: updatedParentRow.defects } : val
    // );

    // const postData = {
    //   plant: localPlantData.id,
    //   current_status: updatedResultsData,
    //   triggered_defect: triggeredDefect,
    // };

    // await postTriggerData(apiCallInterceptor, postData);
    // getTriggerDefects(localPlantData.id, apiCallInterceptor);
    setReloadKey(prevKey => prevKey + 1); // Trigger re-render
  };


  const dataSource = machinesdata.map((machine, i) => ({
    key: i.toString(),
    name: machine.name,
    id: machine.id,
    // defects: defectTrigger?.triggeredData?.defects[machine.id],
  }));

  const defectsActiveData = defectsData.filter((item) => state?.machineDefectsDatas?.active_defects?.includes(item.id));
  const defectsInactiveData = defectsData.filter((item) => state?.machineDefectsDatas?.non_active_defects?.includes(item.id));

  const expandedRowRender = (parentRow) => (
    
      state.loading ? <div className="flex justify-center items-center h-32"><Spin tip="Loading" size="medium" /></div>  :

      <Table
        rowKey="id" // Ensure unique keys
        columns={expandColumns(parentRow)}
        dataSource={[...defectsActiveData, ...defectsInactiveData]}
        pagination={false}
      />
    
  );

  const handleRowExpand = async (expanded, record) => {
    if (expanded) {
      setExpandedRowKey(record.key);
      dispatchModalReducer({type:"LOADING",payload:true})
      await getDefectsData(record);
      setTimeout(()=>{
        dispatchModalReducer({type:"LOADING",payload:false})
      },[400])
    } else {
      setExpandedRowKey(null);
    }
  };

  return (
    <>
    <ModalComponent state={state} dispatchModalReducer={dispatchModalReducer} plantData={plantData}   />
      <Modal
        open={state.modalOpen}
        loading={state.loading}
        dispatchModalReducer={dispatchModalReducer}
        data={defectsData}
        machineDefectsData={state.machineDefectsDatas}
        machineActive={state.machineActive}
        plantData={plantData}
        callBack={() => {}}
      />
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
        <Row className='flex justify-end my-3'>
          <Col span={3}>
            <Button className='commButton' type="primary" style={{ width: '100%', padding: '0' }} danger onClick={()=>dispatchModalReducer({type:"MODAL_MACHINE_OPEN",payload:true})}>
              Create machine
            </Button>
          </Col>
        </Row>
        <Table
          key={reloadKey} // Key for re-render
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
            onExpand: handleRowExpand,
          }}
        />
      </ConfigProvider>
    </>
  );
};

export default Machine;
