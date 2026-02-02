"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";

type Lesson = {
  id: string;
  title: string;
  video_url: string;
  position: number;
  created_at: string;
};

export default function CourseEditor({ params }: { params: { id: string } }) {
  const courseId = useMemo(() => params.id, [params.id]);
  const [courseTitle, setCourseTitle] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [msg, setMsg] = useState("");

  const [lessonTitle, setLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [position, setPosition] = useState(1);

  const load = async () => {
    setMsg("");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    const { data: course, error: courseErr } = await supabase
      .from("courses")
      .select("id,title")
      .eq("id", courseId)
      .single();

    if (courseErr) return setMsg(courseErr.message);
    setCourseTitle(course.title);

    const { data: lessonData, error: lessonErr } = await supabase
      .from("lessons")
      .select("id,title,video_url,position,created_at")
      .eq("course_id", courseId)
      .order("position", { ascending: true });

    if (lessonErr) return setMsg(lessonErr.message);
    setLessons((lessonData ?? []) as Lesson[]);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const addLesson = async () => {
    setMsg("");

    const { error } = await supabase.from("lessons").insert({
      course_id: courseId,
      title: lessonTitle,
      video_url: videoUrl,
      position,
    });

    if (error) return setMsg(error.message);

    setLessonTitle("");
    setVideoUrl("");
    setPosition((p) => p + 1);
    load();
  };

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Edit course: {courseTitle}</h1>
      <p style={{ marginTop: 6 }}>
        <a href="/dashboard" style={{ textDecoration: "underline" }}>← Back to dashboard</a>{" "}
        |{" "}
        <a href={`/courses/${courseId}`} style={{ textDecoration: "underline" }}>View public page</a>
      </p>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <section style={{ marginTop: 24, borderTop: "1px solid #ddd", paddingTop: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Add a lesson</h2>

        <label style={{ display: "block", marginTop: 12 }}>Lesson title</label>
        <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} style={{ width: "100%", padding: 10 }} />

        <label style={{ display: "block", marginTop: 12 }}>Video URL</label>
        <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={{ width: "100%", padding: 10 }} placeholder="https://youtube.com/watch?v=..." />

        <label style={{ display: "block", marginTop: 12 }}>Order (position)</label>
        <input type="number" value={position} onChange={(e) => setPosition(Number(e.target.value))} style={{ width: 160, padding: 10 }} />

        <button onClick={addLesson} style={{ marginTop: 14, padding: 12 }}>
          Add lesson
        </button>
      </section>

      <section style={{ marginTop: 24, borderTop: "1px solid #ddd", paddingTop: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Lessons</h2>

        {lessons.length === 0 ? (
          <p style={{ marginTop: 10 }}>No lessons yet.</p>
        ) : (
          <ol style={{ marginTop: 10, paddingLeft: 18 }}>
            {lessons.map((l) => (
              <li key={l.id} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600 }}>
                  #{l.position} — {l.title}
                </div>
                <a href={l.video_url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                  {l.video_url}
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
