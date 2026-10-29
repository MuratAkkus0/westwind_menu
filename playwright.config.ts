import { defineConfig, devices } from "@playwright/test";

// E2E_STATIC=1 runs the suite against the static export in out/ instead of the dev server.
const isStatic = process.env.E2E_STATIC === "1";
const port = isStatic ? 3100 : 3000;

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: `http://localhost:${port}` },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
  webServer: {
    command: isStatic
      ? `serve out --listen ${port} --no-request-logging`
      : "pnpm dev",
    url: `http://localhost:${port}`,
    reuseExistingServer: !isStatic,
  },
});
