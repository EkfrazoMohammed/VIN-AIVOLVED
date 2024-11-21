import React, { useState, useEffect } from 'react';

const CurrentTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div >
      <p className='w-full text-white bg-[#06175d] text-center py-3 flex gap-2 justify-center font-bold'>
        <span>{currentDateTime.toLocaleDateString("en-GB")}</span>
        <span>{currentDateTime.toLocaleTimeString()}</span>
      </p>
    </div>
  );
};

export default CurrentTime;
