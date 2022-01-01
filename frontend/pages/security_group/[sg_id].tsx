import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import useSWR from "swr";
import ErrorPage from "../../components/Error";
import InBoundList from "../../components/InBoundList";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import OutBoundList from "../../components/OutBoundList";
import { securityGroupService } from "../../services/security_groups.service";

type Props = {};

enum Tabs {
  INBOUND,
  OUTBOUND,
}

function SecurityGroupInstances({ sg_id }) {
  const instancesFetcher = () =>
    securityGroupService.readSecurityGroupInstances(sg_id as string);
  const { data, error } = useSWR(
    "/securityGroup/instances/" + sg_id,
    instancesFetcher
  );

  if (error) return <ErrorPage message={error.message} />;
  if (!data) return <LoadingSpinner />;
  return (
    <section id="instances">
      <div className="flex flex-row mt-4 justify-center">
        <p className="font-normal btn btn-secondary shadow-md">Instances</p>
      </div>
      <div className="shadow-md">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>SN</th>
              <th>Instance ID</th>
              <th>IP Address</th>
              <th>Security Group</th>
              <th>Connected on</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((instance, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{instance.uuid}</td>
                <td>{instance.ip}</td>
                <td>{instance.data?.data?.uuid}</td>
                <td>{instance.creationDate}</td>
                <td>{instance.onlineInfo !== null ? "true" : "false"} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const SecurityGroupDetail: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { sg_id } = router.query;
  const fetcher = () =>
    securityGroupService.readSecurityGroupById(sg_id as string);
  const { data, error } = useSWR("/securityGroup/" + sg_id, fetcher);


  const [selectedTab, setSelectedTab] = React.useState<Tabs>(Tabs.INBOUND);

  if (error) return <ErrorPage message={error.message} />;
  if (!data) return <LoadingSpinner />;

  return (
    <Layout showBackButton={true}>
      <div className="container mt-3">
        <section id="description">
          <div className="flex flex-row justify-between py-2">
            <h3 className="font-medium"> Security Group Name : {data?.data[0]?.name}</h3>
            <div className="btn-group">
              <Link href="/edit_security_group">
                <a className="btn btn-secondary w-32">Edit Settings</a>
              </Link>
              <Link href="/help">
                <a className="btn btn-info">Help</a>
              </Link>
            </div>
          </div>
          <div className="flex space-x-2">
            <h5 className="font-medium">Description: </h5>
            <div className="">{data?.data[0]?.desc}</div>
          </div>
        </section>
        <section id="rules">
          <div id="button-group" className="flex flex-row justify-center my-4">
            <div className="flex flex-row font-medium">
              <button
                className={`${
                  selectedTab === Tabs.INBOUND
                    ? "bg-gray-500 text-white"
                    : "bg-transparent border-2"
                } rounded-l-xl w-36`}
                onClick={() => {
                  if (selectedTab === Tabs.OUTBOUND)
                    setSelectedTab(Tabs.INBOUND);
                }}
              >
                INBOUND
              </button>
              <button
                className={`${
                  selectedTab === Tabs.OUTBOUND
                    ? "bg-gray-500 text-white"
                    : "bg-transparent border-2"
                } rounded-r-xl px-2 py-2 w-40`}
                onClick={() => {
                  if (selectedTab === Tabs.INBOUND)
                    setSelectedTab(Tabs.OUTBOUND);
                }}
              >
                OUTBOUND
              </button>
            </div>
          </div>

          {selectedTab === Tabs.INBOUND ? (
            <InBoundList
              rules={data?.data[0]?.rules?.filter(
                (item) => item?.trafficDirection === "inbound"
              )}
            />
          ) : (
            <OutBoundList
              rules={data?.data[0]?.rules?.filter(
                (item) => item?.trafficDirection === "outbound"
              )}
            />
          )}
        </section>
        <SecurityGroupInstances sg_id={sg_id}/>
      </div>
    </Layout>
  );
};

export default SecurityGroupDetail;
