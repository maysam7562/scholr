"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

type Course = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  language: string | null;
  created_at: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id,title,description,category,level,language,created_at")
        .order("created_at", { ascending: false });

      if (!error) setCourses((data ?? []) as Course[]);
    })();
  }, []);

  const filtered = courses.filter((c) =>
    (c.title + " " + (c.description ?? "") + " " + (c.category ?? "")).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Courses</h1>

      <input
        placeholder="Search courses..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 14 }}
      />

      <ul style={{ marginTop: 16, paddingLeft: 18 }}>
        {filtered.map((c) => (
          <li key={c.id} style={{ marginBottom: 14 }}>
            <Link href={`/courses/${c.id}`} style={{ textDecoration: "underline", fontWeight: 700 }}>
              {c.title}
            </Link>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              {c.category ?? "Uncategorized"} • {c.level ?? "Any level"} • {c.language ?? "Any language"}
            </div>
            {c.description && <div style={{ marginTop: 6 }}>{c.description}</div>}
          </li>
        ))}
      </ul>

      <p style={{ marginTop: 18 }}>
        <a href="/dashboard" style={{ textDecoration: "underline" }}>Professor dashboard</a>
      </p>
    </main>
  );
}
