import * as React from "react";
import SearchBarItem from "./SearchBar";
import Link from "next/link";
import EmptyInstancePage from "./EmptyInstancePage";
import { useRouter } from "next/router";
import { Pagination, Row, Col, Container, Button } from "react-bootstrap";
import { instances } from "../utils/data";
import { GetStaticProps } from "next";
import { instanceService } from "../services/instances.service";
import { Instance } from "../interfaces/Instance";


export default function InstancesList() {
  const [instanceNo, setInstanceNo] = React.useState({
    online: instances.length,
    total: instances.length,
  });
  const [searchText, setSearchText] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [instanceList, setInstanceList] = React.useState(instances);
  const router = useRouter();
  const handleAddInstance = () => router.push("/add_server_page");

  const handleHelp = () => router.push("/help");
  const getShowableInstances = (page: number) => {


  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center justify-items-stretch space-x-2 space-y-2 m-5">
        <div className="">
          <div className="px-3 py-2 w-max card shadow-md">
            Online Instances {instanceNo.online}/{instanceNo.total}
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
      {instanceList?.length === 0 ? (
        <EmptyInstancePage />
      ) : (
        <div className="px-5 shadow-md">
          <table className="table table-bordered table-hover table-striped">
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
              {instanceList?.map((instance, index) => (
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
          <div className="flex flex-row-reverse">
            <Pagination>
              <Pagination.First
                onClick={() => {
                  setCurrentPage(1);
                }}
              />
              <Pagination.Prev disabled={currentPage < 2}
              onClick={() => {
                setCurrentPage(currentPage-1);
              }} />
              <Pagination.Ellipsis />
              {[-2, -1, 0, 1, 2].map((value, index) => {
                if (currentPage + value > 0) {
                  return (
                    <Pagination.Item
                      key={index}
                      active={value === 0}
                      onClick={() => {
                        setCurrentPage(currentPage + value);
                      }}
                    >
                      {currentPage + value}
                    </Pagination.Item>
                  );
                }
              })}
              <Pagination.Ellipsis />
              <Pagination.Next onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}/>
              <Pagination.Last onClick={() => {
                  setCurrentPage(currentPage+1);
                }}/>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};
