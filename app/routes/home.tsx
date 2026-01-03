import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import React from "react";
import { Await } from "react-router";

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

export function loader({ context }: Route.LoaderArgs) {
  const delayMsRange = [2000, 5000]
  const ms = Math.trunc(delayMsRange[0] + Math.random() * (delayMsRange[1] - delayMsRange[0]));
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE, ms:ms, slowerMessage: simulatedDelay("This is a longer message",ms) };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div><Welcome message={loaderData.message} />

    <React.Suspense fallback={<div className="mx-auto max-w-7xl text-center font-semibold text-2xl">Loading in {loaderData.ms} ms...</div>}>
      <Await resolve={loaderData.slowerMessage}>
        {(value) => <h3 className="mx-auto max-w-7xl text-center font-semibold text-2xl">Non critical value: {value}</h3>}
      </Await>
    </React.Suspense>
  </div>;
}
