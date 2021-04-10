# griot

Sample implementation of multilingual semantic search with Elasticsearch using NLP embeddings.

[Try griot, the multilingual quote search engine](https://griot.vercel.app/).

![Demo](demo.gif)

## Architecture

ML models are served with Tensorflow Serving which provide a rest API to create [word embeddings](https://en.wikipedia.org/wiki/Word_embedding).

A Logstash pipeline is used to embed the quotes before indexing in Elasticsearch. This can be used in production, as it should automatically index new entries.

For each search request, the web service embed the term, then request a similarity score to Elasticsearch, and finally display the most relevant results.

This can also be combined with a simple term matching to filter large dataset as computing the similarity score for each entry can be expensive.

For the model, I picked Google's **Universal Sentence Encoder** because it provided multilingual search.

## Running locally

Install docker, then run in this directory :

`docker-compose up`

## Todo

- Add webapp to docker compose
- Add BERT as a model and allow switching to compare their efficiency

## Citation

- Madadipouya, Kasra. (2016). CSV dataset of 76,000 quotes. 10.13140/RG.2.1.4386.4561
- <https://www.elastic.co/blog/text-similarity-search-with-vectors-in-elasticsearch>
- <https://tfhub.dev/google/universal-sentence-encoder-multilingual-large/3>
