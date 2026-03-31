import MoviesTable from "@/components/moviesadmincomponent";

export default function Movies() {
  return (
    <div className="m-2">
      <h1>Movies</h1>
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
            Movies
          </li>
        </ol>
      </nav>

      <MoviesTable />
    </div>
  );
}
