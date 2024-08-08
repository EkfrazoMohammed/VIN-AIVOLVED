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
      <p className='w-full text-white bg-[#0000003b] p-2'>{currentDateTime.toLocaleDateString()} {currentDateTime.toLocaleTimeString()}</p>
    </div>
  );
};

export default CurrentTime;
