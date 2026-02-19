import { getStudentProfileAction } from '@/app/(student)/student/settings/actions';
import SettingsHeader from '@/app/(student)/student/settings/components/setting-header';
import StudentProfileForm from '@/app/(student)/student/settings/components/student-profile-form';
import React from 'react'

export default async function AdminSettings() {

  const profile = await getStudentProfileAction();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <SettingsHeader from="admin" />
      <StudentProfileForm profile={profile}  from="admin"/>
    </div>
  );
}
