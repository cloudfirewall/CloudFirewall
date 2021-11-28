import * as React from "react";

type Props = {};

const OverlayContent: React.FC<Props> = ({}) => {
  return (
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div className="mt-3 text-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Do you want to delete the security group?
        </h3>
        <div className="mt-2 px-7 py-3">
        <div className="flex">
            <span className="font-semibold">Server Name: </span>
            <span className="font-normal pl-2">Server-1</span>
          </div>
          <div className="flex">
            <span className="font-semibold">Server ID: </span>
            <span className="font-normal pl-2">#54SDVS345</span>
          </div>

        </div>
        <div className=" flex flex-row space-x-2 items-center">
          <button
            id="ok-btn"
            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Delete
          </button>
          <button
            id="ok-btn"
            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverlayContent;
