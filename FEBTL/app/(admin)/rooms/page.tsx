import RoomTable from "@/components/roomsadmincomponent";

export default function Rooms() {
  return (
    <div className="m-2">
      <h1>Rooms</h1>
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
            Rooms
          </li>
        </ol>
      </nav>

      <RoomTable />
    </div>
  );
}
