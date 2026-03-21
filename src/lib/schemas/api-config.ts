import { z } from "zod";

export const apiConfigSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  baseUrl: z.string().url("Invalid URL"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  headers: z.record(z.string(), z.string()).optional(),
  queryParams: z.record(z.string(), z.string()).optional(),
  bodySchema: z.unknown().optional(),
  responseSchema: z.unknown().optional(),
  authentication: z.unknown().optional(),
  testEndpoint: z.string().optional(),
  documentation: z.string().optional(),
});

export type ApiConfigInput = z.infer<typeof apiConfigSchema>;
