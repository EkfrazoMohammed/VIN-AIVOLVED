import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Hourglass } from 'react-loader-spinner';
import { setLocationData } from "../redux/slices/locationSlice";
import useApiInterceptor from "../hooks/useInterceptor";
import { useNavigate } from 'react-router-dom';
const Location = () => {

    const [locationArray, setLocationArray] = React.useState([
        {
            id: 1,
            is_active: true,
            location_name: "Pondi",

        },
        {
            id: 2,
            is_active: true,
            location_name: "Khamgaon",

        },
        {
            id: 3,
            is_active: false,
            location_name: "New",

        },
    ])

    const apiCallInterceptor = useApiInterceptor()
    const [locations, setLocations] = useState([
        {
            id: 1,
            is_active: true,
            location_name: "Pondi",

        },
        {
            id: 2,
            is_active: true,
            location_name: "Khamgaon",

        },
        {
            id: 3,
            is_active: false,
            location_name: "New",

        },
    ]);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
    const handleStorage = (locationData) => {
        if (locationData && Array.isArray(locationData) && locationData.length > 0) {
            dispatch(setLocationData(locationData));
            navigate('/plant');
        } else {
            console.log('Invalid or empty location data:', locationData); // Handle invalid data
        }
    };


    // useEffect(() => {
    //     const fetchLocationData = async () => {
    //         try {
    //             if (!accessToken) {
    //                 console.log("Authorization token is missing");
    //                 return;
    //             }

    //             const res = await apiCallInterceptor.get(`/location/`)
    //             const { results } = res.data

    //             if (results) {
    //                 setLocations(results);
    //             } else {
    //                 console.warn("No results found in the response");
    //             }
    //         } catch (err) {
    //             console.log("Error fetching plant data:", err);
    //             if (err.response && err.response.data.code === "token_not_valid") {
    //                 console.log("Token is invalid or expired.");
    //             }
    //         } finally {
    //             setLoader(true);
    //         }
    //     };

    //     fetchLocationData();
    // }, [accessToken]);
console.log(locations)

    return (
        <div className='bg-[#faf5f5] h-screen flex justify-top py-5  flex-col items-center gap-5'>
            <div className='bg-white p-4 rounded-full shadow-xl'>
                <img src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png" alt="" width={80} />
            </div>

            {loader ?
                <div className="h-[50vh] flex justify-center items-center">
                    <Hourglass
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="hourglass-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        colors={[" #ec522d", "#ec522d"]}
                    />
                </div>
                :
                <>
                    <div className="bg-white h-3/5 w-full max-w-[1200px] rounded-3xl text-center py-2 flex flex-col gap-3 shadow-lg">
                        <div className="text-4xl font-bold px-3 flex-col flex justify-center items-center gap-2"> Locations<span className='w-20 bg-[#c3214f] h-1 rounded-lg '></span></div>
                        <p className="text-xl font-semibold text-start px-3  flex-col flex justify-center items-start gap-2">Choose Locations<span className='w-20 bg-[#c3214f] h-1 rounded-lg '></span></p>
                             {locations.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4  overflow-y-scroll p-1">
                                   {locations?.map((location, index) => {
                                    return (
                                        <div className="w-[300px] bg-white rounded-xl py-3 shadow-md border-1 border-slate-100 cursor-pointer"
                                         key={location.id}
                                        onClick={() => handleStorage([location])}>
                                            <img src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/131321hulremovebgpreview.png" alt="" />
                                            <p className='font-bold text-2xl'>{location.location_name}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )}
                    </div>
                </>
            }
        </div>
    )
}

export default Location