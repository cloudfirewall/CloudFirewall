export default function ErrorPage({ message }) {
  return (
    <>
      <div className="col mx-auto w-50">
        <h1 className="my-8 text-center">Error Occured</h1>
        <pre className="bg-black text-white p-5 rounded shadow">{message}</pre>
      </div>
    </>
  );
}
