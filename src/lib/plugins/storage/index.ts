import { registerStoragePlugin } from "../registry";
import { urlStoragePlugin } from "./url";

const ENABLED_STORAGE: string = process.env.ENABLED_STORAGE || "url";

// Register all built-in storage plugins
export function registerBuiltInStoragePlugins(): void {
  if (ENABLED_STORAGE === "url") {
    registerStoragePlugin(urlStoragePlugin);
    return;
  }

  if (ENABLED_STORAGE === "s3" || ENABLED_STORAGE === "do-spaces") {
    import("./s3").then(({ s3StoragePlugin }) => {
      registerStoragePlugin(s3StoragePlugin);
    });
    return;
  }

  console.warn(`No storage plugin enabled for "${ENABLED_STORAGE}"`);
}

export { urlStoragePlugin };
