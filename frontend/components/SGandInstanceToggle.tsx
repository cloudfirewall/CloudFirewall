import * as React from "react";
import { Tabs } from "../types";

type Props = {
  selectedTab: Tabs;
  setSelectedTab: React.Dispatch<React.SetStateAction<Tabs>>;
};

const SecurityGroupAndInstanceToggle: React.FC<Props> = ({
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <div id="button-group" className="flex flex-row justify-center pb-3">
      <div className="flex flex-row font-medium">
        <button
          className={`${
            selectedTab === Tabs.INSTANCES
              ? "bg-gray-500 text-white"
              : "bg-transparent border-2"
          } rounded-l-xl px-2 py-2 w-40`}
          onClick={() => {
            if (selectedTab === Tabs.SECURITY_GROUPS)
              setSelectedTab(Tabs.INSTANCES);
          }}
        >
          Instances
        </button>
        <button
          className={`${
            selectedTab === Tabs.SECURITY_GROUPS
              ? "bg-gray-500 text-white"
              : "bg-transparent border-2"
          } rounded-r-xl px-2 py-2 w-40`}
          onClick={() => {
            if (selectedTab === Tabs.INSTANCES)
              setSelectedTab(Tabs.SECURITY_GROUPS);
          }}
        >
          Security Groups
        </button>
      </div>
    </div>
  );
};

export default SecurityGroupAndInstanceToggle;
