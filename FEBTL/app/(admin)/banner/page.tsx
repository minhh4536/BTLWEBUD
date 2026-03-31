import BannerPage from "@/components/banneradmincomponent";

export default function banner() {
  return (
    <div className="m-2">
      <h1>Banner</h1>
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
            Banner
          </li>
        </ol>
      </nav>
      <BannerPage />
    </div>
  );
}
