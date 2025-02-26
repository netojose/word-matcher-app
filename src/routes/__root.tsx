import { createRootRoute, Outlet } from "@tanstack/react-router";

import { css } from "@/styled-system/css";

export const Route = createRootRoute({
  component: () => (
    <div
      className={css({
        backgroundColor: "red",
        width: "100%",
        height: "100%",
      })}
    >
      <Outlet />
    </div>
  ),
});
