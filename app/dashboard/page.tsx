"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/auth/login");
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">데일리 오운완 AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">대시보드</h2>
          <p className="text-gray-600">S04에서 운동 기록 기능이 추가됩니다.</p>
        </div>
      </main>
    </div>
  );
}
