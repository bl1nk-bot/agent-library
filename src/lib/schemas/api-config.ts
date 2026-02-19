import { z } from "zod";

export const apiConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  baseUrl: z.string().url("Invalid URL"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  headers: z.record(z.string(), z.string()).optional(),
  queryParams: z.record(z.string(), z.string()).optional(),
  bodySchema: z.any().optional(),
  responseSchema: z.any().optional(),
  authentication: z.any().optional(),
  testEndpoint: z.string().optional(),
  documentation: z.string().optional(),
});
