import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./login.module.css";
interface LoginForm {
  username: string;
  password: string;
}
export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(formData);
    router.push('/');
  };

  const handleChange = (event: any) => {
    setFormData({
      ...formData!,
      [event.currentTarget.id]: event.currentTarget.value,
    });
  };

  const handleLogin = () => {
    console.log("clicked login");
  };

  return (
    <div className="row h-screen">
      <div className="col-sm-8 col-md-5 mx-auto my-auto p-10">
        <div className="row p-10 card shadow-lg">
          <div className="card-title">
            <h2 className="ml-3 font-bold"> User Login </h2>
          </div>

          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="card-body">
              <div className="form-group font-semibold ">
                <label htmlFor="username"> Username </label>
                <input
                  className="form-control"
                  type="text"
                  id="username"
                  onChange={handleChange}
                />
              </div>
              <br />

              <div className="form-group font-semibold">
                <label htmlFor="password"> Password </label>
                <input
                  className="form-control"
                  id="password"
                  type="password"
                  onChange={handleChange}
                />
              </div>
              <br />
              <div className="form-group">
                <button type="submit" className="w-full btn btn-success hover:shadow-lg">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
