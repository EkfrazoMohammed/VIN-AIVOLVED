import React, { useEffect } from 'react'
import { Dropdown  } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import PropTypes from 'prop-types';

const DropdownComponent = ({ items, data }) => {

    const [visible, setVisible] = React.useState(false);

    const handleScroll = () => {
        setVisible(false);
    };

    useEffect(() => {
        // Add event listener for page scroll
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleVisibleChange = (flag) => {
        setVisible(flag); // Open or close the dropdown based on flag
    };
    
      return (
    
        
    
        <Dropdown
   menu={{
    items,
  }}
  open={visible}
  onOpenChange={handleVisibleChange}
  arrow
    trigger={['click']}
    className="text-[35px]  p-3 font-semobold"
    placement="bottom"
  
    dropdownRender={(menu) => (
        <div
          style={{
            maxHeight: "200px", // Fixed height
            overflow: "hidden", // Hide overflow
            overflowY: "auto", // Optional: Enable scrolling if necessary
    cursor:"none"
          }}
        >
          {menu}
        </div>
      )}
    >
   
   <div className="number " style={{ cursor: "pointer" }}>
                <div className="flex items-center justify-between  rounded-md px-2 bg-[#edf0ff]">
                    {Object.keys(data).length}
                    <IoIosArrowDown className="text-[18px]" />
                </div>
            </div>
        
  </Dropdown>
    )
}


DropdownComponent.propTypes = {
    items:PropTypes.any,
    data:PropTypes.any
}
export default DropdownComponent
