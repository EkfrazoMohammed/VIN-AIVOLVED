import React, { useEffect, useState } from 'react';
import { Button, Modal, Switch, ConfigProvider, Checkbox, Input } from 'antd';
import useApiInterceptor from '../../hooks/useInterceptor';
import { encryptAES } from '../../redux/middleware/encryptPayloadUtils';

const App = ({ state ,dispatchModalReducer, plantData }) => {


const apiCallInterceptor = useApiInterceptor();
const handleCancel = () => {
        dispatchModalReducer({ type: "MODAL_MACHINE_OPEN", payload: false });
    };

 
    const handlePostData = async () => {
        try {
            console.log(state?.machineNameCreate)
            if(!state?.machineNameCreate || state.machineNameCreate.length === 0 ){
                dispatchModalReducer({type:"MACHINE_ERROR", payload:"Please Fill Machine Name"})
            }
            else{

                const url = `machine/`;
                const payload = {
                    name: state?.machineNameCreate,
                    plant: plantData.id,
                    defect_status: null
                };
    
                console.log("Payload to be sent:", payload);
                const data = encryptAES(JSON.stringify(payload));
                const response = await apiCallInterceptor.post(url, { data });
                console.log("API Response:", response);
                dispatchModalReducer({ type: 'MODAL_MACHINE_OPEN', payload: false });  
            }

        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const handleChange = (e) =>{
    const value = e.target.value
    dispatchModalReducer({type:"MACHINE_ERROR", payload:""})

    if(value !== null || value !== undefined){
    return dispatchModalReducer({type:"CREATE_MACHINE", payload:value})
    }


    }
   

    return (
        <>
            <Modal
                open={state?.modalMachineOpen}
                title= {<div className='flex justify-center p-3 font-bold'>Create Machine</div>}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" loading={state?.loading} onClick={handlePostData}>
                        Create
                    </Button>,
                ]}
            >
                  <div className="">
                                 <Input autoComplete='off'  placeholder="*Enter Machine Name" type='text' name='machine_name' onChange={handleChange}  value={state?.machineNameCreate}  className='p-2 custom-input' />
                                 {state?.machineError ? <span style={{ fontWeight: '600', color: 'red' }}>{state?.machineError}</span> : ""}
                               </div>
      
            </Modal>
        </>
    );
};

export default App;
