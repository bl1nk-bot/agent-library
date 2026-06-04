#!/bin/bash
find src/__tests__/api -name "*.test.ts" -exec sed -i 's/vi.mock("@\/lib\/auth", () => ({/vi.mock("@\/lib\/auth", () => ({\n  auth: vi.fn(),\n}));\n\/\/vi.mock("@\/lib\/auth", () => ({/' {} +
