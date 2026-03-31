import ShowtimeTable from "@/components/showtimesadmincomponent";

export default function Seat() {
  return (
    <div className="m-2">
      <h1>Showtimes</h1>
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
            Showtimes
          </li>
        </ol>
      </nav>

      <ShowtimeTable />
    </div>
  );
}
