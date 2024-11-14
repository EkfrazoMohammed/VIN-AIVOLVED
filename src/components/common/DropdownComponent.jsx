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
    trigger={['click']}
    className="text-[35px] text-gray-500 font-semibold bg-gray-200 p-3"
  >
   
   <div className="number" style={{ cursor: "pointer" }}>
                <div className="flex items-center justify-between">
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
