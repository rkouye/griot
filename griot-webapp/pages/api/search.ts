import { NextApiResponse, NextApiRequest } from "next";
import esClient from "services/es";
import { getUsemlEmbed } from "services/tensorflow";

interface SearchQuery {
  query: string;
}

function extractSearchQuery(req: NextApiRequest): SearchQuery {
  let { query } = req.query;
  if (!query) query = "";
  if (Array.isArray(query)) {
    query = query.join(" ");
  }
  return {
    query,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = extractSearchQuery(req);
  try {
    const usemlEmbed = (await getUsemlEmbed([query]))[0];
    const response = await esClient.search({
      index: "quotes",
      _source_includes: ["quote", "author", "tags"],
      size: 100,
      body: {
        query: {
          bool: {
            should: [
              {
                script_score: {
                  query: { match_all: {} },
                  min_score: 1.11,
                  script: {
                    source:
                      "doc['embed_useml'].size() == 0 ? 0 : (cosineSimilarity(params.query_vector, 'embed_useml')+1)",
                    params: { query_vector: usemlEmbed },
                  },
                },
              },
            ],
          },
        },
        highlight: {
          fields: {
            quote: {},
          },
        },
        sort: [
          {
            _score: {
              order: "desc",
            },
          },
        ],
      },
    });
    return res.status(200).json({ hits: response.body.hits.hits });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};
