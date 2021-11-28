import * as React from "react";
import SearchBarItem from "./SearchBar";
import Link from "next/link";
import EmptyInstancePage from "./EmptyInstancePage";
import { useRouter } from "next/router";

type Props = {};
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
    uuid: 1,
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
      uuid: 1,
      name: "string",
      desc: "string",
      creationDate: "2021-11-15T05:04:55.592Z",
      defaultInboundPolicy: "drop",
      defaultOutboundPolicy: "drop",
      rules: [
        {
          uuid: 1,
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

const InstancesList: React.FC<Props> = ({}) => {
  const [serverNo, setServerNo] = React.useState({
    online: 1,
    total: 2,
  });
  const [searchText, setSearchText] = React.useState("");
  const [instanceList, setInstanceList] = React.useState(instances);
  const router = useRouter();
  const handleAddInstance = () => router.push("/add_server_page");

  const handleHelp = () => router.push("/help");

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center justify-items-stretch space-x-2 space-y-2 m-5">
        <div className="">
          <div className="px-3 py-2 w-max card shadow-md">
            Online Servers {serverNo.online}/{serverNo.total}
          </div>
        </div>
        <div className=" col-6">
          <SearchBarItem setSearchText={setSearchText} />
        </div>
        <div className="btn-group">
          <button
            className="btn btn-md btn-success w-40"
            onClick={handleAddInstance}
          >
            Add New Instance
          </button>
          <button className="btn btn-info" onClick={handleHelp}>
            Help
          </button>
        </div>
      </div>
      {instanceList.length === 0 ? (
        <EmptyInstancePage />
      ) : (
        <div className="p-2 md:p-4 shadow-md">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>SN</th>
                <th>Instance ID</th>
                <th>Instance Name</th>
                <th>IP Address</th>
                <th>Security Group</th>
                <th>Connected on</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {instanceList.map((instance, index) => (
                <tr key={index.toString()}>
                  <td>{index + 1}</td>
                  <td>
                    <Link href={`/server/${instance.uuid}`}>
                      <a className="btn btn-link">{instance.uuid}</a>
                    </Link>
                  </td>
                  <td>{instance.name}</td>
                  <td>{instance.ip}</td>
                  <td>{instance.securityGroup.uuid}</td>
                  <td>{instance.creationDate}</td>
                  <td>{instance.onlineInfo !== null ? "true" : "false"} </td>
                  <td>
                    <Link href={`/server/${instance.uuid}`}>
                      <a className="btn btn-link">View</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstancesList;
