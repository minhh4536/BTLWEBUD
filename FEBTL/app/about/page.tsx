export default async function AboutPage() {
  const res = await fetch("URLAPI", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const users = await res.json();

  return (
    <div>
      <h1>Đây là trang About</h1>

      {users.slice(0, 5).map((user: any) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
