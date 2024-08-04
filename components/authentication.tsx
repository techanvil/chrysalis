import { auth } from "@/auth";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";
import { UserAvatar } from "./UserAvatar";
import styles from "./Authentication.module.css";

export async function Authentication() {
  const session = await auth();

  console.log({
    session,
  });

  return (
    <div className={styles.container}>
      <UserAvatar />
      {session?.user ? <SignOut /> : <SignIn />}
    </div>
  );
}
