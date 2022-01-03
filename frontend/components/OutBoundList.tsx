import * as React from "react";
import { Table } from "react-bootstrap";

type Props = {
  rules: any[];
};

const OutBoundList: React.FC<Props> = ({ rules }) => {
  return (
    <div className="shadow-md">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>SN</th>
            <th>Protocol</th>
            <th>IP Range</th>
            <th>Port no.</th>
            <th>Policy</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rules?.length === 0 && (
            <tr>
              <td colSpan={6} align="center">
                <span className="ml-5 p-2">Empty Rules</span>
              </td>
            </tr>
          )}
          {rules?.map((rule, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{rule.protocol}</td>
              <td>{rule.ip}</td>
              <td>{rule.port}</td>
              <td>{rule.policy}</td>
              <td>{rule.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OutBoundList;
