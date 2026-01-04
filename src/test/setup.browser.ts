import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { worker } from "./msw/browser";

// Cleanup after each test
afterEach(async () => {
  worker.resetHandlers();
  cleanup();
});

beforeAll(async () => {
  await worker.start({ onUnhandledRequest: "bypass", quiet: true });
});

afterAll(() => {
  worker.stop();
});
