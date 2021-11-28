import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import Layout from "../../components/Layout";

type Props = {
  id: number;
};

const server = {
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
};

const ServerDetail: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { server_id } = router.query;
  return (
    <Layout  showBackButton={true}>
      <section>
        <div className="flex flex-row justify-between mx-6 mt-4">
          <h4 className="text-md">
            {server.name} {server_id}
          </h4>
          <div className="flex">
            <Link href="/edit_server_page">
              <a className="btn btn-md btn-success">Edit Server</a>
            </Link>
            <Link href="/help">
              <a className="btn btn-info">Help</a>
            </Link>
          </div>
        </div>
        <div className="mx-6 mt-4 p-4 rounded-lg card shadow-lg">
          <div className="row mx-3 space-y-3">
            <div className="col-lg-5 col-sm-10">
              <div className="row">
                <span className="font-semibold w-96 col-4">Instance ID: </span>
                <span className="font-normal col">{server.uuid}</span>
              </div>
              <div className="row">
                <span className="font-semibold w-96 col-4">
                  Security Group:{" "}
                </span>
                <span className="font-normal col">
                  {server.securityGroup.name}
                </span>
              </div>
              <div className="row">
                <span className="font-semibold w-96 col-4">Description: </span>
                <span className="font-normal col">{server.desc}</span>
              </div>
            </div>
            <div className="col-lg-5 col-sm-10">
              <div className="row">
                <span className="font-semibold w-96 col-4">Created On: </span>
                <span className="font-normal col">{server.creationDate}</span>
              </div>
              <div className="row">
                <span className="font-semibold w-96 col-4">IP Address: </span>
                <span className="font-normal col">{server.ip}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServerDetail;
