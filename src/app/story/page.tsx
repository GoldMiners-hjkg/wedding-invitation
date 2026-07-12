import { redirect } from "next/navigation";

/** Legacy path — invite now lives at `/` */
export default function StoryRedirect() {
  redirect("/");
}
