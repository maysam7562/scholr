"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

type Lesson = {
  id: string;
  title: string;
  video_url: string;
  position: number;
};

export default function CoursePublic({ params }: { params: { id: string } }) {
  const courseId = useMemo(() => params.id, [params.id]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setMsg("");
      const { data: course, error: courseErr } = await supabase
        .from("courses")
        .select("title,description")
        .eq("id", courseId)
        .single();

      if (courseErr) return setMsg(courseErr.message);

      setTitle(course.title);
      setDescription(course.description);

      const { data: lessonData, error: lessonErr } = await supabase
        .from("lessons")
        .select("id,title,video_url,position")
        .eq("course_id", courseId)
        .order("position", { ascending: true });

      if (lessonErr) return setMsg(lessonErr.message);
      setLessons((lessonData ?? []) as Lesson[]);
    })();
  }, [courseId]);

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>{title}</h1>
      {description && <p style={{ marginTop: 10 }}>{description}</p>}
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <h2 style={{ marginTop: 20, fontSize: 18, fontWeight: 700 }}>Lessons</h2>

      {lessons.length === 0 ? (
        <p style={{ marginTop: 10 }}>No lessons yet.</p>
      ) : (
        <ol style={{ marginTop: 10, paddingLeft: 18 }}>
          {lessons.map((l) => (
            <li key={l.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>
                #{l.position} — {l.title}
              </div>
              <a href={l.video_url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                Watch video
              </a>
            </li>
          ))}
        </ol>
      )}

      <p style={{ marginTop: 18 }}>
        <a href="/courses" style={{ textDecoration: "underline" }}>← Back to courses</a>
      </p>
    </main>
  );
}
