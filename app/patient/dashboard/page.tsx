"use client";

import useSessionStore from "@/lib/store/useSessionStore";

export default function PatientDashboard() {
  const { session, status } = useSessionStore();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Patient Dashboard</h1>
      {session ? (
        <div>
          <p>Bienvenue, {session.user?.name}!</p>
          <p>Email: {session.user?.email}</p>
        </div>
      ) : (
        <p>Veuillez vous connecter</p>
      )}
    </div>
  );
}
