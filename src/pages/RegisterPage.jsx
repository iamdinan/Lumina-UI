import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be under 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values) {
    setServerError(null);
    try {
      await registerUser(values.username, values.password);
      navigate("/");
    } catch (err) {
      setServerError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="card w-full max-w-sm bg-base-100 shadow-md border">
        <div className="card-body">
          <h2 className="card-title">Create your Lumina account</h2>

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
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="text-center text-sm opacity-70 mt-2">
            Already have an account?&nbsp;
            <Link to="/login" className="link link-primary">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
