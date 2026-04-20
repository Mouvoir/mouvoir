import { createClient } from "next-sanity";
import { sanityConfig } from "./config";

export const sanityWriteClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
