import Link from "next/link";
import { Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { Cloud, LogOut, User } from "react-feather";
import { userService } from "../services/user.service";

type Props = {
  title: string;
};

export default function NavHeader({ title }) {
  const handleLogout = ()=> {
    userService.logout();
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Row>
          <Link href={"/"}>
            <div className="flex space-x-2 items-center">
              <Cloud /> <h4>{title}</h4>
            </div>
          </Link>
        </Row>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="space-x-4 font-semibold">
          <Nav className="ml-auto">
            <Link href="/instance">
              <a className="nav text-xl nav-link">Instances</a>
            </Link>
            <Link href="/security-group">
              <a className="nav text-xl nav-link">Security-groups</a>
            </Link>

            <NavDropdown
              title="User"
              className="text-xl"
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item>
                <div className="flex space-x-2">
                  <User /> <p>Logged In</p>
                </div>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <div className="flex text-red-500 space-x-2">
                  <LogOut />
                  <p>LogOut</p>
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
