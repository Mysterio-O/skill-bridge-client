import React from "react";
import AdminUsersClient from "./components/admin-users-client";
import { getAdminUsersAction } from "./actions";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { search?: string; page?: string; limit?: string };
}) {
  const search = searchParams?.search ?? "";
  const page = Number(searchParams?.page ?? 1) || 1;
  const limit = Number(searchParams?.limit ?? 10) || 10;

  const initial = await getAdminUsersAction({
    search: search.trim() || undefined,
    page,
    limit,
  });

  return (
    <AdminUsersClient
      initial={initial}
      initialSearch={search}
      initialPage={page}
      initialLimit={limit}
    />
  );
}
