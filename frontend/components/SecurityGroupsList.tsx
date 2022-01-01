import useSWR from "swr";
import SearchBarItem from "./SearchBar";
import { useRouter } from "next/router";
import Link from "next/link";
import { Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import { securityGroups } from "../utils/data";
import { securityGroupService } from "../services/security_groups.service";
import ErrorPage from "./Error";
import LoadingSpinner from "./LoadingSpinner";
import BottomPagination from "./BottomPagination";

const SecurityGroupsList: React.FC = () => {
  const router = useRouter();
  const fetcher = () => securityGroupService.readSecurityGroups();
  const { data, error } = useSWR("/securityGroups", fetcher);
  const [securityGroups, setSecurityGroups] = useState([]);
  const [securityGroupListShown, setSecurityGroupListShown] =
    useState(securityGroups);
  useEffect(() => {
    if (data) {
      setSecurityGroups(data.data);
      setSecurityGroupListShown(data.data);
    }
  }, [data]);
  const [searchText, setSearchText] = useState("");
  const handleAddSecurityGroup = () => {
    router.push("/security_group/add");
  };
  const handleHelp = () => {
    router.push("/help");
  };
  const [currentPage, setCurrentPage] = useState(1);
  const setLastPage = () => {
    setCurrentPage(securityGroupListShown.length + 1);
  };
  const handleSearchTextFilter = (value: string) => {
    const filteredGroups = securityGroups.filter(
      (item) => item.name.includes(value) || value.includes(item.name)
    );
    setSecurityGroupListShown(filteredGroups);
  };

  if (error) return <ErrorPage message={error.message} />;

  if (!data) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center justify-items-stretch space-x-2 space-y-2 m-5">
        <div className="">
          <div className="px-3 py-2 w-max card shadow-md">
            Total Groups: {securityGroupListShown.length}
          </div>
        </div>
        <div className=" col-6">
          <SearchBarItem
            setSearchText={setSearchText}
            handleOnChange={handleSearchTextFilter}
          />
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
              <th>Default Inbound Policy </th>
              <th>Default Outbound Policy </th>
              <th>No.of Rules</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {securityGroupListShown.map((securityGroup, index) => (
              <tr key={index.toString()}>
                <td>{index + 1}</td>
                <td>
                  <Link href={`/security_group/${securityGroup.id}`}>
                    <a className="btn btn-link">{securityGroup.id}</a>
                  </Link>
                </td>
                <td>{securityGroup.name}</td>
                <td>{securityGroup.creationDate}</td>
                <td>{securityGroup.defaultInboundPolicy}</td>
                <td>{securityGroup.defaultOutboundPolicy}</td>
                <td>{securityGroup.rules?.length}</td>
                <td>
                  <Link href={`/security_group/${securityGroup.id}`}>
                    <a className="btn btn-link">View</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-row-reverse">
          <BottomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setLastPage={setLastPage}
          />
        </div>
      </div>
    </div>
  );
};

export default SecurityGroupsList;
