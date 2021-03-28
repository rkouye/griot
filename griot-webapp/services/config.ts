function ensureDefined(value: string | undefined): string {
  if (!value) throw new Error("Values is required");
  return value;
}

export const ES_NODE_URL = ensureDefined(process.env.ES_NODE_URL);
export const USEML_URL = ensureDefined(process.env.USEML_URL);
