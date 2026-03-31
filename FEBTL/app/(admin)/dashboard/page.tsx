import DashboardTable from "@/components/dashboardcomponent";

export default function Dashboard() {
  return (
    <div className="m-2">
      <h1>Dashboard</h1>
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
        </ol>
      </nav>

      <DashboardTable />
    </div>
  );
}
