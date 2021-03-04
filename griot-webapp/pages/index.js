import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const [query, setQuery] = useState("");
  const { data: response, error, isValidating } = useSWR(
    `/api/search?query=${encodeURIComponent(query)}`,
    fetcher
  );

  return (
    <div>
      <Head>
        <title>Griot</title>
      </Head>
      <main>
        <p style={{ margin: "1rem" }}>
          Search a quote by meaning in any of the{" "}
          <b
            style={{ color: "blue" }}
            title="Arabic, Chinese-simplified, Chinese-traditional, English, French,
            German, Italian, Japanese, Korean, Dutch, Polish, Portuguese,
            Spanish, Thai, Turkish, Russian">
            16 languages supported
          </b>{" "}
          :{" "}
          <input
            style={{ minWidth: "10rem" }}
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </p>
        {error && <code>{JSON.stringify(error)}</code>}
        {response && (
          <ul>
            {response.hits.map((hit) => (
              <li key={hit._id} style={{ margin: "1rem" }}>
                {hit._source.quote} <b>({hit._source.author})</b>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
