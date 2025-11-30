import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "الصفحة الرئيسية",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "الخدمات",
    newTab: false,
    submenu: [
      { id: 21, title: "🎮 الألعاب", path: "/games", newTab: false },
      { id: 22, title: "💳 البطاقات الرقمية", path: "/cards", newTab: false },
      { id: 23, title: "📺 اشتراكات القنوات", path: "/tv", newTab: false },
      { id: 24, title: "📣 خدمات السوشال", path: "/social", newTab: false },
      { id: 25, title: "📱 التطبيقات", path: "/apps", newTab: false },
      { id: 26, title: "💰 الرصيد", path: "/balance", newTab: false },
    ],
  },
  {
    id: 3,
    title: "من نحن",
    path: "/About",
    newTab: false,
  },
 
];

export default menuData;