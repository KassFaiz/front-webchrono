import { BIZAO_API_URL } from "../../defaults";

export default async function handler(req, res) {
  const requestMethod = req.method;
  switch (requestMethod) {
    case "GET":
      const { token: transactionToken } = req.query;

      if (!transactionToken) {
        res.status(400).send("Invalid token");
        return;
      }

      let resp = await fetch(
        `${BIZAO_API_URL}/debitCard/v2/getStatus/${transactionToken}`,
        {
          headers: {
            authorization: `Bearer ${process.env.NEXT_PUBLIC_BIZAO_API_KEY}`,
            "country-code": "ci",
            "Content-Type": "application/json",
          },
        }
      );
      res.status(resp.ok ? 200 : 400).json(await resp.json());
      break;

    default:
      res.status(405).send("Method Not Allowed");
  }
}
