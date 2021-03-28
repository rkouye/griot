import { USEML_URL } from "./config";

export async function getUsemlEmbed(instances: string[]): Promise<number[][]> {
  const response = await fetch(USEML_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ instances }),
  });
  if (response.status >= 400) {
    throw new Error(await response.text());
  }
  return (await response.json())["predictions"];
}
