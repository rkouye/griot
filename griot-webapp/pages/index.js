import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import styles from "./index.module.css";

const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function Home() {
  const [query, setQuery] = useState("how to be motivated ?");
  const { data: response, error, isValidating } = useSWR(
    `/api/search?query=${encodeURIComponent(query)}`,
    fetcher
  );

  return (
    <>
      <Head>
        <title>Griot</title>
      </Head>
      <header className="m-4 text-center">
        <span className="text-8xl">
          gr<span className="text-secondary">io</span>t
        </span>
      </header>
      <main className="m-8">
        <div className="mx-auto max-w-xl p-4 relative">
          <svg
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="currentColor"
            className={`text-gray-600 absolute right-8 top-7 ${
              isValidating ? "animate-pulse text-gray-900" : ""
            }`}>
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            className={`${styles.searchBar} bg-primary text-gray-600`}
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            autoFocus
          />
        </div>
        <p className="text-center text-xs text-gray-500">
          Search quotes by meaning in any of the{" "}
          <b
            className="text-gray-700"
            title="Arabic, Chinese-simplified, Chinese-traditional, English, French,
            German, Italian, Japanese, Korean, Dutch, Polish, Portuguese,
            Spanish, Thai, Turkish, Russian">
            16 languages supported
          </b>
        </p>
        {error && (
          <code className="text-danger">
            ‼️ Oups ! - An error occurred. <br />
            {JSON.stringify(error)}
          </code>
        )}
        {!error && response && response.hits && (
          <ul className="mt-8 mx-auto max-w-4xl">
            {response.hits.map((hit) => (
              <li
                key={hit._id}
                className=" bg-white text-gray-700 p-4 m-4 rounded-lg">
                {hit._source.quote} <b>({hit._source.author})</b>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
