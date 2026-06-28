import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  MessageCircle,
  UtensilsCrossed,
  Tags,
  SlidersHorizontal,
  Wheat,
  Package,
  BadgePercent,
  Boxes,
  GalleryHorizontal,
  LayoutGrid,
  LayoutList,
  ListChecks,
  Megaphone,
  Hash,
  Info,
  Quote,
  MapPin,
  Mail,
  FileText,
  FilePlus,
  Folder,
  Tag,
  PenTool,
  MessageSquare,
  PanelTop,
  PanelBottom,
  Menu as MenuIcon,
  Share2,
  Palette,
  Search,
  Activity,
  Code,
  CornerUpRight,
  Map as MapIcon,
  Braces,
  Send,
  Users,
  Star,
  Gift,
  BarChart3,
  FileSpreadsheet,
  Wallet,
  CreditCard,
  Receipt,
  Undo2,
  Settings,
  UserCog,
  Plug,
  Image as ImageIcon,
  ScrollText,
  Bell,
  DatabaseBackup,
} from "lucide-react";

export type Role = "owner" | "manager" | "editor" | "staff";
export type BadgeKey = "orders" | "messages" | "reviews" | "comments";

export type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  badgeKey?: BadgeKey;
  roles?: Role[];
  isNew?: boolean;
  children?: NavItem[];
};

export type NavGroup = {
  key: string;
  heading: string;
  items: NavItem[];
};

const BASE = "/fryo-kanji";

/** Live badge counts — wire to SWR/polling later; static placeholders for now. */
export const badgeCounts: Record<BadgeKey, number> = {
  orders: 6,
  messages: 5,
  reviews: 3,
  comments: 4,
};

export const navGroups: NavGroup[] = [
  {
    key: "main",
    heading: "Main",
    items: [
      { label: "Dashboard", href: BASE, icon: LayoutDashboard },
      { label: "Orders", href: `${BASE}/orders`, icon: ClipboardList, badgeKey: "orders" },
      { label: "Order Tracking", href: `${BASE}/order-tracking`, icon: Truck, isNew: true },
      { label: "Messages", href: `${BASE}/chat`, icon: MessageCircle, badgeKey: "messages" },
    ],
  },
  {
    key: "catalog",
    heading: "Catalog",
    items: [
      { label: "Menu Items", href: `${BASE}/foods`, icon: UtensilsCrossed },
      { label: "Categories", href: `${BASE}/catalog/categories`, icon: Tags, isNew: true },
      { label: "Modifier Groups", href: `${BASE}/catalog/modifiers`, icon: SlidersHorizontal, isNew: true },
      { label: "Ingredients & Allergens", href: `${BASE}/catalog/ingredients`, icon: Wheat, isNew: true },
      { label: "Combos & Bundles", href: `${BASE}/catalog/combos`, icon: Package, isNew: true },
      { label: "Deals & Promo Codes", href: `${BASE}/catalog/deals`, icon: BadgePercent, isNew: true },
      { label: "Inventory / Stock", href: `${BASE}/catalog/inventory`, icon: Boxes, isNew: true },
    ],
  },
  {
    key: "content",
    heading: "Content",
    items: [
      { label: "Hero Slides", href: `${BASE}/content/hero`, icon: GalleryHorizontal, isNew: true },
      { label: "The Lineup", href: `${BASE}/content/lineup`, icon: LayoutGrid, isNew: true },
      { label: "Menu Section", href: `${BASE}/content/menu-section`, icon: LayoutList, isNew: true },
      { label: "How It Works", href: `${BASE}/content/how-it-works`, icon: ListChecks, isNew: true },
      { label: "Today's Deals Block", href: `${BASE}/content/deals-block`, icon: Megaphone, isNew: true },
      { label: "Stats Counters", href: `${BASE}/content/stats`, icon: Hash, isNew: true },
      { label: "About", href: `${BASE}/content/about`, icon: Info, isNew: true },
      { label: "Testimonials", href: `${BASE}/content/testimonials`, icon: Quote, isNew: true },
      { label: "Contact Block", href: `${BASE}/content/contact`, icon: MapPin, isNew: true },
      { label: "Newsletter Block", href: `${BASE}/content/newsletter`, icon: Mail, isNew: true },
    ],
  },
  {
    key: "blog",
    heading: "Blog",
    items: [
      { label: "All Posts", href: `${BASE}/blog/posts`, icon: FileText, isNew: true },
      { label: "Add New", href: `${BASE}/blog/posts/new`, icon: FilePlus, isNew: true },
      { label: "Categories", href: `${BASE}/blog/categories`, icon: Folder, isNew: true },
      { label: "Tags", href: `${BASE}/blog/tags`, icon: Tag, isNew: true },
      { label: "Authors", href: `${BASE}/blog/authors`, icon: PenTool, isNew: true },
      { label: "Comments", href: `${BASE}/blog/comments`, icon: MessageSquare, badgeKey: "comments", isNew: true },
    ],
  },
  {
    key: "appearance",
    heading: "Appearance",
    items: [
      { label: "Header", href: `${BASE}/appearance/header`, icon: PanelTop, isNew: true },
      { label: "Footer", href: `${BASE}/appearance/footer`, icon: PanelBottom, isNew: true },
      { label: "Navigation Menus", href: `${BASE}/appearance/nav`, icon: MenuIcon, isNew: true },
      { label: "Social Icons", href: `${BASE}/appearance/social`, icon: Share2, isNew: true },
      { label: "Theme & Branding", href: `${BASE}/appearance/theme`, icon: Palette, isNew: true },
      { label: "Announcement Bar", href: `${BASE}/appearance/announcement`, icon: Megaphone, isNew: true },
    ],
  },
  {
    key: "marketing",
    heading: "Marketing & SEO",
    items: [
      {
        label: "SEO Manager",
        icon: Search,
        isNew: true,
        children: [
          { label: "Global Defaults", href: `${BASE}/marketing/seo/global`, icon: Braces, isNew: true },
          { label: "Page SEO", href: `${BASE}/marketing/seo/pages`, icon: FileText, isNew: true },
          { label: "Food SEO", href: `${BASE}/marketing/seo/food`, icon: UtensilsCrossed, isNew: true },
          { label: "Blog SEO", href: `${BASE}/marketing/seo/blog`, icon: PenTool, isNew: true },
        ],
      },
      { label: "Tracking & Pixels", href: `${BASE}/marketing/tracking`, icon: Activity, isNew: true },
      { label: "Custom Code", href: `${BASE}/marketing/custom-code`, icon: Code, isNew: true },
      { label: "Redirects (301/302)", href: `${BASE}/marketing/redirects`, icon: CornerUpRight, isNew: true },
      { label: "Sitemap & Robots", href: `${BASE}/marketing/sitemap`, icon: MapIcon, isNew: true },
      { label: "Schema / Structured Data", href: `${BASE}/marketing/schema`, icon: Braces, isNew: true },
      { label: "Campaigns / Email", href: `${BASE}/marketing/campaigns`, icon: Send, isNew: true },
    ],
  },
  {
    key: "people",
    heading: "People",
    items: [
      { label: "Customers", href: `${BASE}/customers`, icon: Users },
      { label: "Reviews", href: `${BASE}/reviews`, icon: Star, badgeKey: "reviews" },
      { label: "Loyalty & Rewards", href: `${BASE}/people/loyalty`, icon: Gift, isNew: true },
    ],
  },
  {
    key: "insights",
    heading: "Insights",
    items: [
      { label: "Analytics", href: `${BASE}/analytics`, icon: BarChart3 },
      { label: "Reports & Exports", href: `${BASE}/insights/reports`, icon: FileSpreadsheet, isNew: true },
    ],
  },
  {
    key: "finance",
    heading: "Finance",
    items: [
      { label: "Wallet", href: `${BASE}/wallet`, icon: Wallet, roles: ["owner", "manager"] },
      { label: "Payments & Payouts", href: `${BASE}/finance/payments`, icon: CreditCard, roles: ["owner", "manager"], isNew: true },
      { label: "Taxes & Delivery Fees", href: `${BASE}/finance/taxes`, icon: Receipt, roles: ["owner", "manager"], isNew: true },
      { label: "Refunds", href: `${BASE}/finance/refunds`, icon: Undo2, roles: ["owner", "manager"], isNew: true },
    ],
  },
  {
    key: "system",
    heading: "System",
    items: [
      { label: "Settings", href: `${BASE}/system/settings`, icon: Settings, roles: ["owner", "manager"], isNew: true },
      { label: "Users & Roles", href: `${BASE}/system/users`, icon: UserCog, roles: ["owner"], isNew: true },
      { label: "Integrations", href: `${BASE}/system/integrations`, icon: Plug, roles: ["owner"], isNew: true },
      { label: "Media Library", href: `${BASE}/system/media`, icon: ImageIcon, isNew: true },
      { label: "Activity Log", href: `${BASE}/system/activity`, icon: ScrollText, roles: ["owner", "manager"], isNew: true },
      { label: "Notifications", href: `${BASE}/system/notifications`, icon: Bell, isNew: true },
      { label: "Backups", href: `${BASE}/system/backups`, icon: DatabaseBackup, roles: ["owner"], isNew: true },
    ],
  },
];

/** Role gating — keep only items the role may see (recurses into children). */
export function filterByRole(groups: NavGroup[], role: Role): NavGroup[] {
  const allow = (item: NavItem): boolean => !item.roles || item.roles.includes(role);
  return groups
    .map((g) => ({
      ...g,
      items: g.items
        .filter(allow)
        .map((it) => (it.children ? { ...it, children: it.children.filter(allow) } : it)),
    }))
    .filter((g) => g.items.length > 0);
}

export type FlatNavItem = { label: string; href: string; icon: LucideIcon; group: string; badgeKey?: BadgeKey };

/** Flatten the tree to leaf items (those with an href) — used by the command palette + breadcrumbs. */
export function flattenNav(groups: NavGroup[] = navGroups): FlatNavItem[] {
  const out: FlatNavItem[] = [];
  for (const g of groups) {
    for (const it of g.items) {
      if (it.href) out.push({ label: it.label, href: it.href, icon: it.icon, group: g.heading, badgeKey: it.badgeKey });
      if (it.children) {
        for (const c of it.children) {
          if (c.href) out.push({ label: `${it.label} · ${c.label}`, href: c.href, icon: c.icon, group: g.heading });
        }
      }
    }
  }
  return out;
}

/** Resolve a pathname to its nav entry (for titles / breadcrumbs / placeholders). */
export function findNavByHref(pathname: string): FlatNavItem | undefined {
  const flat = flattenNav();
  return (
    flat.find((f) => f.href === pathname) ??
    flat
      .filter((f) => f.href !== BASE && pathname.startsWith(f.href + "/"))
      .sort((a, b) => b.href.length - a.href.length)[0]
  );
}
