import * as React from "react";
import { userService } from "../services/user.service";

type Props = {
  setShowOverlay: any;
};

const LoginOverlayContent: React.FC<Props> = ({ setShowOverlay }) => {
  const handleLogOut = () => {
    userService.logout();
  };
  return (
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div className="mt-3 text-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Do you want to log out of this device?
        </h3>
        <div className=" flex flex-row space-x-2 items-center">
          <button
            onClick={handleLogOut}
            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Log Out
          </button>
          <button
            onClick={setShowOverlay(false)}
            className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginOverlayContent;
