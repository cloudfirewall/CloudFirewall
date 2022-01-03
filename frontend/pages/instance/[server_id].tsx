import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import useSWR from "swr";
import ErrorPage from "../../components/Error";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../components/LoadingSpinner";
import { instanceService } from "../../services/instances.service";

type Props = {
  id: number;
};

const ServerDetail: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const { server_id } = router.query;
  const fetcher = () => instanceService.readInstanceById(server_id as string);
  const { data, error } = useSWR("/instance/" + server_id, fetcher);

  if (error) return <ErrorPage message={error.message} />;
  if (!data) return <LoadingSpinner />;
  return (
    <Layout showBackButton={true}>
      <section>
        <div className="flex flex-row justify-between mx-6 mt-4">
          <h4 className="text-md mx-2">
            Instance Name: <em>{data?.data?.name}</em>
          </h4>
          <div className="flex">
            <Link href={`/instance/edit/${server_id}`}>
              <a className="btn btn-md btn-success">Edit Server</a>
            </Link>
            <Link href="/help">
              <a className="btn btn-info">Help</a>
            </Link>
          </div>
        </div>
        <div className="mx-6 mt-4 p-4 rounded-lg card shadow-lg">
          <div className="row mx-3 space-y-3">
            <div className="col-lg-5 col-sm-10">
              <div className="row">
                <span className="font-semibold w-96 col-4">Instance ID: </span>
                <span className="font-normal col">{data?.data?.id}</span>
              </div>
              <div className="row">
                <span className="font-semibold w-96 col-4">
                  Security Group:{" "}
                </span>
                <span className="font-normal col">
                  <Link
                    href={"/security_group/" + data?.data?.securityGroup.id}
                  >
                    {data?.data?.securityGroup.name}
                  </Link>
                </span>
              </div>
              <div className="row">
                <span className="font-semibold w-96 col-4">Description: </span>
                <span className="font-normal col">
                  {data?.data?.description}
                </span>
              </div>
            </div>
            <div className="col-lg-5 col-sm-10">
              <div className="row">
                <span className="font-semibold w-96 col-4">Created On: </span>
                <span className="font-normal col">
                  {data?.data?.creationDate}
                </span>
              </div>
              <div className="row">
                <span className="font-semibold w-96 col-4">IP Address: </span>
                <span className="font-normal col">{data?.data?.ip}</span>
              </div>
              <div className="row">
                <span className="font-semibold w-96 col-4"> Status: </span>
                <span className="font-normal col">
                  {data?.data?.status ? "Live" : "Stopped"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServerDetail;
