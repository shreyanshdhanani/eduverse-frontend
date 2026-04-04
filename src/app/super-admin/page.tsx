import { redirect } from "next/navigation";

export default function admin() {
    redirect("/super-admin/dashboard");
}