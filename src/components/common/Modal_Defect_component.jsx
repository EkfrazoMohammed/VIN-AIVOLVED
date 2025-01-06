import React, { useEffect, useState } from 'react';
import { Button, Modal, Switch, ConfigProvider, Checkbox } from 'antd';
import useApiInterceptor from '../../hooks/useInterceptor';
import { decryptAES, encryptAES } from '../../redux/middleware/encryptPayloadUtils';

const App = ({ open, data, loading, dispatchModalReducer, machineActive, machineDefectsData, plantData ,callBack}) => {


const apiCallInterceptor = useApiInterceptor();


const defectsData  = data?.filter((item, index)=>  !machineDefectsData?.active_defects?.includes(item.id) && !machineDefectsData?.non_active_defects?.includes(item.id) )

  const handleCancel = () => {
        dispatchModalReducer({ type: "MODAL_OPEN", payload: false });
    };

    const activeDefects = machineDefectsData?.active_defects || [];
    const nonActiveDefects = machineDefectsData?.non_active_defects || [];

    const handleChange = async (checked, item) => {
        try {

            if (checked) {
                // Add to active_defects
                if (!activeDefects.includes(item.id)) {
                    activeDefects.push(item.id);
                }
                // Remove from non_active_defects
                const index = nonActiveDefects.indexOf(item.id);
                if (index > -1) {
                    nonActiveDefects.splice(index, 1);
                }
            } else {
                // Add to non_active_defects
                if (!nonActiveDefects.includes(item.id)) {
                    nonActiveDefects.push(item.id);
                }
                // Remove from active_defects
                const index = activeDefects.indexOf(item.id);
                if (index > -1) {
                    activeDefects.splice(index, 1);
                }
            }
      
    
            
            // dispatchModalReducer({type:"MACHINE_DEFECTS_DATA", payload:defect_status})


            // Optional: Call your API to persist changes (uncomment when needed)
            // const encryptedMachineId = encryptAES(JSON.stringify(machineActive.id));
            // const url = `machine/${encryptedMachineId}/`;
            // const payload = {
            //     name: machineActive.name,
            //     plant: plantData.id,
            //     defect_status: {
            //         active_defects: activeDefects,
            //         non_active_defects: nonActiveDefects,
            //     },
            // };
            // const data = encryptAES(JSON.stringify(payload));
            // const response = await apiCallInterceptor.put(url, { data });
            // console.log("API Response:", response);
        } catch (error) {
            console.error("Error updating defects:", error);
        }
    };

    const handlePostData = async () => {
        try {
        
           
            const encryptedMachineId = await encryptAES(JSON.stringify(machineActive?.id));
            const url = `machine/${encryptedMachineId}/`;
            const payload = {
                name: machineActive.name,
                plant: plantData.id,
                defect_status: {
                    active_defects: activeDefects,
                    non_active_defects: nonActiveDefects,
                },
            };

            const data = await encryptAES(JSON.stringify(payload));
            const response = await apiCallInterceptor.put(url, { data });
            dispatchModalReducer({ type: 'MODAL_OPEN', payload: false });  
            dispatchModalReducer({type:"MACHINE_DEFECTS_DATA", payload:payload.defect_status})

        } catch (error) {
            console.error("Error submitting data:", error);
            dispatchModalReducer({ type: 'MODAL_OPEN', payload: false });
        }
    };

    return (
        <>
            <Modal
                open={open}
                title={<div className='text-center p-2 text-[#43996a] font-bold'>Select Defects</div>}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" loading={loading} onClick={handlePostData}>
                        Submit
                    </Button>,
                ]}
            >
                <div className="overflow-y-auto h-[400px] w-full p-2">
                    <div className="flex w-full justify-between my-2 h-14 items-center text-center px-2 rounded-md bg-[#43996a] text-white font-bold"
                        style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}>
                        <span className='text-start w-1/4'>id</span>
                        <span className='text-center w-1/4'>Defect Name</span>
                        <span className='text-center w-1/4'>Color Code </span>
                        <span className='text-end w-1/4'>Set Active</span>
                    </div>
                    {defectsData?.map((item, index) => (
                        <div key={item.id} className="flex w-full justify-between my-2 h-14 items-center text-start px-2 rounded-md"
                            style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}>
                            <div className='text-start w-1/4'>{item.id}</div>
                            <div className='text-start w-1/4'>{item.name}</div>
                            <div className="w-1/4 h-full rounded-full">
                            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: item.color_code }}></div>
                            </div>
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
                                    defaultChecked={machineDefectsData?.active_defects?.includes(item.id)}
                                    onChange={(checked) => handleChange(checked, item)}
                                />
                            </ConfigProvider>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
};

export default App;
