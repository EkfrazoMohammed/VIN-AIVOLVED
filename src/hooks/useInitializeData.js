import { useEffect, useState } from 'react';
import { getMachines, getDepartments, initialDateRange, initialTableData, initialProductionData, prodApi, getSystemStatus } from '../services/api';

const useInitializeData = (plantData, authToken) => {
  const [machineOptions, setMachineOptions] = useState([]);
  const [initializationError, setInitializationError] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const machines = await getMachines(plantData.plant_name, authToken);
        setMachineOptions(machines);
        // Call other initialization functions here
        await Promise.all([
          getDepartments(),
          initialDateRange(),
          initialTableData(),
          initialProductionData(),
          prodApi(),
          getSystemStatus()
        ]);
      } catch (error) {
        //console.error("Initialization error:", error);
        setInitializationError(error);
      }
    };

    initializeData();
  }, [plantData, authToken]);

  return { machineOptions, initializationError };
};

export default useInitializeData;
