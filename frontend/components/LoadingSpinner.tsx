import { Spinner } from "react-bootstrap";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
