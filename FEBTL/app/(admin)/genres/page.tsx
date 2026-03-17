import GenreTable from "@/components/genresadmincomponent";

export default function Genres() {
  return (
    <div className="container">
      <h1>Genres</h1>
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
            Genres
          </li>
        </ol>
      </nav>

      <GenreTable />
    </div>
  );
}
