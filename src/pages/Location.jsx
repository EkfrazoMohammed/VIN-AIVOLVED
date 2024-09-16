import React from 'react'

const Location = () => {

    const [locationArray, setLocationArray] = React.useState([
        {
            id: 1,
            name: "Pondicherry"
        },
        {
            id: 1,
            name: "Khamgaon"
        },
    ])

    return (
        <div className='bg-[#faf5f5] h-screen flex justify-top py-5  flex-col items-center gap-5'>
            <div className='bg-white p-4 rounded-full shadow-xl'>
                <img src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png" alt="" width={120} />
            </div>
            <div className="bg-white h-3/5 w-full max-w-[1280px] rounded-3xl text-center py-4 flex flex-col gap-3 shadow-lg">
                <div className="text-4xl font-bold px-3 flex-col flex justify-center items-center gap-2"> Locations<span className='w-20 bg-[#c3214f] h-1 rounded-lg '></span></div>
                <p className="text-xl font-semibold text-start px-3  flex-col flex justify-center items-start gap-2">Choose Locations<span className='w-20 bg-[#c3214f] h-1 rounded-lg '></span></p>
                <div className="flex flex-wrap justify-center gap-4  overflow-y-scroll p-1">
                    {
                        locationArray?.map((location, index) => {
                            return (
                                <div className="w-[300px] bg-white rounded-xl py-3 shadow-md border-1 border-slate-100 cursor-pointer">
                                    <img src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/131321hulremovebgpreview.png" alt="" />
                                    <p className='font-bold text-2xl'>{location.name}</p>
                                </div>
                            )
                        })
                    }



                </div>
            </div>
        </div>
    )
}

export default Location