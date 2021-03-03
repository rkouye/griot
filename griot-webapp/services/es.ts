import { Client } from "@elastic/elasticsearch";

const node = "http://localhost:9300";

const client = new Client({ node });

export default client;
