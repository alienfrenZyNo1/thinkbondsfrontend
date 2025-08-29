import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  // If the user is already signed in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Redirect to Keycloak authentication
  redirect("/api/auth/signin");
}