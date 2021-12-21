import * as React from "react";
import SearchBarItem from "./SearchBar";
import { useRouter } from "next/router";
import Link from "next/link";
import { Pagination } from "react-bootstrap";
import { securityGroups } from '../utils/data';

type Props = {};


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

      <div className="px-5 shadow-md">
        <table className="table table-striped table-bordered table-hover">
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
        <div className="flex flex-row-reverse">
          <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />

            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item disabled>{14}</Pagination.Item>

            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default SecurityGroupsList;
