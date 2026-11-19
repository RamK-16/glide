import { afterAll, vi } from "vitest";

// Load the mock before any suite starts. The vitest-canvas-mock wrapper starts
// its own unawaited import, which can outlive short suites and their globals.
vi.stubGlobal("jest", vi);
const { setupJestCanvasMock } = await import("jest-canvas-mock");
setupJestCanvasMock(window);
afterAll(() => vi.unstubAllGlobals());

global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

Image.prototype.decode = () => new Promise(resolve => window.setTimeout(resolve, 10));
