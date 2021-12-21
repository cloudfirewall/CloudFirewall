import * as React from "react";
import { userService } from "../services/user.service";
import LoginOverlayContent from "./LoginOverlayComponent";
import Nav from "./Nav";
import Overlay from "./Overlay";

type Props = {
  showBackButton: boolean;
};

const Layout: React.FC<Props> = ({ showBackButton, children }) => {
  const [showOverlay, setShowOverlay] = React.useState(false);
  const handleLogOut = () => {
    console.log("here");
    setShowOverlay(true);
  };

  const logOut = () => {
    userService.logout();
  };
  const getOverlay = ()=> {
    if(showOverlay) {
      return 
      <Overlay setShowOverlay={setShowOverlay}>
        <LoginOverlayContent setShowOverlay={setShowOverlay}/>

      </Overlay>
    }
    else {
      return <div></div>
    }
  }

  return (
    <div>
      {showOverlay}
      <Nav
        title="CloudFirewall"
        onLogOut={handleLogOut}
        showBackButton={showBackButton}
      />
      <section className="">{children}</section>
      {/* (
        <div>
          <h1>Hello Overlay</h1>
          <Overlay setShowOverlay={setShowOverlay}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Do you want to log out of this device?
                </h3>
                <div className=" flex flex-row space-x-2 items-center">
                  <button
                    onClick={logOut}
                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Log Out
                  </button>
                  <button
                    onClick={() => {
                      setShowOverlay(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Overlay>
        </div>
      ) */}
    </div>
  );
};

export default Layout;
