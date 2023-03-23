import manifest from "../../lib/uniform/contextManifest.json" assert { type: "json" };
import {
  createEdgeContext,
  createUniformEdgeHandler,
  buildNetlifyQuirks,
} from "../../lib/uniform/index.deno.js";
// @ts-ignore: deno imports failing next build
import type { Context } from "netlify:edge";

export default async (request: Request, netlifyContext: Context) => {
  // ignoring requests that are not pages
  if (!shouldProcess) {
    return await netlifyContext.next({ sendConditionalRequest: true });
  }

  const context = createEdgeContext({
    manifest: manifest,
    request,
  });
  const originResponse = await netlifyContext.next();
  const handler = createUniformEdgeHandler();
  const quirks = {
    ...buildNetlifyQuirks(netlifyContext),
    ...(await getCDPData(netlifyContext)),
  };
  console.log("quirks are gonna set here");

  console.log({ quirks });
  const { processed, response } = await handler({
    context,
    request,
    response: originResponse,
    quirks,
  });

  if (!processed) {
    return response;
  }

  return new Response(response.body, {
    ...response,
    headers: {
      // ...response.headers, Symbol cannot be destructured
      "Cache-Control": "no-store, must-revalidate",
      "Content-Type": "text/html; charset=utf-8", // To apply automatic deno compression, more info https://deno.com/deploy/docs/compression
      Expires: "0",
    },
  });
};
 
async function getCDPData(netlifyContext: Context) {
  
  // const CUSTOMER_INSIGHTS_ENDPOINT = process.env.CUSTOMER_INSIGHTS_ENDPOINT;



// @ts-ignore: deno imports failing next build
const ACCESS_TOKEN = Deno.env.get("MCI_ACCESS_TOKEN");
  // const CUSTOMER_INSIGHTS_INSTANCE = process.env.CUSTOMER_INSIGHTS_INSTANCE; //42d1b1fa-046f-487a-ad62-b9d99b09ecba

  //const {  customerId }= "85d0a2193825204e3cabe79f0ec4bb95"; 


  const url = "https://api.ci.ai.dynamics.com/v1/instances/42d1b1fa-046f-487a-ad62-b9d99b09ecba/data/Customer?$filter=CustomerId eq '3c65adba444e75db32a78180cdb295ba'";

  const visitorResponse = await fetch(url, {
    headers: {
      'Cache-Control':'no-cache',
      'Ocp-Apim-Subscription-Key': '9d13571d1c444381942738c05eaac76d',
      'Content-Type': 'application/json',
      'Authorization': ACCESS_TOKEN
    },
  });
  console.log({ visitorResponse });
  if (!visitorResponse.ok) {
    console.log("Error fetching CDP data");
    return {};
  }
  const responseJson = await visitorResponse.json();
  const visitorData = responseJson.value; 
  console.log("visitor data");
  
  console.log(visitorData);
  
  const traits = removeUnderscores(visitorData[0]);
  console.log("removed underscores data");
  
  console.log({ traits });

  return traits;
}

function shouldProcess(request: Request) {
  const IGNORED_PATHS = /\/.*\.(ico|png|jpg|jpeg|svg|css|js|json)(?:\?.*|$)$/g;
  return (
    request.method.toUpperCase() === "GET" || !request.url.match(IGNORED_PATHS)
  );
}

function removeUnderscores(obj: any) {
  return Object.keys(obj).reduce((accumulator: any, key) => {
    accumulator[key.replaceAll("_", "")] = obj[key];
    return accumulator;
  }, {});
}
