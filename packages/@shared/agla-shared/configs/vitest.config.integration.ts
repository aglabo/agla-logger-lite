import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "../../../base/configs/vitest.config.base";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: "@aglabo/agla-shared:integration",
      include: ["src/**/__tests__/integration/**/*.spec.ts"],
    },
  }),
);
