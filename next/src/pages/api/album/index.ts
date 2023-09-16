import prisma from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const album = await prisma.battle.findMany({
      where: { winningPhoto: { not: null } },
      select: { winningPhoto: true },
    });

    return res.status(200).json(album);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: (error as Error).message });
  }
}
