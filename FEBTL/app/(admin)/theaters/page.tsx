import TheaterTable from "@/components/theatersadmincomponent";

export default function Theater() {
  return (
    <div className="m-2">
      <h1>Theater</h1>
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
            Theater
          </li>
        </ol>
      </nav>

      <TheaterTable />
    </div>
  );
}
