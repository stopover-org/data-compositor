import { Environment, Network, RecordSource, Store } from "relay-runtime";

const graphqlEndpoint =
  process.env.GRAPHQL_ENDPOINT || "http://localhost:3321/graphql";

function fetchQuery(accessToken?: string) {
  return async function fetchData(operation: { text: any }, variables: any) {
    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        // Add authentication and other headers here
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    });

    return response.json();
  };
}

let environment: Environment | null = null;

function getEnvironment(accessToken?: string) {
  if (environment) {
    return environment;
  }

  environment = new Environment({
    network: Network.create(fetchQuery(accessToken)),
    store: new Store(new RecordSource()),
  });

  return environment;
}

export default getEnvironment;
