import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import InBoundList from "../../../components/InBoundList";
import Layout from "../../../components/Layout";
import OutBoundList from "../../../components/OutBoundList";
import { Policy, Protocol, TrafficDirection, FormData } from "../../../types";

type Props = {};

enum Tabs {
  INBOUND,
  OUTBOUND,
}
const securityGroup = {
  name: "string",
  desc: "string",
  rules: [
    {
      protocol: Protocol.TCP,
      ip: "0.0.0.0/0",
      port: 0,
      policy: Policy.DROP,
      desc: "string",
      trafficDirection: TrafficDirection.INBOUND,
    },
    {
      protocol: Protocol.TCP,
      ip: "0.0.0.0/0",
      port: 0,
      policy: Policy.DROP,
      desc: "string",
      trafficDirection: TrafficDirection.INBOUND,
    },
  ],
};

const instances = [
  {
    uuid: 0,
    name: "string",
    ip: "string",
    desc: "string",
    creationDate: "2021-11-15T05:04:55.592Z",
    onlineInfo: [
      {
        startTime: 0,
        "period(ms)": 0,
      },
    ],
    securityGroup: {
      uuid: 0,
      name: "string",
      desc: "string",
      creationDate: "2021-11-15T05:04:55.592Z",
      defaultInboundPolicy: "drop",
      defaultOutboundPolicy: "drop",
      rules: [
        {
          uuid: 0,
          protocol: "string",
          ip: "0.0.0.0/0",
          port: 0,
          policy: "drop",
          desc: "string",
          trafficDirection: "inbound",
        },
      ],
      instances: ["string"],
    },
  },
  {
    uuid: 0,
    name: "string",
    ip: "string",
    desc: "string",
    creationDate: "2021-11-15T05:04:55.592Z",
    onlineInfo: [
      {
        startTime: 0,
        "period(ms)": 0,
      },
    ],
    securityGroup: {
      uuid: 0,
      name: "string",
      desc: "string",
      creationDate: "2021-11-15T05:04:55.592Z",
      defaultInboundPolicy: "drop",
      defaultOutboundPolicy: "drop",
      rules: [
        {
          uuid: 0,
          protocol: "string",
          ip: "0.0.0.0/0",
          port: 0,
          policy: "drop",
          desc: "string",
          trafficDirection: "inbound",
        },
      ],
      instances: ["string"],
    },
  },
];

const SecurityGroupDetail: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { sg_id } = router.query;
  const [selectedTab, setSelectedTab] = React.useState<Tabs>(Tabs.INBOUND);
  const [instanceList, setInstanceList] = React.useState(instances);

  return (
    <Layout showBackButton={true}>
      <div className="container">
        <section id="description">
          <div className="flex flex-row justify-between py-2">
            <h3 className="font-medium">{securityGroup.name}</h3>
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
            <p className="font-medium">Description: </p>
            <div className="">{securityGroup.desc}</div>
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
            <InBoundList rules={securityGroup.rules} />
          ) : (
            <OutBoundList rules={securityGroup.rules} />
          )}
        </section>
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
                {instanceList.map((instance, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{instance.uuid}</td>
                    <td>{instance.ip}</td>
                    <td>{instance.securityGroup.uuid}</td>
                    <td>{instance.creationDate}</td>
                    <td>{instance.onlineInfo !== null ? "true" : "false"} </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SecurityGroupDetail;
