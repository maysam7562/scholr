"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"student" | "professor" | "university">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const signUp = async () => {
    setMsg("");

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);

    const userId = data.user?.id;
    if (!userId) return setMsg("Signup created, but user id missing.");

    const { error: profileErr } = await supabase
      .from("profiles")
      .insert({ id: userId, role, display_name: displayName });

    if (profileErr) return setMsg(profileErr.message);

    router.push("/login");
  };

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Create your Scholr account</h1>

      <label style={{ display: "block", marginTop: 14 }}>Display name</label>
      <input
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <label style={{ display: "block", marginTop: 14 }}>Role</label>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
        style={{ width: "100%", padding: 10 }}
      >
        <option value="student">Student</option>
        <option value="professor">Professor</option>
        <option value="university">University</option>
      </select>

      <label style={{ display: "block", marginTop: 14 }}>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 10 }} />

      <label style={{ display: "block", marginTop: 14 }}>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={signUp} style={{ marginTop: 18, padding: 12, width: "100%" }}>
        Sign up
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <p style={{ marginTop: 16 }}>
        Already have an account? <a href="/login">Log in</a>
      </p>
    </main>
  );
}
