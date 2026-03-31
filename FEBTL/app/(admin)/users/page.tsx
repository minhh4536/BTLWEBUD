import UserPage from "@/components/usersadmincomponent";

export default function User() {
  return (
    <div className="m-2">
      <h1>User</h1>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item ">
            <a
              href="/dashboard"
              className="text-decoration-none text-secondary"
            >
              Dashboard
            </a>
          </li>
          <li className="breadcrumb-item active text-dark" aria-current="page">
            User
          </li>
        </ol>
      </nav>

      <UserPage />
    </div>
  );
}
