import { StoryInvitation } from "@/components/story/StoryInvitation";
import { COUPLE } from "@/lib/couple";

export const metadata = {
  title: `${COUPLE.groom.zh} & ${COUPLE.bride.zh} · 婚礼邀请`,
  description: "诚邀您见证我们的幸福",
};

export default function Home() {
  return (
    <div className="invite-page">
      <div className="invite-shell mx-auto min-h-dvh w-full max-w-[430px]">
        <StoryInvitation />
      </div>
    </div>
  );
}
