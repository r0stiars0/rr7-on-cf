import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import React from "react";
import { Await } from "react-router";
import { prisma } from "../lib/prisma";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulatedDelay(value: string, ms: number) {
  // Simulate a delay between 500ms and 1500ms

  await delay(ms);
  return value;
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {

  const membersCount = prisma.member.count().then(u => u);



  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE, membersCount: membersCount };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div><Welcome message={loaderData.message} />
    <React.Suspense fallback={<div className="mx-auto max-w-7xl text-center font-semibold text-gray-100 text-2xl">Loading ...</div>}>
      <Await resolve={loaderData.membersCount}>
        {(value) => <h3 className="mx-auto max-w-7xl text-center font-semibold text-gray-100 text-2xl">Non critical value: {value}</h3>}
      </Await>
    </React.Suspense>
  </div>;
}
