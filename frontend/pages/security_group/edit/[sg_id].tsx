import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { Crosshair, Delete } from "react-feather";
import useSWR from "swr";
import ErrorPage from "../../../components/Error";
import Layout from "../../../components/Layout";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { securityGroupService } from "../../../services/security_groups.service";
import { Policy, Protocol, TrafficDirection, FormData } from "../../../types";

type Props = {};

const securityGroup = {
  name: "",
  description: "",
  rules: [
    {
      protocol: Protocol.TCP,
      ip: "0.0.0.0/0",
      port: 0,
      policy: Policy.DROP,
      description: "",
      trafficDirection: TrafficDirection.INBOUND,
    },
  ],
};

const initialPolicy = {
  protocol: Protocol.TCP,
  ip: "0.0.0.0/0",
  port: 0,
  policy: Policy.DROP,
  desc: "",
  trafficDirection: TrafficDirection.INBOUND,
};

export default function EditSecurityGroupPage() {
  const router = useRouter();
  const { sg_id } = router.query;
  const fetcher = () =>
    securityGroupService.readSecurityGroupById(sg_id as string);
  const { data, error } = useSWR("/random1/security_group/" + sg_id, fetcher);
  const [sgData, setSgData] = React.useState<FormData>(securityGroup);
  React.useEffect(() => {
    console.log(data?.data[0]);
    setSgData(data?.data[0]);
  }, [data]);

  const handleChange = (e: any) => {
    setSgData({ ...sgData, [e.target.id]: e.target.value });
  };

  const handleRuleChange = (
    e: any,
    index: number,
    trafficDirection: TrafficDirection
  ) => {
    let inboundRules = sgData.rules?.filter(
      (rule) => rule.trafficDirection === TrafficDirection.INBOUND
    );
    let outboundRules = sgData.rules?.filter(
      (rule) => rule.trafficDirection === TrafficDirection.OUTBOUND
    );
    if (trafficDirection === TrafficDirection.INBOUND) {
      let rule = inboundRules[index];
      rule = {
        ...rule,
        [e.target.id]: e.target.value,
      };
      inboundRules![index] = rule;
    } else {
      let rule = outboundRules[index];
      rule = {
        ...rule,
        [e.target.id]: e.target.value,
      };
      outboundRules![index] = rule;
    }
    setSgData({
      ...sgData,
      rules: [...inboundRules!, ...outboundRules!],
    });
    console.log(sgData);
  };

  const handleDeleteRule = (index: number, traffic: TrafficDirection) => {
    let inboundRules = sgData?.rules?.filter(
      (rule) => rule.trafficDirection === TrafficDirection.INBOUND
    );
    let outboundRules = sgData?.rules?.filter(
      (rule) => rule.trafficDirection === TrafficDirection.OUTBOUND
    );
    if (traffic === TrafficDirection.INBOUND) inboundRules?.splice(index, 1);
    else outboundRules?.splice(index, 1);
    setSgData({
      ...sgData,
      rules: [...inboundRules!, ...outboundRules!],
    });
  };

  const handleAddRule = (trafficDirection: TrafficDirection) => {
    let rules = [...sgData.rules!, { ...initialPolicy, trafficDirection }];
    console.log(rules);
    setSgData({
      ...sgData,
      rules,
    });
  };

  const [showConfirmSave, setShowConfirmSave] = React.useState(false);
  const [updating, setupdating] = React.useState(false);

  const handleCloseSave = () => setShowConfirmSave(false);
  const handleShowSave = () => setShowConfirmSave(true);

  const handleSave = () => {
    setupdating(true);
    securityGroupService
      .editSecurityGroupById(sg_id as string, sgData)
      .then((value) => {
        console.log(value);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setupdating(false));
  };

  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  const [deleting, setdeleting] = React.useState(false);

  const handleCloseDelete = () => setShowConfirmDelete(false);
  const handleShowDelete = () => setShowConfirmDelete(true);

  const handleDeleteSg = () => {
    setdeleting(true);
    securityGroupService
      .deleteSecurityGroupById(sg_id as string)
      .then((value) => {
        console.log(value);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setdeleting(false));
  };

  if (error) return <ErrorPage message={error.message} />;
  if (!data) return <LoadingSpinner />;
  return (
    <div>
      <Layout showBackButton={true}>
        <div className="mx-5">
          <div className="flex flex-row justify-center my-3">
            <h3 className="">Edit Security Group</h3>
          </div>
          <div className="flex flex-row">
            <p>
              {" "}
              <span className="text-md font-medium mr-2">
                Security Group Id:{" "}
              </span>{" "}
              <span className="text-md">{data?.data[0]?.id}</span>
            </p>
          </div>
          <div className="row">
            <div className="col-8">
              <div className="flex flex-col  space-y-2 items-start">
                <div className="flex flex-row space-x-4 items-center form-group container">
                  <label className="w-32" htmlFor="name">
                    Name:
                  </label>
                  <input
                    type="text"
                    value={sgData?.name}
                    onChange={handleChange}
                    id="name"
                    className="form-control w-40"
                  />
                </div>
                <div className="flex flex-row space-x-4 items-center form-group container">
                  <label className="w-32" htmlFor="description">
                    Description:
                  </label>
                  <textarea
                    value={sgData?.description}
                    onChange={handleChange}
                    id="description"
                    className="form-control w-80"
                  />
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="flex flex-row-reverse">
                <button className="btn btn-danger" onClick={handleShowDelete}>
                  Delete Security Group
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="card p-2 mt-5">
              <div className="flex flex-row justify-center">
                <span className="font-semibold text-lg">Inbound Rules</span>
              </div>
              <div className="">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <td>S.N.</td>
                      <td>Protocol</td>
                      <td>IP Range</td>
                      <td>Port Address</td>
                      <td>Policy</td>
                      <td>Remarks</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {sgData?.rules
                      ?.filter(
                        (rule) =>
                          rule.trafficDirection === TrafficDirection.INBOUND
                      )
                      .map((rule, index) => {
                        return (
                          <tr key={index} className="align-middle">
                            <td>{index + 1}</td>
                            <td>
                              <select
                                name="protocol"
                                id="protocol"
                                value={rule.protocol}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                                className="form-control"
                              >
                                <option value={Protocol.TCP}>TCP</option>
                                <option value={Protocol.UDP}>UDP</option>
                                <option value={Protocol.SSH}>SSH</option>
                                <option value={Protocol.ICMP}>ICMP</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                id="ip"
                                value={rule.ip}
                                className="form-control"
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="port"
                                className="form-control"
                                id="port"
                                value={rule.port}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                              />
                            </td>
                            <td>
                              <select
                                name="policy"
                                id="policy"
                                value={rule.policy}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                                className="form-control"
                              >
                                <option value={Policy.ACCEPT}>ACCEPT</option>
                                <option value={Policy.REJECT}>REJECT</option>
                                <option value={Policy.DROP}>DROP</option>
                              </select>
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                name=""
                                id="description"
                                value={rule.description}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                                cols={30}
                                rows={1}
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  handleDeleteRule(
                                    index,
                                    rule.trafficDirection
                                  );
                                }}
                              >
                                <Delete />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <div className="flex flex-row-reverse">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => handleAddRule(TrafficDirection.INBOUND)}
                  >
                    Add New Rule
                  </button>
                </div>
              </div>
            </div>
            <div className="card p-2 mt-5">
              <div className="flex flex-row justify-center">
                <span className="font-semibold text-lg">Outbound Rules</span>
              </div>
              <div className="">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <td>S.N.</td>
                      <td>Protocol</td>
                      <td>IP Range</td>
                      <td>Port Address</td>
                      <td>Policy</td>
                      <td>Remarks</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {sgData?.rules
                      ?.filter(
                        (rule) =>
                          rule.trafficDirection === TrafficDirection.OUTBOUND
                      )
                      .map((rule, index) => {
                        return (
                          <tr key={index} className="align-middle">
                            <td>{index + 1} </td>
                            <td>
                              <select
                                name="protocol"
                                id="protocol"
                                value={rule.protocol}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                                className="form-control"
                              >
                                <option value={Protocol.TCP}>TCP</option>
                                <option value={Protocol.UDP}>UDP</option>
                                <option value={Protocol.SSH}>SSH</option>
                                <option value={Protocol.ICMP}>ICMP</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                id="ip"
                                value={rule.ip}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="port"
                                id="port"
                                value={rule.port}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                              />
                            </td>
                            <td>
                              <select
                                name="policy"
                                id="policy"
                                value={rule.policy}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                                className="form-control"
                              >
                                <option value={Policy.ACCEPT}>ACCEPT</option>
                                <option value={Policy.REJECT}>REJECT</option>
                                <option value={Policy.DROP}>DROP</option>
                              </select>
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                name=""
                                id="description"
                                value={rule.description}
                                onChange={(e) => handleRuleChange(e, index, rule.trafficDirection)}
                                cols={30}
                                rows={1}
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  handleDeleteRule(
                                    index,
                                    TrafficDirection.OUTBOUND
                                  )
                                }
                              >
                                <Delete />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                <div className="flex flex-row-reverse">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => handleAddRule(TrafficDirection.OUTBOUND)}
                  >
                    Add New Rule
                  </button>
                </div>
              </div>
            </div>
            <div className="my-2 flex flex-row justify-end">
              <button className="btn btn-success" onClick={handleShowSave}>
                <span className="font-medium">Save Security Group</span>
              </button>
            </div>
          </div>
        </div>
      </Layout>
      <Modal
        show={showConfirmSave}
        onHide={handleCloseSave}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Do you want to save the changes to the security group?</h5>
          <span className="text-lg">
            <span className="font-medium mr-2">Security Group Name:</span>{" "}
            {sgData?.name}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">Security Group Id:</span>{" "}
            {data?.data[0]?.id}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">Instance Description:</span>{" "}
            {sgData?.description}
          </span>{" "}
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSave}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save {updating && <Spinner animation="border" />}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showConfirmDelete}
        onHide={handleCloseDelete}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Security Group Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Do you want to delete this security group? It can't be recovered
            once deleted
          </h5>
          <span className="text-lg">
            <span className="font-medium mr-2">Security Group Name:</span>{" "}
            {sgData?.name}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">Security Group Id:</span>{" "}
            {data?.data[0]?.id}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">
              Security Group Description:
            </span>{" "}
            {sgData?.description}
          </span>{" "}
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteSg}>
            Delete {deleting && <Spinner animation="border" />}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
