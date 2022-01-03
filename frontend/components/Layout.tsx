import * as React from "react";
import { userService } from "../services/user.service";
import LoginOverlayContent from "./LoginOverlayComponent";
import Nav from "./nav-bar";
import Overlay from "./Overlay";

type Props = {
  showBackButton: boolean;
};

const Layout: React.FC<Props> = ({ showBackButton, children }) => {
  const [showOverlay, setShowOverlay] = React.useState(false);


  const logOut = () => {
    userService.logout();
  };
  const getOverlay = () => {
    if (showOverlay) {
      return;
      <Overlay setShowOverlay={setShowOverlay}>
        <LoginOverlayContent setShowOverlay={setShowOverlay} />
      </Overlay>;
    } else {
      return <div></div>;
    }
  };

  return (
    <div>
      {showOverlay}
      <Nav title="CloudFirewall" />
      <section className="">{children}</section>
    </div>
  );
};

export default Layout;
