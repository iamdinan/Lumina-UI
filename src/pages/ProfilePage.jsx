import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { getMe, getMyStats, updateProfile } from "@/api/auth.api";

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["myStats"],
    queryFn: getMyStats,
    enabled: !!user,
  });

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!user,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="stats stats-vertical sm:stats-horizontal shadow w-full bg-base-100">
        <div className="stat">
          <div className="stat-title">Episodes Watched</div>
          <div className="stat-value text-primary">
            {statsLoading ? "—" : stats.episodes_watched}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Hours</div>
          <div className="stat-value">
            {statsLoading ? "—" : stats.total_hours}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Days</div>
          <div className="stat-value">
            {statsLoading ? "—" : stats.total_days}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Months</div>
          <div className="stat-value">
            {statsLoading ? "—" : stats.total_months}
          </div>
        </div>
      </div>

      <AccountDetailsCard
        key={
          account
            ? `${account.user_id}-${account.full_name || ""}-${account.email || ""}-${account.country || ""}-${account.birthday || ""}`
            : "account-loading"
        }
        account={account}
        accountLoading={accountLoading}
      />
    </div>
  );
}

function AccountDetailsCard({ account, accountLoading }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    full_name: account?.full_name || "",
    email: account?.email || "",
    country: account?.country || "",
    birthday: account?.birthday ? account.birthday.slice(0, 10) : "",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async (updatedAccount) => {
      queryClient.setQueryData(["me"], updatedAccount);
      setSuccessMsg("Profile updated");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      setTimeout(() => setSuccessMsg(""), 3000);
    },
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateMutation.mutate(form);
  }

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">Account Details</h2>
        <p className="text-sm opacity-60 -mt-2">
          Username: {accountLoading ? "Loading..." : account?.username}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="label-text text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              className="input input-bordered w-full"
              value={form.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-text text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-text text-sm font-medium">Country</label>
            <input
              type="text"
              name="country"
              className="input input-bordered w-full"
              value={form.country}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label-text text-sm font-medium">Birthday</label>
            <input
              type="date"
              name="birthday"
              className="input input-bordered w-full"
              value={form.birthday}
              onChange={handleChange}
            />
          </div>

          {updateMutation.isError && (
            <div className="alert alert-error text-sm py-2">
              <span>
                {updateMutation.error.response?.data?.error || "Update failed"}
              </span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success text-sm py-2">
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
