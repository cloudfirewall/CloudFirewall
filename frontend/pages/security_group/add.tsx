import {useRouter} from "next/router";
import * as React from "react";
import Layout from "../../components/Layout";
import { Policy, Protocol, TrafficDirection, FormData } from "../../types";

type Props = {};

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

const initialPolicy = {
  protocol: Protocol.TCP,
  ip: "0.0.0.0/0",
  port: 0,
  policy: Policy.DROP,
  desc: "string",
  trafficDirection: TrafficDirection.INBOUND,
};

const AddSecurityGroupPage: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<FormData>(securityGroup);

  const handleOnSave = () => {
    // save data 
    router.push('/');
    

  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleRuleChange = (e: any, index: number) => {
    let rule = formData.rules![index];
    rule = {
      ...rule,
      [e.target.id]: e.target.value,
    };
    formData.rules![index] = rule;
    console.log(formData);
    setFormData({
      ...formData,
    });
  };
  const handleAddRule = (rule: TrafficDirection) => {
    let rules = [
      ...formData.rules!,
      { ...initialPolicy, trafficDirection: rule },
    ];
    console.log(rules);
    setFormData({
      ...formData,
      rules: rules,
    });
  };
  return (
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
              value={formData.name}
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
              value={formData.desc}
              onChange={handleChange}
              id="desc"
              className="form-control"
            />
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
                  </tr>
                </thead>
                <tbody>
                  {formData.rules!.map((rule, index) => {
                    if (rule.trafficDirection === TrafficDirection.INBOUND) {
                      return (
                        <tr key={index} className="align-middle">
                          <td>{index + 1}</td>
                          <td>
                            <select
                              name="protocol"
                              id="protocol"
                              value={rule.protocol}
                              onChange={(e) => handleRuleChange(e, index)}
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
                              onChange={(e) => handleRuleChange(e, index)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="policy"
                              className="form-control"
                              id="port"
                              value={rule.port}
                              onChange={(e) => handleRuleChange(e, index)}
                            />
                          </td>
                          <td>
                            <select
                              name="policy"
                              id="policy"
                              value={rule.policy}
                              onChange={(e) => handleRuleChange(e, index)}
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
                              id="desc"
                              value={rule.desc}
                              onChange={(e) => handleRuleChange(e, index)}
                              cols={30}
                              rows={1}
                            />
                          </td>
                        </tr>
                      );
                    }
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
                    <th>S.N.</th>
                    <th>Protocol</th>
                    <th>IP Range</th>
                    <th>Port Address</th>
                    <th>Policy</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.rules!.map((rule, index) => {
                    if (rule.trafficDirection === TrafficDirection.OUTBOUND) {
                      return (
                        <tr key={index} className="align-middle">
                          <td>{index + 1} </td>
                          <td>
                            <select
                              name="protocol"
                              id="protocol"
                              value={rule.protocol}
                              onChange={(e) => handleRuleChange(e, index)}
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
                              onChange={(e) => handleRuleChange(e, index)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="policy"
                              id="port"
                              value={rule.port}
                              onChange={(e) => handleRuleChange(e, index)}
                            />
                          </td>
                          <td>
                            <select
                              name="policy"
                              id="policy"
                              value={rule.policy}
                              onChange={(e) => handleRuleChange(e, index)}
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
                              id="desc"
                              value={rule.desc}
                              onChange={(e) => handleRuleChange(e, index)}
                              cols={30}
                              rows={1}
                            />
                          </td>
                        </tr>
                      );
                    }
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
              <button className="btn btn-success" onClick={handleOnSave}>
                <p className="font-medium text-md">Save Security Group</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddSecurityGroupPage;
