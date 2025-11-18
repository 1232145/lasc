"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  role: "admin" | "root";
  created_at: string;
  last_sign_in_at?: string;
}

export default function RootManageUsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "root">("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/list-users");
      if (!res.ok) throw new Error(await res.text());

      const usersData: User[] = await res.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setError(null);
    setSuccess(null);

    if (!newUserEmail) {
      setError("Please provide an email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newUserEmail, role: newUserRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create user.");
        setLoading(false);
        return;
      }

      setSuccess("User created successfully!");
      setNewUserEmail("");
      setNewUserRole("admin");
      fetchUsers();
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete user.");
        return;
      }

      setSuccess("User deleted.");
      fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      setError("Unexpected error deleting user.");
    }
  };

  const handleSendPasswordReset = async (email: string) => {
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email.");
        return;
      }

      setSuccess(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Unexpected error sending reset email.");
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 p-8 rounded-xl shadow-lg border border-orange-200 dark:border-stone-700">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-6">
        User Management (Root Only)
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 p-4 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Create User Form */}
      <div className="bg-orange-50 dark:bg-stone-800 p-6 rounded-lg mb-8 border border-orange-200 dark:border-stone-600">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
          Create New User
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            className="border border-orange-300 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors"
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value as "admin" | "root")}
            className="border border-orange-300 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors"
          >
            <option value="admin">Admin</option>
            <option value="root">Root</option>
          </select>
          <button
            onClick={handleCreateUser}
            disabled={loading || !newUserEmail}
            className="btn-primary bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-100 dark:bg-stone-800 border-b border-orange-200 dark:border-stone-700">
              <th className="text-left p-4 font-medium text-stone-900 dark:text-stone-100">Email</th>
              <th className="text-left p-4 font-medium text-stone-900 dark:text-stone-100">Role</th>
              <th className="text-left p-4 font-medium text-stone-900 dark:text-stone-100">Created</th>
              <th className="text-left p-4 font-medium text-stone-900 dark:text-stone-100">Last Sign In</th>
              <th className="text-left p-4 font-medium text-stone-900 dark:text-stone-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-orange-100 dark:border-stone-700 hover:bg-orange-50 dark:hover:bg-stone-800 transition-colors">
                <td className="p-4 text-stone-700 dark:text-stone-300">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === "root" 
                      ? "bg-coral-100 dark:bg-coral-900/30 text-coral-800 dark:text-coral-300 border border-coral-200 dark:border-coral-700" 
                      : "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-stone-600 dark:text-stone-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-stone-600 dark:text-stone-400">
                  {user.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleDateString() 
                    : "Never"
                  }
                </td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleSendPasswordReset(user.email)}
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 hover:underline text-sm font-medium transition-colors"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:underline text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-8 text-stone-500 dark:text-stone-400">
          No users found.
        </div>
      )}
    </div>
  );
}