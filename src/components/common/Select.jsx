import React, { useEffect } from 'react'
import { Select } from 'antd'

const SelectComponent = ({ placeholder, value, action, data, selectedData, style, size }) => {

    const [dropdownVisible, setDropdownVisible] = React.useState(false);
    const [initialScrollY, setInitialScrollY] = React.useState(0);
    const scrollThreshold = window.innerHeight * 0.05;


    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Check if scroll exceeds the threshold
        if (Math.abs(currentScrollY - initialScrollY) > scrollThreshold && dropdownVisible) {
            setDropdownVisible(false);  // Close the dropdown if the scroll exceeds the threshold
        }
    };

    useEffect(() => {
        if (dropdownVisible) {
            setInitialScrollY(window.scrollY);  // Capture initial scroll position when dropdown opens
            window.addEventListener('scroll', handleScroll);
        } else {
            window.removeEventListener('scroll', handleScroll);
        }

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [dropdownVisible]);


    return (
        <Select
            style={{ ...style, }}
            showSearch
            placeholder={placeholder}
            onChange={action}
            value={selectedData}
            size={size}
            filterOption={(input, data) =>
                (data.children ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
            }
            open={dropdownVisible}
            onDropdownVisibleChange={setDropdownVisible}
        >
            {data.map((prod) => (
                <Select.Option key={prod.id} value={prod.id}>
                    {prod.name}
                </Select.Option>
            ))}

        </Select>
    )
}

export default SelectComponent