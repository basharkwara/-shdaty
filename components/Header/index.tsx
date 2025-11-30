"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import menuData from "./menuData";
import { Tajawal } from "next/font/google";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import getBrowserSupabase from "@/lib/supabase-browser";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const Header = () => {
  // ✅ Supabase client للفرونت
  const supabase = getBrowserSupabase();

  // ✅ حالة المستخدم
  const [user, setUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setLoadingUser(false);
    });
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    setSticky(window.scrollY >= 80);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const usePathName = usePathname();

  const [showSearch, setShowSearch] = useState(false);
  const [cartCount] = useState(2);

  const userInitial =
    user?.email?.charAt(0)?.toUpperCase() || "U";

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <>
      <header
        className={`${tajawal.className} header left-0 top-0 z-50 flex w-full items-center transition-all duration-300 ${
          sticky ? "fixed bg-[#1b1030]/95 shadow-md" : "absolute bg-transparent"
        }`}
        style={{ height: sticky ? "64px" : "80px" }}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-3" : "py-5"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {/* أيقونة برق أوضح */}
                  <span className="text-yellow-300 text-4xl drop-shadow-[0_0_12px_#facc15] hover:animate-pulse transition-transform duration-200">
                    ⚡
                  </span>

                  {/* اسم الموقع بخط أكبر وتدرج أوضح */}
                  <h1 className="text-3xl font-black bg-gradient-to-r from-purple-100 via-yellow-300 to-orange-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(255,200,0,0.9)] tracking-wide">
                    Shdaty
                  </h1>
                </div>
              </Link>
            </div>
            <div className="flex w-full items-center justify-around px-4">
              <div>
                <button
                  onClick={navbarToggleHandler}
                  aria-label="فتح القائمة"
                  className="lg:hidden fixed right-4 top-6 w-10 h-10 rounded-full bg-yellow-400/90 text-[#1b1030] flex items-center justify-center shadow-md hover:bg-yellow-300 focus:ring-2 focus:ring-yellow-300 z-50 md:top-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar absolute right-0 z-30 w-[250px] rounded border border-white/20 bg-[#1b1030]/95 text-white text-right px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-0 lg:bg-transparent lg:p-0 lg:opacity-100 ${
                    navbarOpen
                      ? "visible top-full opacity-100"
                      : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-12 lg:space-x-reverse">
                    {menuData.map((menuItem, index) => (
                      <li
                        key={index}
                        className="group relative transition duration-300 ease-in-out"
                      >
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            className={`nav-link whitespace-nowrap flex items-center gap-2 py-2 text-base lg:inline-flex lg:px-0 lg:py-6 transition-colors duration-200 ${
                              usePathName === menuItem.path
                                ? "active text-white"
                                : "text-white hover:text-white/90"
                            }`}
                          >
                            {menuItem.title}
                          </Link>
                        ) : (
                          <>
                            <p
                              onClick={() => handleSubmenu(index)}
                              aria-expanded={openIndex === index}
                              aria-haspopup="menu"
                              className="nav-link whitespace-nowrap flex cursor-pointer items-center justify-between py-2 text-base text-white hover:text-white/90 lg:inline-flex lg:px-0 lg:py-6 transition-colors duration-200"
                            >
                              {menuItem.title}
                              <span className="pl-3">
                                <svg
                                  width="25"
                                  height="24"
                                  viewBox="0 0 25 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </p>
                            <div
                              className={`submenu absolute right-0 top-full rounded-2xl bg-[#1b1030] border border-white/10 shadow-2xl text-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[560px] lg:p-5 lg:opacity-0 lg:group-hover:visible lg:group-hover:top-full ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              <div className="grid grid-cols-2 gap-3">
                                {menuItem.submenu.map(
                                  (submenuItem: any, index: number) => (
                                    <Link
                                      href={submenuItem.path}
                                      key={index}
                                      className="glass-card flex items-center justify-center px-4 py-4 text-sm text-center whitespace-nowrap"
                                    >
                                      <span className="font-medium tracking-wide">
                                        {submenuItem.title}
                                      </span>
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                    <li className="lg:flex items-center">
                      <button
                        onClick={() => setShowSearch(true)}
                        className="p-2 hover:bg:white/10 rounded-full transition"
                        title="ابحث (⌘K / Ctrl+K)"
                      >
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                          />
                        </svg>
                      </button>
                    </li>
                    {/* أزرار الموبايل: تتغيّر حسب حالة المستخدم */}
                    <li className="mt-3 space-y-2 lg:hidden">
                      {!loadingUser && !user && (
                        <>
                          <Link
                            href="/signin"
                            className="block w-full rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg:white/10 transition"
                            title="تسجيل الدخول"
                          >
                            تسجيل الدخول
                          </Link>
                          <Link
                            href="/signup"
                            className="block w-full rounded-md bg-gradient-to-r from-orange-500 to-yellow-400 px-4 py-2 text-sm font-semibold text-white shadow-btn hover:opacity-90 transition"
                            title="اشتراك"
                          >
                            اشتراك
                          </Link>
                        </>
                      )}
                      {!loadingUser && user && (
                        <>
                          <Link
                            href="/account"
                            className="block w-full rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg:white/10 transition"
                            title="حسابي"
                          >
                            {user?.email || "حسابي"}
                          </Link>
                          <Link
                            href="/account/orders"
                            className="block w-full rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg:white/10 transition"
                            title="طلباتي"
                          >
                            طلباتي
                          </Link>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="block w-full rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-btn hover:opacity-90 transition"
                            title="تسجيل الخروج"
                          >
                            تسجيل الخروج
                          </button>
                        </>
                      )}
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <CurrencySwitcher />
                <Link
                  title="لوحة التحكم"
                  href="/dashboard"
                  className="relative hidden md:inline-flex p-2 rounded-full hover:bg-white/10 transition mr-2"
                >
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13l-1.35 2.7A1 1 0 006.6 17h10.8a1 1 0 00.95-.7L21 9M7 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] leading-none bg-red-500 text-white rounded-full px-1.5 py-0.5">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* أزرار الديسكتوب: تتغيّر حسب حالة المستخدم */}
                {!loadingUser && !user && (
                  <>
                    <Link
                      href="/signin"
                      className="hidden mr-4 px-7 py-3 text-base font-medium text-white transition duration-300 hover:text-yellow-300 md:block"
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/signup"
                      className="relative ease-in-up shadow-btn hover:shadow-btn-hover hidden rounded-md bg-gradient-to-r from-orange-500 to-yellow-400 px-8 py-3 text-base font-semibold text:white transition duration-300 hover:opacity-90 md:block md:px-9 lg:px-6 xl:px-9"
                    >
                      <span className="absolute inset-0 -z-10 rounded-md opacity-30 blur-md bg-gradient-to-r from-orange-500 to-yellow-400"></span>
                      اشتراك
                    </Link>
                  </>
                )}

                {!loadingUser && user && (
                  <div className="hidden md:flex items-center gap-3 relative">
                    {/* زر الحساب: أڤاتار + إيميل مختصر + سهم */}
                    <button
                      type="button"
                      onClick={() => setShowAccountMenu((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/10 transition"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-400 text-[#1b1030] text-sm font-bold">
                        {userInitial}
                      </div>
                      <span className="max-w-[140px] truncate text-xs sm:text-sm text-white/90">
                        {user?.email}
                      </span>
                      <svg
                        className={`w-4 h-4 text-white/70 transition-transform ${
                          showAccountMenu ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* منيو الحساب */}
                    {showAccountMenu && (
                      <div className="absolute right-0 top-11 w-56 rounded-2xl bg-[#1b1030] border border-white/10 shadow-2xl text-sm text-white overflow-hidden z-40">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-xs text-white/60 mb-1">مسجّل كـ</p>
                          <p className="text-xs font-medium truncate">{user?.email}</p>
                        </div>
                        <div className="px-4 py-2 border-b border-white/10 text-xs text-white/70">
                          <p className="mb-1">ملخص الحساب</p>
                          <div className="flex justify-between">
                            <span>إجمالي الطلبات</span>
                            <span className="font-semibold text-white">0</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>طلبات قيد التنفيذ</span>
                            <span className="font-semibold text-white">0</span>
                          </div>
                        </div>
                        <nav className="py-1">
                          <Link
                            href="/account/profile"
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition"
                          >
                            <span>معلومات الحساب</span>
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center justify-between px-4 py-2.5 hover:bg:white/5 transition"
                          >
                            <span>طلباتي</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10">
                              سجل الشراء
                            </span>
                          </Link>
                        </nav>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-right px-4 py-2.5 text-red-300 hover:bg-red-500/10 border-t border-white/10 text-sm transition"
                        >
                          تسجيل الخروج
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-white/10 via-white/30 to-white/10" />
        </div>
      </header>
      {showSearch && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSearch(false);
          }}
        >
          <div className="relative w-11/12 max-w-md animate-fade-in animate-scale-in">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              className="w-full rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoFocus
            />
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.98);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease both;
        }
        .animate-scale-in {
          animation: scaleIn 0.15s ease both;
        }
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0)
          );
          width: 0;
          transition: width 0.2s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
        .nav-link:hover {
          text-shadow:
            0 0 5px rgba(255, 255, 255, 0.4),
            0 0 10px rgba(255, 215, 0, 0.35);
        }
        .submenu {
          transform: translateY(6px);
          opacity: 0;
          transition: transform 0.18s ease, opacity 0.18s ease;
        }
        .group:hover .submenu {
          transform: translateY(0);
          opacity: 1;
        }
        .glass-card {
          position: relative;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }
        .glass-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 12px 42px rgba(0, 0, 0, 0.18);
        }
        .glass-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 12px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.35),
            rgba(255, 215, 0, 0.35)
          );
          mask: linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
        }
      `}</style>
    </>
  );
};

export default Header;