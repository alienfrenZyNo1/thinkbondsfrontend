import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HomeButtons } from "@/components/home-buttons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If the user is signed in, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // If not signed in, show public content
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to ThinkBonds Portal</h1>
        <p className="text-center text-gray-600 mb-8">
          Please sign in to access your dashboard and manage your policies.
        </p>
        <HomeButtons />
      </div>
    </div>
  );
}
