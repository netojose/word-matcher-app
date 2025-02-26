import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link
          to="/challenge/$id/join"
          params={{ id: "some-id" }}
          className="[&.active]:font-bold"
        >
          Join
        </Link>{" "}
        <Link
          to="/challenge/$id/play"
          params={{ id: "some-id" }}
          className="[&.active]:font-bold"
        >
          Play
        </Link>
      </div>
      <hr />
      <Outlet />
    </>
  ),
});
