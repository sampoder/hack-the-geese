import prisma from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const leaderboard = await prisma.player.findMany({
      orderBy: { score: "desc" },
      include: { _count: { select: { initiatedBattles: true, invitedToBattles: true } } },
    });

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: (error as Error).message });
  }
}
