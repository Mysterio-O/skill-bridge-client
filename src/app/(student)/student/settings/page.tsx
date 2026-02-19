import React from "react";
import StudentProfileForm from "./components/student-profile-form";
import { getStudentProfileAction } from "./actions";
import SettingsHeader from "./components/setting-header";

export default async function StudentSettingPage() {
  const profile = await getStudentProfileAction();

  // console.log(profile)

  return (
    <div className="space-y-6 p-4 md:p-6">
      <SettingsHeader />
      <StudentProfileForm profile={profile} />
    </div>
  );
}
