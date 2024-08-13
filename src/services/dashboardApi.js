export const getMachines = () => {
  const domain = `${baseURL}`;
  let url = `${domain}machine/?plant_name=${localPlantData.plant_name}`;
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${AuthToken}`,
      },
    })
    .then((response) => {
      const formattedMachines = response.data.results.map((machine) => ({
        id: machine.id,
        name: machine.name,
      }));
      setMachineOptions(formattedMachines);
    })
    .catch((error) => {
      console.error("Error fetching machine data:", error);
    });
};

export const getDepartments = () => {
  const domain = `${baseURL}`;
  let url = `${domain}department/?plant_name=${localPlantData.plant_name}`;
  axios
    .get(url, {
      headers: {
        Authorization: ` Bearer ${AuthToken}`,
      },
    })
    .then((response) => {
      const formattedDepartment = response.data.results.map((department) => ({
        id: department.id,
        name: department.name,
      }));
      setDepartmentOptions(formattedDepartment);
    })
    .catch((error) => {
      console.error("Error fetching department data:", error);
    });
};
