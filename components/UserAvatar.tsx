import { auth } from "@/auth";

export async function UserAvatar() {
  const session = await auth();

  if (!session?.user?.image) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={session.user.image} alt="User Avatar" width="50" height="50" />
  );
}
