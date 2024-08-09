import React from 'react'

const TopHeader = ({clientName, clientLogoImgUrl}) => {
  return (
    <div className='top-header-container flex justify-between border-b-2 h-[75px] py-3 px-4 fixed top-0 right-0 bg-white w-[calc(100%-275px)] z-10'>
      <div className="client-name-w text-[20px] font-bold flex items-center">
        <select name="" id="" className='focus:outline-none'>
          <option value={clientName} selected="true">{clientName}</option>
        </select>
      </div>
      <div className="client-logo-w">
        <img src={clientLogoImgUrl} alt="client logo" className='w-[38px] h-[35px] object-contain bg-gray-200 rounded-full border' />
      </div>
    </div>
  )
}

export default TopHeader
// calc(100% - 275px)