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
    "/instnace/securityGroup/instances/" + sg_id,
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
              <th>Name</th>
              <th>IP Address</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.length === 0 && (
              <tr>
                <td colSpan={6}>
                  {" "}
                  <span className="flex justify-center">
                    No Instances
                  </span>{" "}
                </td>
              </tr>
            )}
            {data?.data?.map((instance, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td><Link href={`/instance/${instance?.id}`}>{instance?.id}</Link></td>
                <td>{instance?.name}</td>

                <td>{instance?.ip}</td>
                <td>{instance?.description}</td>
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
            <h3 className="font-medium">
              {" "}
              Security Group Name : {data?.data[0]?.name}
            </h3>
            <div className="btn-group">
              <Link href={"/security_group/edit/" + sg_id}>
                <a className="btn btn-secondary w-32">Edit Settings</a>
              </Link>
              <Link href="/help">
                <a className="btn btn-info">Help</a>
              </Link>
            </div>
          </div>
          <div className="flex space-x-2">
            <h5 className="font-medium">Description: </h5>
            <div className="font-medium">{data?.data[0]?.description}</div>
          </div>
          <div className="flex flex-row space-x-2">
            
            <h5 className="font-medium">Default Inbound Policy: </h5>
            <div className="font-medium">{data?.data[0]?.defaultInboundPolicy}</div>
          </div>
          <div className="flex flex-row space-x-2">
            
            <h5 className="font-medium">Default Outbound Policy: </h5>
            <div className="font-medium">{data?.data[0]?.defaultOutboundPolicy}</div>
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
        <SecurityGroupInstances sg_id={sg_id} />
      </div>
    </Layout>
  );
};

export default SecurityGroupDetail;
