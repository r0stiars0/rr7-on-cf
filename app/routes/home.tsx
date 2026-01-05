import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

import { env } from 'prisma/config'
import React from "react";
import { Await } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {

   const timeNow = Date.now();
  const connectionString = env('DATABASE_URL');


  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })


  const membersCount =  new Promise(resolve => prisma.member.count().then(resolve));



  return { membersCount: membersCount, elapsedTime : Date.now() - timeNow };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div>
    <div className="mx-auto max-w-7xl text-center font-semibold text-2xl">Loader elapsed time: {loaderData.elapsedTime} ms</div>
    <React.Suspense fallback={<div className="mx-auto max-w-7xl text-center font-semibold text-2xl">Loading ...</div>}>
      <Await resolve={loaderData.membersCount}>
        {(value) => <h3 className="mx-auto max-w-7xl text-center font-semibold text-2xl">Members Count: {value}</h3>}
      </Await>
    </React.Suspense>
  </div>;
}
