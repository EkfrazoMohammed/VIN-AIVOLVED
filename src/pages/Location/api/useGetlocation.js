export const  fetchLocationData = async(accessToken , apiCallInterceptor , setPlant ,setLoader) =>{
    try {
        if (!accessToken) {
          return;
        }
        const res = await apiCallInterceptor.get(`/locations/`);
        const { results } = res.data;

        if (results) {
          setPlant(results);
        }
      } catch (err) {
        console.log("Error fetching plant data:");
        if (err.response && err.response.data.code === "token_not_valid") {
          console.log("Token is invalid or expired.");
        } else {
          console.log("Error:", err.message || "Unknown log occurred");
        }
      } finally {
        setLoader(false);
      }
}