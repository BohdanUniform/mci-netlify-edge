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
  // const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  // const CUSTOMER_INSIGHTS_INSTANCE = process.env.CUSTOMER_INSIGHTS_INSTANCE; //42d1b1fa-046f-487a-ad62-b9d99b09ecba

  //const {  customerId }= "85d0a2193825204e3cabe79f0ec4bb95"; 


  const url = "https://api.ci.ai.dynamics.com/v1/instances/42d1b1fa-046f-487a-ad62-b9d99b09ecba/data/Customer?$filter=CustomerId eq '3c65adba444e75db32a78180cdb295ba'";

  const visitorResponse = await fetch(url, {
    headers: {
      'Cache-Control':'no-cache',
      'Ocp-Apim-Subscription-Key': '9d13571d1c444381942738c05eaac76d',
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIwYmZjNDU2OC1hNGJhLTRjNTgtYmQzZS01ZDNlNzZiZDdmZmYiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85YzMxYzhlMy04MzEwLTQ1YjUtOGRiZC04ZmE3OTIwN2ExOTAvIiwiaWF0IjoxNjc5NTY3NjAwLCJuYmYiOjE2Nzk1Njc2MDAsImV4cCI6MTY3OTU3Mjk0MywiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhUQUFBQWdRWkR4cUJ4NzFBKzJKRUN5TlJkYzR3VUZSQ0wwZ0x4RWl5Y1JqbEwybEZzUlJ0a0pMUlRZQi9TS29OQnJicUkiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiODE4MTc2YTQtNDQ1YS00YmZiLTlhZjMtNmY4MzY0ZTkxZGYwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJaYXRpcmtvIiwiZ2l2ZW5fbmFtZSI6IkJvaGRhbiIsImdyb3VwcyI6WyJmYzQzNzBjNS00MzFkLTRkMTgtYTczNy1hZTk3ZDM2YjIxYjQiXSwiaXBhZGRyIjoiODguMTMwLjIwNS44MiIsIm5hbWUiOiJCb2hkYW4gWmF0aXJrbyIsIm9pZCI6IjhhZDk2OTcwLTA5OWItNDI1Mi04ZTc0LTVjNmQ4MWExNmQ1MiIsInB1aWQiOiIxMDAzMjAwMURFNkYxMDJFIiwicmgiOiIwLkFWSUE0OGd4bkJDRHRVV052WS1ua2dlaGtHaEZfQXU2cEZoTXZUNWRQbmE5Zl85U0FQZy4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJuckxySWxVZ0IxTVJzelJpTG9vR0F6dUhaOTZFcmVqb0tVRU9zOGhuRV9RIiwidGlkIjoiOWMzMWM4ZTMtODMxMC00NWI1LThkYmQtOGZhNzkyMDdhMTkwIiwidW5pcXVlX25hbWUiOiJib2hkYW56QHVuaWZvcm0uZGV2IiwidXBuIjoiYm9oZGFuekB1bmlmb3JtLmRldiIsInV0aSI6Imk0QlVYeGxzYjBtMDVkVkhaR2tiQUEiLCJ2ZXIiOiIxLjAifQ.sKWNubM6urd_RzlEY-FchFiEjR31PehYC65R20DZsi2gh-UPKUszAwmp51epdf1G8kV7OlT3jQA6xYjX-dGUEkfc4z1Aqs0EiVqr7Qy_QtBza8PZc9FG9UO36dy-GaB-AppWHNr2kEuSSed1I4sopqQV01Dx3ODD8Wseq4prIJPfhxqWp5yWpIxQ9vlHmN_bPPATw29clnfBwJzMZmHi1wz3lO-CQ01t9a4Y9UWhWFTy6bbaVn2GTmKE9bkg2A5C5O4F6Z60s2OedpZZJXdU3TPU6BC2113qEercoYWyHfWS5kYDoMVORBnrTpOXnXaWEw9vTsFgK-ihyu022ExouA`,
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
  
  const traits = removeUnderscores(visitorData?.traits);
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
