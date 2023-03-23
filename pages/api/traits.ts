import { NextApiHandler } from "next";
import getConfig from "next/config";
import { stringify } from "querystring";

const handleGet: NextApiHandler = async (req, res) => {
  const {
    serverRuntimeConfig: { segmentApiKey, segmentSpaceId },
  } = getConfig();

  if (!segmentApiKey || !segmentSpaceId) {
    return res
      .status(400)
      .json({ message: "Segment settings are not configured" });
  }

  const nextCookies = req.cookies;
  const ajs_anonymous_id = nextCookies.ajs_anonymous_id;

  if (!segmentApiKey || !segmentSpaceId) {
    return res.status(401).json({
      message:
        "Segment identification hasn't taken place. No ajs_anonymous_id set",
    });
  }


  const url = "https://api.ci.ai.dynamics.com/v1/instances/42d1b1fa-046f-487a-ad62-b9d99b09ecba/data/Customer?$filter=CustomerId eq '3c65adba444e75db32a78180cdb295ba'";


  try {
    const response = await fetch(url, {
      headers: {
        'Cache-Control':'no-cache',
        'Ocp-Apim-Subscription-Key': '9d13571d1c444381942738c05eaac76d',
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIwYmZjNDU2OC1hNGJhLTRjNTgtYmQzZS01ZDNlNzZiZDdmZmYiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85YzMxYzhlMy04MzEwLTQ1YjUtOGRiZC04ZmE3OTIwN2ExOTAvIiwiaWF0IjoxNjc5NTY3NjAwLCJuYmYiOjE2Nzk1Njc2MDAsImV4cCI6MTY3OTU3Mjk0MywiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhUQUFBQWdRWkR4cUJ4NzFBKzJKRUN5TlJkYzR3VUZSQ0wwZ0x4RWl5Y1JqbEwybEZzUlJ0a0pMUlRZQi9TS29OQnJicUkiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiODE4MTc2YTQtNDQ1YS00YmZiLTlhZjMtNmY4MzY0ZTkxZGYwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJaYXRpcmtvIiwiZ2l2ZW5fbmFtZSI6IkJvaGRhbiIsImdyb3VwcyI6WyJmYzQzNzBjNS00MzFkLTRkMTgtYTczNy1hZTk3ZDM2YjIxYjQiXSwiaXBhZGRyIjoiODguMTMwLjIwNS44MiIsIm5hbWUiOiJCb2hkYW4gWmF0aXJrbyIsIm9pZCI6IjhhZDk2OTcwLTA5OWItNDI1Mi04ZTc0LTVjNmQ4MWExNmQ1MiIsInB1aWQiOiIxMDAzMjAwMURFNkYxMDJFIiwicmgiOiIwLkFWSUE0OGd4bkJDRHRVV052WS1ua2dlaGtHaEZfQXU2cEZoTXZUNWRQbmE5Zl85U0FQZy4iLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJuckxySWxVZ0IxTVJzelJpTG9vR0F6dUhaOTZFcmVqb0tVRU9zOGhuRV9RIiwidGlkIjoiOWMzMWM4ZTMtODMxMC00NWI1LThkYmQtOGZhNzkyMDdhMTkwIiwidW5pcXVlX25hbWUiOiJib2hkYW56QHVuaWZvcm0uZGV2IiwidXBuIjoiYm9oZGFuekB1bmlmb3JtLmRldiIsInV0aSI6Imk0QlVYeGxzYjBtMDVkVkhaR2tiQUEiLCJ2ZXIiOiIxLjAifQ.sKWNubM6urd_RzlEY-FchFiEjR31PehYC65R20DZsi2gh-UPKUszAwmp51epdf1G8kV7OlT3jQA6xYjX-dGUEkfc4z1Aqs0EiVqr7Qy_QtBza8PZc9FG9UO36dy-GaB-AppWHNr2kEuSSed1I4sopqQV01Dx3ODD8Wseq4prIJPfhxqWp5yWpIxQ9vlHmN_bPPATw29clnfBwJzMZmHi1wz3lO-CQ01t9a4Y9UWhWFTy6bbaVn2GTmKE9bkg2A5C5O4F6Z60s2OedpZZJXdU3TPU6BC2113qEercoYWyHfWS5kYDoMVORBnrTpOXnXaWEw9vTsFgK-ihyu022ExouA`,
      },
    });
    const json = await response.json();
    console.log("json output insights");
    console.log(stringify(json)); 
    
    return res.status(200).json({
            traits: json.value,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error,
    });
  }


  // const url = `https://profiles.segment.com/v1/spaces/${segmentSpaceId}/collections/users/profiles/anonymous_id:${ajs_anonymous_id}/traits`;

  // const basicAuth = Buffer.from(segmentApiKey + ":").toString("base64");

  // try {
  //   const response = await fetch(url, {
  //     headers: {
  //       Authorization: `Basic ${basicAuth}`,
  //     },
  //   });
  //   const json = await response.json();
  //   return res.status(200).json({
  //     traits: json.traits,
  //   });
  // } catch (error) {
  //   console.log("error", error);
  //   return res.status(500).json({
  //     error,
  //   });
  // }
};

const handler: NextApiHandler = async (req, res) => {
  const method = req.method?.toLocaleLowerCase();
  if (method === "get") {
    return handleGet(req, res);
  } else if (method === "post") {
    return res.status(400).json({ message: "Method not implemented" });
  }

  return res.status(400).json({ message: "Method not implemented" });
};

export default handler;
