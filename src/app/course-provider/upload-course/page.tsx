import { redirect } from "next/navigation";

export default function uploadCourse()
{
  redirect('/course-provider/upload-course/new-course');
}