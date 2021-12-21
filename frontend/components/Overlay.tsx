import * as React from "react";

type Props = {
    setShowOverlay: any
};

const Overlay: React.FC<Props> = ({ setShowOverlay, children }) => {
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="my-modal"
      onClick={setShowOverlay(false)}
    >
      {children}
    </div>
  );
};

export default Overlay;
