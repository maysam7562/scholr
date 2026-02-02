"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function NewCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("English");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) window.location.href = "/login";
    })();
  }, []);

  const createCourse = async () => {
    setMsg("");
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      setLoading(false);
      window.location.href = "/login";
      return;
    }

    const { data, error } = await supabase
      .from("courses")
      .insert({
        professor_id: user.id,
        title,
        description,
        category,
        level,
        language,
      })
      .select("id")
      .single();

    setLoading(false);

    if (error) return setMsg(error.message);

    window.location.href = `/dashboard/course/${data.id}`;
  };

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Create a course</h1>

      <label style={{ display: "block", marginTop: 14 }}>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: 10 }} />

      <label style={{ display: "block", marginTop: 14 }}>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: "100%", padding: 10, minHeight: 90 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <div>
          <label style={{ display: "block" }}>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: 10 }} />
        </div>
        <div>
          <label style={{ display: "block" }}>Level</label>
          <input value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: "100%", padding: 10 }} placeholder="Beginner / Intermediate / Advanced" />
        </div>
      </div>

      <label style={{ display: "block", marginTop: 14 }}>Language</label>
      <input value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%", padding: 10 }} />

      <button onClick={createCourse} disabled={loading} style={{ marginTop: 18, padding: 12, width: "100%" }}>
        {loading ? "Creating..." : "Create course"}
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <p style={{ marginTop: 16 }}>
        <a href="/dashboard" style={{ textDecoration: "underline" }}>← Back to dashboard</a>
      </p>
    </main>
  );
}
