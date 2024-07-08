import { BIZAO_API_URL } from "../../defaults";

export default async function handler(req, res) {
  const requestMethod = req.method;
  switch (requestMethod) {
    case "POST":
      const { order_id, amount, return_url, cancel_url, state } = JSON.parse(
        req.body
      );
      if (!order_id || !amount || !return_url || !cancel_url) {
        res.status(400).send("Invalid request!!");
      }
      var payload = JSON.stringify({
        currency: "XOF",
        order_id,
        amount,
        return_url,
        cancel_url,
        reference: "Web_Chrono",
        state: state,
      });

      var requestOptions = {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.NEXT_PUBLIC_BIZAO_API_KEY}`,
          "country-code": "ci",
          lang: "en",
          channel: "web",
          category: "BIZAO",
          "Content-Type": "application/json",
        },
        body: payload,
      };

      let resp = await fetch(`${BIZAO_API_URL}/debitCard/v2`, requestOptions);
      res.status(resp.ok ? 200 : 400).json(await resp.json());
      break;

    default:
      res.status(405).send("Method Not Allowed");
  }
}
