import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import styles from "./index.module.css";

const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    (error as any).info = await res.json();
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

const example = "software development";

export default function Home() {
  const [searchBarValue, setSearchBarValue] = useState("");
  const query = useDebounce(searchBarValue, 1000);
  const {
    data: response,
    error,
    isValidating,
  } = useSWR(
    `/api/search?query=${encodeURIComponent(query || example)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const searching = isValidating || searchBarValue != query;

  return (
    <div className="relative">
      <Head>
        <title>Griot</title>
        <meta
          name="description"
          content="Multilingual quote search engine. Powered by machine learning."
        />
      </Head>
      <a href="https://github.com/rkouye/griot">
        <img
          src="/github-logo.svg"
          alt="github"
          className="h-6 fixed z-20 top-4 right-4"
        />
      </a>
      <header className="w-full sticky top-0 z-10 bg-paper shadow py-4">
        <div className="text-8xl text-center">
          gr<span className="text-primary">io</span>t
        </div>
        <p className="text-center text-xs text-gray-500 mt-5">
          Multilingual quote search engine
        </p>
        <div className="mx-auto max-w-xl p-4 relative">
          <svg
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="currentColor"
            className={`text-primary absolute right-8 top-7 ${
              searching ? "animate-spin" : ""
            }`}>
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            className={`${styles.searchBar} text-gray-600`}
            type="text"
            onChange={(e) => setSearchBarValue(e.target.value)}
            value={searchBarValue}
            placeholder={`Type the subject here, example : ${example}`}
            autoFocus
          />
        </div>
      </header>
      <main
        className={`m-4 ${
          searching ? "opacity-0" : "opacity-100"
        } transition-all`}>
        {error && (
          <code className="text-danger">‼️ Oups ! - An error occurred.</code>
        )}
        {!error && response && response.hits && (
          <ul className="mx-auto max-w-6xl grid grid-cols-1 gap-4 lg:grid-cols-3">
            {response.hits.map((hit: any, index: number) => (
              <li
                key={index}
                className="text-gray-900 p-4 bg-gray-50 shadow rounded-lg flex flex-col justify-between"
                style={{ minHeight: "200px" }}>
                <p className="text-justify">{hit._source.quote}</p>
                <div className="mt-3 text-right">
                  <b className="text-primary">{hit._source.author}</b>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
