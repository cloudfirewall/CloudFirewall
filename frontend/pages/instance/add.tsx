import * as React from "react";
import Layout from "../../components/Layout";
import { useRouter } from 'next/router';

type Props = {};

const ServerAddPage: React.FC<Props> = ({}) => {
  const router = useRouter()
  const handleCopy = () => {}
  const handleViewInstances = () => router.push('/')
  return (
    <Layout showBackButton={true}>
      <section id="adding_new_server">
        <div className="flex flex-col items-start mx-5 mt-5 pb-5">
          <h5 className="m-2 font-semibold">Add a New Instance server to Firewall Master</h5>
          <div className="flex card shadow-md my-2 p-3 rounded-sm w-full">
            <p className="text-md">
              Open the terminal and run the following command to configure the
              instance
            </p>
            <div className="flex flex-row align-bottom space-x-2 items-end">
              <div className="bg-gray-300 mt-2 p-3 rounded-sm">
                <code className="text-md text-black">
                  <span>
                    wget https://cloudfirewall.io/downloads/cf-agent.sh
                  </span>
                  <hr className="m-0" />
                  <span>cf-agent.sh #token#</span>
                </code>
              </div>
              <button className="btn btn-outline-primary"  onClick={handleCopy}>
                Copy
              </button>
            </div>
          </div>
          <button className="mt-2 self-end btn btn-success" onClick={handleViewInstances}>
            View All Instances
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default ServerAddPage;
