import { auth } from "@/auth";
import { SignIn } from "./sign-in";
import { SignOut } from "./sign-out";

export default async function Authentication() {
  const session = await auth();

  console.log({
    session,
  });

  if (session?.user) {
    return <SignOut />;
  }

  return <SignIn />;
}
