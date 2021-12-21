import * as React from "react";
import InstancesList from "../../components/ServerList";
import Layout from "../../components/Layout";
import SecurityGroupsList from "../../components/SecurityGroupsList";
import SecurityGroupAndInstanceToggle from "../../components/SGandInstanceToggle";
import { Tabs } from "../../types";

type Props = {};

const HomePage: React.FC<Props> = ({}) => {
  const [selectedTab, setSelectedTab] = React.useState<Tabs>(Tabs.INSTANCES);
  return (
    <Layout showBackButton={false}>
      <section className="py-2">
        <SecurityGroupAndInstanceToggle selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
        {selectedTab === Tabs.INSTANCES ? (
          <InstancesList/>
        ) : (
          <SecurityGroupsList/>
        )}
      </section>
    </Layout>
  );
};

export default HomePage;
