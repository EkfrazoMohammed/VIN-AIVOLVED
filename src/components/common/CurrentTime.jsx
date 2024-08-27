import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <p className='w-full text-white bg-[#0000003b] text-center py-3 flex gap-3 justify-center'>
        <span>{currentDateTime.toLocaleDateString()}</span>
        <span>{currentDateTime.toLocaleTimeString()}</span>
      </p>
    </div>
  );
};

export default CurrentTime;
