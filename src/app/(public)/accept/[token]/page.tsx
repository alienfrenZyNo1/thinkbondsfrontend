import { AcceptanceFlow } from "@/components/acceptance-flow";

export default function AcceptInvitePage({ params }: { params: { token: string } }) {
  return (
    <div>
      <AcceptanceFlow token={params.token} />
    </div>
  );
}