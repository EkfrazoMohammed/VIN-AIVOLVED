import React from 'react';



const MachinesParameter = () => {



 
  return (
    <div className="layout-content">


      <div className="machineParameterContainer">

        {/* {data?.map((item) => (
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
                    <div key={value} className='secondLinecolumnDataValue'>{value}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))} */}
      </div>

    </div>
  );
};

export default MachinesParameter;
