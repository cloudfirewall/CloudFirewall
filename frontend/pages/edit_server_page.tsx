import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import Layout from "../components/Layout";
import Overlay from "../components/Overlay";
import OverlayContent from "../components/OverlayContent";

type Props = {};

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

const EditServerPage: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { server_id } = router.query;
  const [showOverlay, setShowOverlay] = React.useState<boolean>(false);
  const hideOverlay = () => setShowOverlay(false);

  const [serverData, setServerData] = React.useState<{
    name: string;
    desc: string;
    securityGroup: string;
  }>({
    name: "",
    desc: "",
    securityGroup: "",
  });

  const handleChange = (e: any) => {
    setServerData({
      ...serverData,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };
  const handleDeleteServer = () => {
    setShowOverlay(true);
  };
  return (
    <div>
      <Layout showBackButton={true}>
        <section className="container">
          <div className="flex justify-between m-4">
            <h4 className="text-md">
              Title: {server.name} {server_id}
            </h4>
            <div className="flex">
              <button className="btn btn-danger" onClick={handleDeleteServer}>
                Delete server
              </button>
            </div>
          </div>
          <div className="mx-4 card shadow-lg">
            <div className="row p-4 space-y-2">
              <div className="col-md-5 space-y-2">
                <div className="row">
                  <span className="font-semibold w-96 col-4">Server ID: </span>

                  <span className="font-normal col">{server.uuid}</span>
                </div>

                <div className="row">
                  <span className="font-semibold w-96 col-4">Created On: </span>
                  <span className="font-normal col">{server.creationDate}</span>
                </div>
                <div className="row">
                  <span className="font-semibold w-96 col-4">IP Address: </span>
                  <span className="font-normal col">{server.ip}</span>
                </div>
                <div className="form-group row">
                  <label className="font-semibold col-4">Server Name:</label>
                  <span className="col">
                    <input
                      type="text"
                      className="form-control"
                      value={server.name}
                    />
                  </span>
                </div>
                <div className="form-group row">
                  <label className="font-semibold col-4">Security Group:</label>
                  <span className="font-normal col">
                    <select
                      name="security_group"
                      id="security_group"
                      className="form-control"
                      value={server.securityGroup.name}
                    >
                      <option value={server.securityGroup.name}>
                        {server.securityGroup.name}
                      </option>
                      <option value={server.securityGroup.name}>SG-2</option>
                      <option value={server.securityGroup.name}>SG-3</option>
                    </select>
                  </span>
                </div>
                <div className="row">
                  <span className="font-semibold col-4">Description:</span>
                  <span className="font-normal col">
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      rows={2}
                      value={server.desc}
                    ></textarea>
                  </span>
                </div>
              </div>
            </div>
          
          
          </div>

          <div className="flex flex-row-reverse m-4"><button className="btn-success btn">Save Settings</button></div>
        </section>
      </Layout>
      {showOverlay ? (
        <Overlay hideOverlay={hideOverlay}>
          <OverlayContent />
        </Overlay>
      ) : null}
    </div>
  );
};

export default EditServerPage;
