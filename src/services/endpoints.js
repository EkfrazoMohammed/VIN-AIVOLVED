const baseURL = process.env.REACT_APP_API_BASE_URL || "https://demo.indusvision.ai/api/";

const getMachinesEndpoint = (plantName) => `${baseURL}machine/?plant_name=${encodeURIComponent(plantName)}`;
const getProductsEndpoint = (plantName) => `${baseURL}product/?plant_name=${encodeURIComponent(plantName)}`;
// const getDashboardDataEndpoint = (queryParams) => `${baseURL}dashboard/${new URLSearchParams(queryParams).toString()}`;
const getDashboardDataEndpoint = (plantId) => `${baseURL}dashboard?plant_id=${encodeURIComponent(plantId)}`;
const getDefectVsMachineEndpoint = (plantId) => `${baseURL}defct-vs-machine/?plant_id=${encodeURIComponent(plantId)}`;
const getDefectsEndpoint = () => `${baseURL}defect`;

// Export endpoints
export {
  getMachinesEndpoint,
  getProductsEndpoint,
  getDashboardDataEndpoint,
  getDefectVsMachineEndpoint,
  getDefectsEndpoint
};
