import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values) {
    setServerError(null);
    try {
      await login(values.username, values.password);
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="card w-full max-w-sm bg-base-100 shadow-md border">
        <div className="card-body">
          <h2 className="card-title">Welcome back</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="form-control flex flex-col gap-1">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="yourusername"
                className="input input-bordered w-full"
                {...register("username")}
              />
              {errors.username && (
                <span className="text-sm text-error">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="form-control flex flex-col gap-1">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-sm text-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            {serverError && <p className="text-sm text-error">{serverError}</p>}

            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="text-center text-sm opacity-70 mt-2">
            Don't have an account?&nbsp;
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
