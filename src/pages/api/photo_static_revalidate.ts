import type { NextApiRequest, NextApiResponse } from "next/types";

type Data = {
  message?: string;
  revalidated?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
) {
  if (req.query.secret !== "12345") {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    await res.revalidate("/photo_static_revalidate");
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
}
