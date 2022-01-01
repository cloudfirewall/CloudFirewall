import * as React from "react";

type Props = {
  rules: any[];
};

const InBoundList: React.FC<Props> = ({ rules }) => {
  return (
    <div className=" shadow-md">
      <table className="table table-striped">
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
      </table>
    </div>
  );
};

export default InBoundList;
