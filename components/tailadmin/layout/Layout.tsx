"use client";
import React from "react";

// إذا عندك Sidebar/Header من القالب حط مساراتها الصح
// مثال:
// import Sidebar from "@/components/tailadmin/common/Sidebar";
// import Header from "@/components/tailadmin/header/Header";

// مؤقتاً بنعمل Layout بسيط ليشتغل الصفحة فوراً
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header بسيط مؤقت */}
      <header className="sticky top-0 z-10 bg-white border-b px-6 py-3 font-semibold">
        لوحة التحكم
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">{children}</div>
    </div>
  );
}