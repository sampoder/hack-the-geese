import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import useSWR from "swr";

type Person = {
  id: string;
  score: number;
  _count: { initiatedBattles: number; invitedToBattles: number };
};

const LeaderboardPage = () => {
  const { data, error, isLoading } = useSWR("/api/leaderboard", (...args) =>
    fetch(...args).then((res) => res.json())
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 p-6">
        <h1 className="text-3xl font-bold leading-6 text-center w-full">Leaderboard</h1>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg dark:bg-gray-700">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        align="center"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-gray-100"
                      >
                        id
                      </th>
                      {/* <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Name
                    </th> */}
                      <th
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100"
                        align="center"
                      >
                        Total Score
                      </th>
                      <th
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100"
                        align="center"
                      >
                        Games Played
                      </th>
                      <th
                        className="px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100"
                        align="center"
                      >
                        Win Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800 dark:divide-gray-600">
                    {data && data.map((person: Person) => (
                      <tr key={person.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 dark:text-gray-100">
                          {person.id}
                        </td>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        Name
                      </td> */}
                        <td
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300"
                          align="center"
                        >
                          {person.score}
                        </td>
                        <td
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300"
                          align="center"
                        >
                          {person._count.initiatedBattles + person._count.invitedToBattles}
                        </td>
                        <td
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300"
                          align="center"
                        >
                          {person.score /
                            (person._count.initiatedBattles + person._count.invitedToBattles)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderboardPage;
