import React, { useEffect } from 'react'
import { Dropdown } from "antd";
import { IoIosArrowDown } from "react-icons/io";

const DropdownComponent = ({ menu, data }) => {

    const [visible, setVisible] = React.useState(false);

    const handleScroll = () => {
        // Close dropdown when page is scrolled
        setVisible(false);
    };

    useEffect(() => {
        // Add event listener for page scroll
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleVisibleChange = (flag) => {
        setVisible(flag); // Open or close the dropdown based on flag
    };


    return (
        <Dropdown
            overlay={menu}
            trigger={["click"]}
            visible={visible}
            onVisibleChange={handleVisibleChange}
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

export default DropdownComponent
