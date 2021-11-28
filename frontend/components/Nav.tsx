import React from "react";
import { Cloud, User } from "react-feather";
import BackButton from "./BackButton";

type Props = {
  title: string;
  showBackButton: boolean;
};

const Nav: React.FC<Props> = ({ title, showBackButton = true, children }) => {
  return (
    <nav className="w-screen px-4 p-1 bg-green-900 drop-shadow-md">
      <div className="flex flex-col space-y-1 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 text-white">
        <div className="font-serif flex space-x-2">
          {showBackButton ? <BackButton /> : <Cloud />}
          <h2 className="text-2xl">{title}</h2>
        </div>
        <ul className="flex flex-col sm:flex-row sm:items-center space-y-1 space-x-1">
          <li className="p-1">
            <button className="border-none hover:font-medium hover:shadow-md hover:bg-green-700 p-1 rounded-md">
              <h5 className="font-serif">Instances</h5>
            </button>
          </li>
          <li className="p-1">
            <button className="flex space-x-1 border-none hover:font-medium hover:shadow-md hover:bg-green-700 p-1 rounded-md">
              <h5 className="font-serif">Organization</h5>
              <User />
            </button>
            
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
