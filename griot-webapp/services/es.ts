import { Client } from "@elastic/elasticsearch";
import { ES_NODE_URL } from "./config";

const client = new Client({ node: ES_NODE_URL });

export default client;
