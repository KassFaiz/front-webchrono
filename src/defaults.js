export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000" //"http://172.20.10.5:8000"
    : "https://webchrono.up.railway.app";

export const BIZAO_API_URL =
  process.env.NEXT_PUBLI_BIZAO_ENV === "live"
    ? "https://api.bizao.com"
    : "https://preproduction-gateway.bizao.com";
