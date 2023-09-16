import prisma from "@/utils/db";
import { WinnerEnum } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const album = await prisma.battle.findMany({
      where: {
        OR: [
          { AND: [{ playerOneID: id as string }, { winner: WinnerEnum.PLAYER1 }] },
          { AND: [{ playerTwoID: id as string }, { winner: WinnerEnum.PLAYER2 }] },
        ],
      },
    });

    return res.status(200).json(album);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: (error as Error).message });
  }
}
