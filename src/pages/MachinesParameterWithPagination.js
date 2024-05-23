import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import axios from 'axios';

const MachinesParameterWithPagination = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // Number of cards per page

  const getData = async () => {
    try {
      const response = await axios.get("http://vin.aivolved.in:8100/machine_temprature/");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Calculate index range for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;

  // Data to display on the current page
  const currentPageData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="layout-content">
      <div className="machineParameterContainer">
        {currentPageData.map((item) => (
          <div className='mycardContainer' key={item.id}>
                    <div className="cardUpper">
                        <div className='cardHeading'>
                            Machine {item.machine}
                        </div>
                    </div>
                    <div className="cardBottom">
                        <div className='firstLine'>
                            <div className='columnData'>
                                <div className='columnDataHeading'>Horizontal</div>
                                <div className='columnDataValue'>{item.horizontal}</div>
                            </div>
                            <div className='columnData'>
                                <div className='columnDataHeading'>Teeth</div>
                                <div className='columnDataValue'>{item.teeth.toString()}</div>
                            </div>
                            <div className='columnData'>
                                <div className='columnDataHeading'>coder</div>
                                <div className='columnDataValue'>{item.coder.toString()}</div>
                            </div>
                        </div>
                        <div className='secondLine'>
                            <div className='secondLinecolumnData'>
                                <div className='secondLinecolumnDataHeading'>Vertical</div>
                                {JSON.parse(item.vertical).map((value, index) => (
                                    <div key={index} className='secondLinecolumnDataValue'>{value}</div>
                                ))}
                            </div>
                        </div>
                </div>
          </div>
          
        ))}
      </div>
      <Pagination
        current={currentPage}
        total={data.length}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </div>
  );
};

export default MachinesParameterWithPagination;
