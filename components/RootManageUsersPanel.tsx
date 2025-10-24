import { useEffect, useState } from "react";
import UserForm from "./UserForm";

interface UserInfo {
  id: string;
  email: string;
  role: "admin" | "root" | null;
}

export default function RootManageUsersPanel() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loadingUserCreation, setLoadingUserCreation] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/list-users");
      if (!res.ok) throw new Error(await res.text());

      const usersData: UserInfo[] = await res.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const { email, password, confirmPassword, role } = formData;

    if (!email || !password || !confirmPassword) {
      setFormError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setLoadingUserCreation(true);

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to create user.");
        setLoadingUserCreation(false);
        return;
      }

      alert("User created successfully!");
      setShowCreateForm(false);
      setFormData({ email: "", password: "", confirmPassword: "", role: "" });
      fetchUsers();
    } catch (error) {
      console.error("Unexpected error:", error);
      setFormError("Unexpected error occurred.");
    } finally {
      setLoadingUserCreation(false);
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setFormError(null);
    setFormData({ email: "", password: "", confirmPassword: "", role: "" });
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
        alert(data.error || "Failed to delete user.");
        return;
      }

      alert("User deleted.");
      fetchUsers();
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Unexpected error deleting user.");
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send reset email.");
        return;
      }

      alert(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error("Reset password error:", error);
      alert("Unexpected error sending reset email.");
    }
  };

  const handleToggleRoot = async (user: UserInfo) => {
    const newRole = user.role === "root" ? "admin" : "root";

    try {
      const res = await fetch("/api/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update role.");
        return;
      }

      alert(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error("Toggle role error:", error);
      alert("Unexpected error updating role.");
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔐 User Management (Root Access)
      </h2>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showCreateForm ? "Close Form" : "➕ Create New User"}
        </button>
      </div>

      {showCreateForm && (
        <UserForm
          isEditing={false}
          title="Create New User"
          formData={formData}
          onFormChange={handleUserFormChange}
          onSubmit={handleUserFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {formError && (
        <p className="text-red-600 mb-4 font-semibold">{formError}</p>
      )}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="min-w-full border mt-6 bg-white shadow-sm rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => handleResetPassword(user.email)}
                  >
                    Reset Password
                  </button>
                  <button
                    className="text-yellow-600 hover:underline text-sm"
                    onClick={() => handleToggleRoot(user)}
                  >
                    {user.role === "root" ? "Revoke Root" : "Grant Root"}
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}