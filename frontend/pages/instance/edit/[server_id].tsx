import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import useSWR from "swr";
import ErrorPage from "../../../components/Error";
import Layout from "../../../components/Layout";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { instanceService } from "../../../services/instances.service";
import { securityGroupService } from "../../../services/security_groups.service";

type Props = {};

const EditServerPage: React.FC<Props> = ({}) => {
  const router = useRouter();
  const { server_id } = router.query;

  const fetcher = () => instanceService.readInstanceById(server_id as string);
  const { data, error } = useSWR("/instance/" + server_id, fetcher);
  const [server, setServer] = React.useState(null);
  const [serverData, setServerData] = React.useState<{
    name: string;
    description: string;
    securityGroupId: string;
  }>({
    name: "",
    description: "",
    securityGroupId: "",
  });
  React.useEffect(() => {
    if (data) {
      setServer(data?.data);
      setServerData({
        name: server?.name,
        description: server?.description,
        securityGroupId: server?.securityGroup?.id,
      });
    }
  }, [data]);

  const handleChange = (e: any) => {
    setServerData({
      ...serverData,
      [e.currentTarget.id]: e.currentTarget.value,
    });
  };

  const [showConfirmSave, setShowConfirmSave] = React.useState(false);
  const [updating, setupdating] = React.useState(false);

  const handleCloseSave = () => setShowConfirmSave(false);
  const handleShowSave = () => setShowConfirmSave(true);

  const handleSave = () => {
    setupdating(true);
    instanceService
      .editInstanceById(server_id as string, serverData)
      .then((value) => {
        // console.log(value);
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

  const handleDeleteServer = () => {
    setdeleting(true);
    instanceService
      .deleteInstanceById(server_id as string)
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
        <section className="container">
          <div className="flex justify-between m-4">
            <h4 className="text-md">Title: {serverData?.name}</h4>
            <div className="flex">
              <button className="btn btn-danger" onClick={handleDeleteServer}>
                Delete server
              </button>
            </div>
          </div>
          <div className="mx-4 card shadow-lg">
            <div className="row p-4 space-y-2">
              <div className="col-md-5 space-y-2">
                <div className="row">
                  <span className="font-semibold w-96 col-4">Server ID: </span>

                  <span className="font-normal col">{server?.id}</span>
                </div>

                <div className="row">
                  <span className="font-semibold w-96 col-4">Created On: </span>
                  <span className="font-normal col">
                    {server?.creationDate}
                  </span>
                </div>
                <div className="row">
                  <span className="font-semibold w-96 col-4">IP Address: </span>
                  <span className="font-normal col">{server?.ip}</span>
                </div>
                <form>
                  <div className="form-group row">
                    <label className="font-semibold col-4">Server Name:</label>
                    <span className="col">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={serverData?.name}
                        onChange={handleChange}
                      />
                    </span>
                  </div>
                  <div className="form-group row">
                    <label className="font-semibold col-4">
                      Security Group:
                    </label>
                    <span className="font-normal col">
                      <SecurityGroupSelect />
                    </span>
                  </div>
                  <div className="row">
                    <span className="font-semibold col-4">Description:</span>
                    <span className="font-normal col">
                      <textarea
                        name="description"
                        id="description"
                        className="form-control"
                        rows={2}
                        value={serverData?.description}
                        onChange={handleChange}
                      ></textarea>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse m-4">
            <button className="btn-success btn" onClick={handleShowSave}>
              Save Settings
            </button>
          </div>
        </section>
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
          <h5>Do you want to save the changes to instance?</h5>
          <span className="text-lg">
            <span className="font-medium mr-2">Instance Name:</span>{" "}
            {serverData.name}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">Instance Description:</span>{" "}
            {serverData.description}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">Security Group Id:</span>{" "}
            {serverData.securityGroupId}
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
          <Modal.Title>Instance Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>
            Do you want to delete this instance? It can't be recovered once
            deleted
          </h5>
          <span className="text-lg">
            <span className="font-medium mr-2">Instance Name:</span>{" "}
            {serverData.name}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">Instance Id:</span> {server?.id}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">Instance Description:</span>{" "}
            {serverData.description}
          </span>{" "}
          <br />
          <span className="text-lg">
            <span className="font-medium mr-2">Security Group Id:</span>{" "}
            {serverData.securityGroupId}
          </span>{" "}
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteServer}>
            Delete {deleting && <Spinner animation="border" />}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  function SecurityGroupSelect() {
    const fetcher = () => securityGroupService.readSecurityGroups();
    const { data, error } = useSWR("/securityGroups", fetcher);

    if (error) return <ErrorPage message={error.message} />;
    if (!data) return <LoadingSpinner />;
    return (
      <select
        name="securityGroupId"
        id="securityGroupId"
        className="form-control"
        onChange={handleChange}
        defaultValue={serverData.securityGroupId}
      >
        {data?.data?.map((sg) =>
          sg?.id === serverData?.securityGroupId ? (
            <option key={sg?.id} value={sg?.id} selected>
              {sg?.name} ({sg?.id})
            </option>
          ) : (
            <option key={sg?.id} value={sg?.id}>
              {sg?.name} ({sg?.id})
            </option>
          )
        )}
      </select>
    );
  }
};

export default EditServerPage;
