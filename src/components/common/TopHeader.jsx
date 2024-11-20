import PropTypes from 'prop-types'
import React from 'react'

const TopHeader = ({clientName, clientLogoImgUrl}) => {
  return (
    <div className='top-header-container flex justify-between border-b-2 h-[75px] py-3 px-4 fixed top-0 right-0 bg-[#06175d] w-[calc(100%-270px)] z-10 border-l-2'>
      <div className="flex text-white  justify-center items-center gap-2 text-lg font-semibold">
        <span className=" bg-slate-200 w-16 h-16 rounded-md ">
        <img src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/unileverremovebgpreview.png" alt="" className='w-full h-full object-contain bg-gray-200 rounded-full border' />
        </span>
        <span>Hindustan Unilever Limited</span>
      </div>
      <div className="client-name-w text-[20px] font-bold flex items-center text-white">
        {clientName}
      </div>
    </div>
  )
}
TopHeader.propTypes = {
  clientName:PropTypes.any,
  clientLogoImgUrl:PropTypes.any
}
export default TopHeader