const TF_URL = "http://localhost:8501/v1/models/useml:predict";

export async function getUsemlEmbed(instances: string[]): Promise<number[][]> {
  const response = await fetch(TF_URL, {
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
