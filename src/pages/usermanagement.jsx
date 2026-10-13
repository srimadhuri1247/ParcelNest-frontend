import { useState } from "react";
import { Search, Users } from "lucide-react";
import { demoUsers } from "../data/demoData";

export default function UserManagement() {
  const [search, setSearch] = useState("");

  const users = demoUsers.filter((user) =>
    [user.name, user.email, user.collegeId, user.role]
      .some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h1>User Management</h1>
          <p>View the demo accounts available in this frontend.</p>
        </div>
      </div>

      <div className="notice-banner">
        <Users size={22} />
        <div>
          <strong>Demo mode</strong>
          <p>
            These are sample accounts. Creating, editing, and disabling real
            users will require backend APIs and a MySQL users table.
          </p>
        </div>
      </div>

      <section className="content-card">
        <div className="filter-bar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, college ID or role..."
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>College/Employee ID</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.collegeId}</td>
                  <td><span className="role-tag">{user.role}</span></td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr><td colSpan="4" className="empty-state">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}