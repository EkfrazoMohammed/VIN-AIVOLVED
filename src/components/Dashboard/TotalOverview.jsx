import React from "react";
import { FaGears } from "react-icons/fa6";
import PropTypes from "prop-types";
import LoaderIcon from "../LoaderIcon";

const TotalOverview = ({ machine, textData , loading , countData}) => {
  return (
    <div className={`overview-container dashboard-data w-3/12 my-2  bg-no-repeat flex flex-col ${!loading ? "justify-between" : "justify-around"}  p-3 rounded-md object-cover bg-cover`}>
        <h4 className="avd-title text-[#313131] text-lg">Total Overview</h4>
        {
          !loading ? 
<>
<div className="title-w">
        <p className="avd-desc text-[#838383] text-base">
          {textData?.message?.split("_").join(" ")}

        </p>
        <p className="avd-title text-[#585858] text-lg py-2">
          {countData?.toFixed(2)}
        </p>
      </div>

      <div className="overview-data-w text-[#585858] font-semibold">
        <div className="ovd-list-w flex justify-between">
          <span className="flex gap-1 items-center">
            <FaGears /> Total Machine 
          </span>
          <div className="data-info">{machine?.length}</div>
        </div>
      </div>
</>
      : 
      <div className="flex justify-center">
        <LoaderIcon text="Loading..." />
      </div>
        }
    </div>
  );
};
TotalOverview.propTypes = {
  textData: PropTypes.any,
  machine:PropTypes.any,
  loading:PropTypes.any
};
export default TotalOverview;
