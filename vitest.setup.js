import "@testing-library/jest-dom";
import { vi } from "vitest";
import { useRouter } from "next/router";

vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

useRouter.mockImplementation(() => ({
  route: "/",
  pathname: "",
  query: "",
  asPath: "",
}));
