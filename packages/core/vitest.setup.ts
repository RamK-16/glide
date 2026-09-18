import { vi } from "vitest";

// jest-canvas-mock (внутри vitest-canvas-mock) обращается к global.jest при
// загрузке, поэтому ставим его ДО импорта canvas-mock. Импорт динамический:
// обычный import поднялся бы наверх и сработал раньше этой строки.
global.jest = vi;
await import("vitest-canvas-mock");

global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

Image.prototype.decode = () => new Promise(resolve => window.setTimeout(resolve, 10));
