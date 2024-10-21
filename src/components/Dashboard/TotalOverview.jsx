import React from "react";
import { FaGears } from "react-icons/fa6";

const TotalOverview = ({ machine, textData }) => {
  return (
    <div className="overview-container dashboard-data w-3/12 h-[257px] bg-no-repeat flex flex-col justify-between p-3 rounded-md object-cover bg-cover">
      <div className="title-w">
        <h4 className="avd-title text-[#ffffff] text-lg py-2">Total Overview</h4>
        <p className="avd-desc text-[#dddddd] text-base">
          {textData?.message.split("_").join(" ")}

        </p>
        <p className="avd-title text-[#ffffff] text-lg py-2">
          {textData?.average_params_count.toFixed(2)}
        </p>
      </div>

      <div className="overview-data-w text-[#ffffff]">
        <div className="ovd-list-w flex justify-between">
          <span className="flex gap-1 items-center">
            <FaGears /> Total Machine
          </span>
          <div className="data-info">{machine?.length}</div>
        </div>
      </div>
    </div>
  );
};

export default TotalOverview;
