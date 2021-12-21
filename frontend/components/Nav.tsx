import React from "react";
import { Cloud, LogOut, User } from "react-feather";
import { userService } from "../services/user.service";
import BackButton from "./BackButton";
import LoginOverlayContent from "./LoginOverlayComponent";
import Overlay from "./Overlay";
import OverlayContent from "./OverlayContent";

type Props = {
  title: string;
  showBackButton: boolean;
  onLogOut: ()=> void;
};

const Nav: React.FC<Props> = ({ title, showBackButton = true, onLogOut, children }) => {

  return (
    <div>
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
              <h5 className="font-serif">{userService.userValue.username}</h5>
              <User />
            </button>
          </li>
          <li className="p-1">
            <button className="flex space-x-1 border-none hover:font-medium hover:shadow-md hover:bg-green-700 p-1 rounded-md" 
            onClick={onLogOut}>
              <h5 className="font-serif">Log Out</h5>
              <LogOut/>
            </button>
          </li>
        </ul>
      </div>
    </nav>
    
    </div>
  );
};

export default Nav;
