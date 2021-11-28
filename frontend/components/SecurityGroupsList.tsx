import * as React from "react";
import SearchBarItem from "./SearchBar";
import { useRouter } from "next/router";
import Link from "next/link";

type Props = {};

const securityGroups = [
  {
    uuid: 0,
    name: "string",
    desc: "string",
    creationDate: "2021-11-15T05:58:08.398Z",
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
    instances: [
      {
        uuid: 0,
        name: "string",
        ip: "string",
        desc: "string",
        creationDate: "2021-11-15T05:58:08.398Z",
        onlineInfo: [
          {
            startTime: 0,
            "period(ms)": 0,
          },
        ],
        securityGroup: "string",
      },
    ],
  },
  {
    uuid: 0,
    name: "string",
    desc: "string",
    creationDate: "2021-11-15T05:58:08.398Z",
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
    instances: [
      {
        uuid: 0,
        name: "string",
        ip: "string",
        desc: "string",
        creationDate: "2021-11-15T05:58:08.398Z",
        onlineInfo: [
          {
            startTime: 0,
            "period(ms)": 0,
          },
        ],
        securityGroup: "string",
      },
    ],
  },
];

const SecurityGroupsList: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [securityGroupList, setSecurityGroupList] =
    React.useState(securityGroups);
  const [searchText, setSearchText] = React.useState("");
  const handleAddSecurityGroup = () => {
    router.push("/add_security_group_page");
  };
  const handleHelp = () => {
    router.push("/help");
  };
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center justify-items-stretch space-x-2 space-y-2 m-5">
        <div className="">
          <div className="px-3 py-2 w-max card shadow-md">Total Groups: 5</div>
        </div>
        <div className=" col-6">
          <SearchBarItem setSearchText={setSearchText} />
        </div>
        <div className="btn-group">
          <button
            className="btn btn-md btn-success"
            onClick={handleAddSecurityGroup}
          >
            Add Security Group
          </button>
          <button className="btn btn-info" onClick={handleHelp}>
            Help
          </button>
        </div>
      </div>

      <div className="p-2 md:p-5 shadow-md">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>SN</th>
              <th>ID</th>
              <th>Name</th>
              <th>Created On</th>
              <th>No.of instances</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {securityGroupList.map((securityGroup, index) => (
              <tr key={index.toString()}>
                <td>{index + 1}</td>
                <td>{securityGroup.uuid}</td>
                <td>{securityGroup.name}</td>
                <td>{securityGroup.creationDate}</td>
                <td>{securityGroup.uuid}</td>
                <td>
                  <Link href={`/security_group/${securityGroup.uuid}`}>
                    <a className="btn btn-link">View</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SecurityGroupsList;
