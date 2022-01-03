import { useRouter } from "next/router";
import * as React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { Delete } from "react-feather";
import Layout from "../../components/Layout";
import { CreateSecurityGroupRequest } from "../../interfaces/SecurityGroup";
import { securityGroupService } from "../../services/security_groups.service";
import { Policy, Protocol, TrafficDirection, FormData } from "../../types";

type Props = {};

const securityGroup: CreateSecurityGroupRequest = {
  name: "string",
  description: "string",
  defaultInboundPolicy: Policy.DROP,
  defaultOutboundPolicy: Policy.DROP,
  rules: [
    {
      protocol: Protocol.TCP,
      ip: "0.0.0.0/0",
      port: 0,
      policy: Policy.DROP,
      description: "string",
      trafficDirection: TrafficDirection.INBOUND,
    },
    {
      protocol: Protocol.TCP,
      ip: "0.0.0.0/0",
      port: 0,
      policy: Policy.DROP,
      description: "string",
      trafficDirection: TrafficDirection.INBOUND,
    },
  ],
};

const initialPolicy = {
  protocol: Protocol.TCP,
  ip: "0.0.0.0/0",
  port: 0,
  policy: Policy.DROP,
  description: "string",
  trafficDirection: TrafficDirection.INBOUND,
};

const AddSecurityGroupPage: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [sgData, setSgData] =
    React.useState<CreateSecurityGroupRequest>(securityGroup);

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
    // console.log(sgData);
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
    // console.log(rules);
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
      .createSecurityGroup(sgData)
      .then((value) => {
        // console.log(value);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setupdating(false));
  };

  return (
    <div>
      <Layout showBackButton={true}>
        <div className="mx-5">
          <div className="flex flex-row justify-center my-3">
            <h3 className="">Add New Security Group</h3>
          </div>
          <div className="flex flex-col  space-y-2 items-start">
            <div className="flex flex-row space-x-4 items-center form-group container">
              <label className="w-32 font-semibold" htmlFor="name">
                Name:
              </label>
              <input
                type="text"
                value={sgData.name}
                onChange={handleChange}
                id="name"
                className="form-control"
              />
            </div>
            <div className="  flex flex-row space-x-4 items-center form-group container">
              <label className="w-32 font-semibold" htmlFor="description">
                Description:
              </label>
              <textarea
                value={sgData.description}
                onChange={handleChange}
                id="desc"
                className="form-control"
              />
            </div>
            <div className="  flex flex-row space-x-4 items-center form-group container">
              <label className="w-32 font-semibold" htmlFor="description">
                Default Inbound Policy:
              </label>
              <select
                name="policy"
                id="defaultInboundPolicy"
                value={sgData?.defaultInboundPolicy}
                onChange={handleChange}
                className="form-control"
              >
                <option value={Policy.ACCEPT}>ACCEPT</option>
                {/* <option value={Policy.REJECT}>REJECT</option> */}
                <option value={Policy.DROP}>DROP</option>
              </select>
            </div>
            <div className="  flex flex-row space-x-4 items-center form-group container">
              <label className="w-32 font-semibold" htmlFor="description">
                Default Outbound Policy:
              </label>
              <select
                name="policy"
                id="defaultOutboundPolicy"
                value={sgData?.defaultOutboundPolicy}
                onChange={handleChange}
                className="form-control"
              >
                <option value={Policy.ACCEPT}>ACCEPT</option>
                {/* <option value={Policy.REJECT}>REJECT</option> */}
                <option value={Policy.DROP}>DROP</option>
              </select>
            </div>
          </div>
          <div>
            <div className="card p-2 mt-5">
              <div className="flex flex-row justify-center">
                <span className="font-bold text-lg">Inbound Rules</span>
              </div>
              <div className="">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>S.N.</th>
                      <th>Protocol</th>
                      <th>IP Range</th>
                      <th>Port Address</th>
                      <th>Policy</th>
                      <th>Remarks</th>
                      <th>Actions</th>
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
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
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
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="port"
                                className="form-control"
                                id="port"
                                value={rule.port}
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
                              />
                            </td>
                            <td>
                              <select
                                name="policy"
                                id="policy"
                                value={rule.policy}
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
                                className="form-control"
                              >
                                <option value={Policy.ACCEPT}>ACCEPT</option>
                                {/* <option value={Policy.REJECT}>REJECT</option> */}
                                <option value={Policy.DROP}>DROP</option>
                              </select>
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                name=""
                                id="description"
                                value={rule.description}
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
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
                <span className="font-bold text-lg">Outbound Rules</span>
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
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
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
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="port"
                                id="port"
                                value={rule.port}
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
                              />
                            </td>
                            <td>
                              <select
                                name="policy"
                                id="policy"
                                value={rule.policy}
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
                                className="form-control"
                              >
                                <option value={Policy.ACCEPT}>ACCEPT</option>
                                {/* <option value={Policy.REJECT}>REJECT</option> */}
                                <option value={Policy.DROP}>DROP</option>
                              </select>
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                name=""
                                id="description"
                                value={rule.description}
                                onChange={(e) =>
                                  handleRuleChange(
                                    e,
                                    index,
                                    rule.trafficDirection
                                  )
                                }
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
              <br />
              <div className="flex flex-row justify-end">
                <button className="btn btn-success" onClick={handleShowSave}>
                  <p className="font-medium text-md">Save Security Group</p>
                </button>
              </div>
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
    </div>
  );
};

export default AddSecurityGroupPage;
