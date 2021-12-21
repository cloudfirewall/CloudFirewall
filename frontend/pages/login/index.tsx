import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService } from "../../services/user.service";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import * as Yup from "yup";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (userService.userValue) {
      router.push("/");
    }
  }, []);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const { register, handleSubmit, setError, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const handleOnSubmit = ({ username, password }) => {
    console.log('at submit')
    return userService
      .login(username, password)
      .then((value) => {
        router.push('/');
      })
      .catch((error) => {
        setError("apiError", { message: error.toString() });
      });
  };

  return (
    <div className="row h-full">
      <div className="col-sm-8 col-md-5 mx-auto my-auto p-10">
        <div className="row p-10 card shadow-lg">
          <div className="card-title">
            <h2 className="ml-3 font-bold"> User Login </h2>
          </div>

          <form onSubmit={handleSubmit(handleOnSubmit, (e)=> console.log('Invalid:', e))}>
            <div className="card-body">
              <div className="form-group font-semibold ">
                <label htmlFor="username"> Username </label>
                <input
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  type="text"
                  id="username"
                  name="username"
                  {...register('username')}
                />
                <div className="invalid-feedback">
                  {errors.username?.message}
                </div>
              </div>
              <br />

              <div className="form-group font-semibold">
                <label htmlFor="password"> Password </label>
                <input
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  id="password"
                  name="password"
                  type="password"
                  {...register('password')}
                />
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>
              <br />
              <div className="form-group">
                <button
                  disabled={formState.isSubmitting}
                  className="w-full btn btn-success hover:shadow-lg"
                >
                  {formState.isSubmitting && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                  Login
                </button>
                {errors.apiError && (
                  <div className="alert alert-danger mt-3 mb-0">
                    {errors.apiError?.message}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
