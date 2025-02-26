import { createRootRoute, Outlet } from "@tanstack/react-router";

import { container } from "@/styled-system/patterns";

export const Route = createRootRoute({
  component: () => (
    <div className={container()}>
      <Outlet />
    </div>
  ),
});
