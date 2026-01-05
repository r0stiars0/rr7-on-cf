import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";



export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const connectionString = `${process.env.DATABASE_URL}`

  const adapter = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter })
  console.log("Calculate members...");
  const membersCount = await prisma.member.count();
  console.log("Members count:", membersCount);


  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE, membersCount: membersCount };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <div><Welcome message={loaderData.message} />
    <h3 className="mx-auto max-w-7xl text-center font-semibold text-2xl">Non critical value: {loaderData.membersCount}</h3>
  </div>;
}
