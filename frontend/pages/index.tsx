import { Col, Nav, Row, Tab } from "react-bootstrap";
import Layout from "../components/Layout_";
import SecurityGroupsList from "../components/SecurityGroupsList";
import InstancesList from "../components/ServerList";

export default function HomePage({ selectedTab = "instances" }) {
  return (
    <Layout>
      <div className="my-10"></div>
      <Tab.Container defaultActiveKey="instances">
        <Nav variant="pills" className="flex-row justify-center">
          <Nav.Item className="border-2 rounded">
            <Nav.Link eventKey="instances" className="w-40 text-center">
              Instances
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="border-2 rounded">
            <Nav.Link eventKey="security" className="w-40 text-center">
              Security Groups{" "}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="instances">
            <InstancesList />
          </Tab.Pane>
          <Tab.Pane eventKey="security">
            <SecurityGroupsList />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Layout>
  );
}
