"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Users,
  Shield,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  ExternalLink,
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  Menu,
  X,
  Clock,
  MessageCircle,
  XCircle,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role: string;
  status: string;
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean | string;
}

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  original_price?: number;
  sizes: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: string;
  created_at?: string;
}

interface OrderItem {
  id: string;
  user_id: string;
  user_name?: string;
  product_id: string;
  product_title: string;
  product_thumbnail: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  notes?: string;
  status: string;
  rejection_reason?: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "catalog" | "users" | "roles" | "security">("orders");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<{ id: string; name: string; email: string } | null>(null);

  // UI / Status states
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search queries
  const [productSearch, setProductSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Rejection modal
  const [rejectModalOrder, setRejectModalOrder] = useState<OrderItem | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    category: "Running & Sport",
    price: "",
    original_price: "",
    sizes: "39,40,41,42,43,44",
    excerpt: "",
    content: "",
    thumbnail_path: "/images/hero-shoe.jpg",
    status: "published",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    description: "",
    permissions: "view",
  });

  // Security / Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Fetch initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Check me
      const meRes = await fetch("/api/auth/me");
      if (!meRes.ok) {
        router.push("/login");
        return;
      }
      const meData = await meRes.json();
      setCurrentAdmin(meData.user);

      // 2. Fetch Catalog
      const catRes = await fetch("/api/catalog");
      if (catRes.ok) {
        const catData = await catRes.json();
        setProducts(catData.data || []);
      }

      // 3. Fetch Users
      const userRes = await fetch("/api/users");
      if (userRes.ok) {
        const uData = await userRes.json();
        setUsers(uData.data || []);
      }

      // 4. Fetch Roles
      const roleRes = await fetch("/api/roles");
      if (roleRes.ok) {
        const rData = await roleRes.json();
        setRoles(rData.data || []);
      }

      // 5. Fetch Orders (Step 3)
      const ordRes = await fetch("/api/orders");
      if (ordRes.ok) {
        const oData = await ordRes.json();
        setOrders(oData.data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Gagal memuat data dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------------------------------------------------------------
  // Order Handlers (Step 3)
  // -------------------------------------------------------------
  const handleConfirmOrder = async (orderId: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "dikonfirmasi" }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", `Pembayaran pesanan ${orderId} berhasil dikonfirmasi!`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "dikonfirmasi" } : o))
        );
      } else {
        showNotification("error", data.error || "Gagal mengonfirmasi pesanan.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleOpenRejectModal = (order: OrderItem) => {
    setRejectModalOrder(order);
    setRejectReasonInput("Pembayaran belum diterima / nominal tidak sesuai.");
  };

  const handleConfirmRejectOrder = async () => {
    if (!rejectModalOrder) return;
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rejectModalOrder.id,
          status: "dibatalkan",
          rejection_reason: rejectReasonInput,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", `Pesanan ${rejectModalOrder.id} dibatalkan.`);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === rejectModalOrder.id
              ? { ...o, status: "dibatalkan", rejection_reason: rejectReasonInput }
              : o
          )
        );
        setRejectModalOrder(null);
      } else {
        showNotification("error", data.error || "Gagal membatalkan pesanan.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  // -------------------------------------------------------------
  // Product Handlers
  // -------------------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: "",
      category: "Running & Sport",
      price: "",
      original_price: "",
      sizes: "39,40,41,42,43,44",
      excerpt: "",
      content: "",
      thumbnail_path: "/images/hero-shoe.jpg",
      status: "published",
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: ProductItem) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      category: prod.category || "Running & Sport",
      price: String(prod.price),
      original_price: prod.original_price ? String(prod.original_price) : "",
      sizes: prod.sizes || "39,40,41,42,43,44",
      excerpt: prod.excerpt || "",
      content: prod.content || "",
      thumbnail_path: prod.thumbnail_path || "/images/hero-shoe.jpg",
      status: prod.status || "published",
    });
    setIsProductModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification("error", data.error || "Gagal mengunggah gambar.");
      } else {
        setProductForm((prev) => ({ ...prev, thumbnail_path: data.urlPath }));
        showNotification("success", "Gambar produk berhasil diunggah!");
      }
    } catch {
      showNotification("error", "Gagal menghubungi endpoint upload.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/catalog";
      const method = editingProduct ? "PUT" : "POST";
      const payload = editingProduct
        ? { id: editingProduct.id, ...productForm }
        : productForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showNotification("error", data.error || "Gagal menyimpan produk.");
      } else {
        showNotification("success", editingProduct ? "Produk diperbarui!" : "Produk baru ditambahkan!");
        setIsProductModalOpen(false);
        loadData();
      }
    } catch {
      showNotification("error", "Terjadi kesalahan koneksi.");
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk "${title}"?`)) return;

    try {
      const res = await fetch(`/api/catalog?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showNotification("success", `Produk "${title}" berhasil dihapus.`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json();
        showNotification("error", data.error || "Gagal menghapus produk.");
      }
    } catch {
      showNotification("error", "Gagal menghubungi server.");
    }
  };

  // -------------------------------------------------------------
  // User Handlers
  // -------------------------------------------------------------
  const handleUpdateUserStatus = async (user: UserItem, newStatus: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", `Status pengguna ${user.name} diubah menjadi ${newStatus}.`);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      } else {
        showNotification("error", data.error || "Gagal mengubah status user.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleUpdateUserRole = async (user: UserItem, newRoleId: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role_id: newRoleId }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", `Role pengguna ${user.name} berhasil diperbarui.`);
        loadData();
      } else {
        showNotification("error", data.error || "Gagal memperbarui role.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`Hapus pengguna ${user.name} (${user.email})?`)) return;

    try {
      const res = await fetch(`/api/users?id=${encodeURIComponent(user.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", "Pengguna berhasil dihapus.");
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        showNotification("error", data.error || "Gagal menghapus pengguna.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  // -------------------------------------------------------------
  // Role Handlers
  // -------------------------------------------------------------
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoleForm),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", "Role baru berhasil dibuat.");
        setIsRoleModalOpen(false);
        setNewRoleForm({ name: "", description: "", permissions: "view" });
        loadData();
      } else {
        showNotification("error", data.error || "Gagal membuat role.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  const handleDeleteRole = async (role: RoleItem) => {
    if (!confirm(`Hapus role "${role.name}"?`)) return;

    try {
      const res = await fetch(`/api/roles?id=${encodeURIComponent(role.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", "Role berhasil dihapus.");
        setRoles((prev) => prev.filter((r) => r.id !== role.id));
      } else {
        showNotification("error", data.error || "Gagal menghapus role.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    }
  };

  // -------------------------------------------------------------
  // Security Handlers (Change Admin Password - Section 2.4)
  // -------------------------------------------------------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("error", "Konfirmasi password baru tidak cocok.");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("success", "Password berhasil diubah!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showNotification("error", data.error || "Gagal mengubah password.");
      }
    } catch {
      showNotification("error", "Koneksi gagal.");
    } finally {
      setChangingPassword(false);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Filtered queries
  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchStatus =
      orderStatusFilter === "all" || o.status === orderStatusFilter;
    const matchSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.product_title.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.recipient_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.recipient_phone.includes(orderSearch);
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-slide-up ${
            notification.type === "success"
              ? "bg-emerald-900 text-white border-emerald-700"
              : "bg-red-900 text-white border-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Navbar Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-white px-2.5 py-1 rounded-lg">
                <div className="relative w-28 h-6">
                  <Image
                    src={siteConfig.logo.path}
                    alt={siteConfig.logo.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded-md">
                Admin Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">
                {currentAdmin?.name || "Administrator"}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {currentAdmin?.email || "admin@gmail.com"}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Keluar dari Akun"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Sidebar Nav */}
        <aside
          className={`w-64 shrink-0 fixed lg:static inset-y-16 left-0 z-30 bg-white lg:bg-transparent p-6 lg:p-0 shadow-2xl lg:shadow-none transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-2">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama
            </div>

            <button
              onClick={() => {
                setActiveTab("orders");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "orders"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Pesanan Masuk</span>
              </div>
              {orders.filter((o) => o.status === "menunggu_konfirmasi").length > 0 ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-600 text-white animate-pulse">
                  {orders.filter((o) => o.status === "menunggu_konfirmasi").length}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("catalog");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "catalog"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
                <span>Manajemen Produk</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("users");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "users"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-500" />
                <span>Manajemen User</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("roles");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "roles"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-purple-500" />
                <span>Manajemen Role</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {roles.length}
              </span>
            </button>

            <div className="pt-4 border-t border-slate-100">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Keamanan & Akun
              </div>
              <button
                onClick={() => {
                  setActiveTab("security");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === "security"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Ganti Password Admin</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-600">
                Memuat data dari database spreadsheet...
              </p>
            </div>
          ) : (
            <>
              {/* ======================================================== */}
              {/* TAB 0: MANAJEMEN PESANAN (STEP 3) */}
              {/* ======================================================== */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  {/* Top Bar */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span>Tiket Pesanan Masuk (QRIS)</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          Total {orders.length}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Verifikasi pembayaran transfer QRIS pelanggan, konfirmasi pengiriman, atau hubungi via WhatsApp.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      {/* Search */}
                      <div className="relative w-full sm:w-60">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari ID, penerima, sepatu..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      {/* Status Filter */}
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="w-full sm:w-auto border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 font-semibold text-slate-700 focus:bg-white"
                      >
                        <option value="all">Semua Status</option>
                        <option value="menunggu_konfirmasi">Menunggu Konfirmasi</option>
                        <option value="dikonfirmasi">Dikonfirmasi</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders List */}
                  {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
                      <Clock className="w-10 h-10 text-slate-300 mx-auto" />
                      <h3 className="text-base font-bold text-slate-800">
                        Tidak ada tiket pesanan yang cocok
                      </h3>
                      <p className="text-xs text-slate-400">
                        Belum ada pesanan masuk dengan kriteria pencarian ini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((ord) => {
                        const isWaiting = ord.status === "menunggu_konfirmasi";
                        const isConfirmed = ord.status === "dikonfirmasi";
                        const isCancelled = ord.status === "dibatalkan";
                        const waLink = `https://wa.me/${ord.recipient_phone.replace(
                          /\D/g,
                          ""
                        )}?text=${encodeURIComponent(
                          `Halo ${ord.recipient_name}, saya admin Myers mengenai pesanan tiket ${ord.id} (${ord.product_title} EU ${ord.size}).`
                        )}`;

                        return (
                          <div
                            key={ord.id}
                            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                                  {ord.id}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Pemesan: <strong>{ord.user_name || ord.recipient_name}</strong>
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {isWaiting && (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                                    Menunggu Konfirmasi
                                  </span>
                                )}
                                {isConfirmed && (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                    Dikonfirmasi
                                  </span>
                                )}
                                {isCancelled && (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
                                    Dibatalkan
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                              {/* Product Info (5 cols) */}
                              <div className="md:col-span-5 flex items-center gap-3.5">
                                <div className="relative w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                  <Image
                                    src={ord.product_thumbnail || "/images/hero-shoe.jpg"}
                                    alt={ord.product_title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-900">
                                    {ord.product_title}
                                  </h4>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    Ukuran: <strong>EU {ord.size}</strong> | Qty:{" "}
                                    <strong>{ord.quantity} pasang</strong>
                                  </div>
                                  <div className="text-xs font-bold text-orange-600 mt-0.5">
                                    Total: {formatRupiah(ord.total_price)}
                                  </div>
                                </div>
                              </div>

                              {/* Shipping Info (4 cols) */}
                              <div className="md:col-span-4 text-xs space-y-1 text-slate-600 border-l border-slate-100 pl-4">
                                <div>
                                  Penerima: <strong className="text-slate-900">{ord.recipient_name}</strong>
                                </div>
                                <div className="font-mono text-slate-700">
                                  WA: {ord.recipient_phone}
                                </div>
                                <div className="line-clamp-2 text-slate-500 text-[11px]">
                                  Alamat: {ord.shipping_address}
                                </div>
                                {ord.notes && (
                                  <div className="text-[11px] text-amber-700 italic">
                                    Catatan: &ldquo;{ord.notes}&rdquo;
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons (3 cols) */}
                              <div className="md:col-span-3 flex flex-col gap-2">
                                {isWaiting && (
                                  <>
                                    <button
                                      onClick={() => handleConfirmOrder(ord.id)}
                                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Konfirmasi Bayar</span>
                                    </button>

                                    <button
                                      onClick={() => handleOpenRejectModal(ord)}
                                      className="w-full py-1.5 px-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors"
                                    >
                                      Tolak / Batalkan
                                    </button>
                                  </>
                                )}

                                {/* Shortcut WA ke Pembeli (Section 3.3 Rule 7) */}
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Hubungi via WA</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 1: MANAJEMEN PRODUK (KATALOG) */}
              {/* ======================================================== */}
              {activeTab === "catalog" && (
                <div className="space-y-6">
                  {/* Top Action Bar */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Katalog Produk Sepatu
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelola item katalog yang tampil pada landing page toko Myers.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-60">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari produk..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <button
                        onClick={handleOpenAddProduct}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Sepatu</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Table */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                          <tr>
                            <th className="py-4 px-6">Foto</th>
                            <th className="py-4 px-6">Nama & Kategori</th>
                            <th className="py-4 px-6">Harga</th>
                            <th className="py-4 px-6">Ukuran EU</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProducts.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-12 text-slate-400">
                                Belum ada data produk sepatu yang cocok.
                              </td>
                            </tr>
                          ) : (
                            filteredProducts.map((prod) => (
                              <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3 px-6">
                                  <div className="relative w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                                    <Image
                                      src={prod.thumbnail_path || "/images/hero-shoe.jpg"}
                                      alt={prod.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </td>
                                <td className="py-3 px-6">
                                  <div className="font-bold text-slate-900 text-sm">
                                    {prod.title}
                                  </div>
                                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                                    {prod.category}
                                  </span>
                                </td>
                                <td className="py-3 px-6 font-bold text-slate-900">
                                  {formatRupiah(prod.price)}
                                </td>
                                <td className="py-3 px-6 text-slate-600">
                                  {prod.sizes || "39 - 44"}
                                </td>
                                <td className="py-3 px-6">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                      prod.status === "published"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-slate-100 text-slate-700"
                                    }`}
                                  >
                                    {prod.status}
                                  </span>
                                </td>
                                <td className="py-3 px-6 text-right space-x-2">
                                  <button
                                    onClick={() => handleOpenEditProduct(prod)}
                                    className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Edit Produk"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id, prod.title)}
                                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus Produk"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: MANAJEMEN USER */}
              {/* ======================================================== */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Manajemen Pengguna
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelola akun terdaftar, ubah role hak akses, dan atur status aktif akun.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cari user berdasarkan nama/email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                          <tr>
                            <th className="py-4 px-6">Nama Pengguna</th>
                            <th className="py-4 px-6">Email</th>
                            <th className="py-4 px-6">Role Akses</th>
                            <th className="py-4 px-6">Status Akun</th>
                            <th className="py-4 px-6 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center py-12 text-slate-400">
                                Tidak ada data pengguna.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((u) => {
                              const isSelf = String(u.id) === String(currentAdmin?.id);
                              return (
                                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                                    {u.name}
                                    {isSelf && (
                                      <span className="ml-2 px-2 py-0.5 text-[10px] bg-orange-100 text-orange-700 rounded-full font-bold">
                                        Anda
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-6 text-slate-600 font-mono">
                                    {u.email}
                                  </td>
                                  <td className="py-4 px-6">
                                    {isSelf ? (
                                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                                        {u.role}
                                      </span>
                                    ) : (
                                      <select
                                        value={u.role_id}
                                        onChange={(e) => handleUpdateUserRole(u, e.target.value)}
                                        className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-slate-50 focus:bg-white font-semibold text-slate-800"
                                      >
                                        <option value="role-user">user (User Biasa)</option>
                                        <option value="role-admin">admin (Administrator)</option>
                                        {roles
                                          .filter((r) => r.id !== "role-admin" && r.id !== "role-user")
                                          .map((r) => (
                                            <option key={r.id} value={r.id}>
                                              {r.name}
                                            </option>
                                          ))}
                                      </select>
                                    )}
                                  </td>
                                  <td className="py-4 px-6">
                                    {isSelf ? (
                                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                        {u.status}
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          handleUpdateUserStatus(
                                            u,
                                            u.status === "active" ? "inactive" : "active"
                                          )
                                        }
                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                          u.status === "active"
                                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                            : "bg-red-100 text-red-800 hover:bg-red-200"
                                        }`}
                                      >
                                        {u.status}
                                      </button>
                                    )}
                                  </td>
                                  <td className="py-4 px-6 text-right">
                                    {!isSelf && (
                                      <button
                                        onClick={() => handleDeleteUser(u)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus User"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: MANAJEMEN ROLE */}
              {/* ======================================================== */}
              {activeTab === "roles" && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Manajemen Role & Hak Akses
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Role sistem bawaan (admin & user) diproteksi otomatis agar sistem selalu aman.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsRoleModalOpen(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Role Baru</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((r) => {
                      const isSystem = r.is_system === true || r.is_system === "true";
                      return (
                        <div
                          key={r.id}
                          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold text-slate-900 capitalize">
                                {r.name}
                              </h3>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isSystem
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-orange-100 text-orange-700 border border-orange-200"
                                }`}
                              >
                                {isSystem ? "Role Sistem" : "Kustom"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {r.description || "Tidak ada deskripsi."}
                            </p>
                            <div className="pt-2 text-xs font-semibold text-slate-700">
                              Permission: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{r.permissions}</code>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                              ID: {r.id}
                            </span>
                            {!isSystem && (
                              <button
                                onClick={() => handleDeleteRole(r)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Role"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: KEAMANAN & GANTI PASSWORD ADMIN (Section 2.4) */}
              {/* ======================================================== */}
              {activeTab === "security" && (
                <div className="max-w-2xl space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        Ganti Password Administrator
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        PENTING: Akun admin awal menggunakan password bawaan publik (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">123456</code>). Sangat disarankan mengganti password ini demi keamanan sebelum website dirilis ke publik.
                      </p>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Password Saat Ini
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Masukkan password saat ini (cth: 123456)"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Password Baru (Minimal 6 Karakter)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Masukkan password baru yang kuat"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Ketik ulang password baru"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>{changingPassword ? "Menyimpan..." : "Perbarui Password Admin"}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: FORM PRODUK (TAMBAH / EDIT) */}
      {/* ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 my-8">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? "Edit Sepatu Produk" : "Tambah Produk Sepatu Baru"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Produk Sepatu <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Myers CloudStryde Ultra"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori <span className="text-orange-600">*</span>
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Running & Sport">Running & Sport</option>
                    <option value="Casual & Streetwear">Casual & Streetwear</option>
                    <option value="Formal & Leather">Formal & Leather</option>
                    <option value="Daily Comfort">Daily Comfort</option>
                    <option value="Outdoor & Trail">Outdoor & Trail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Produk
                  </label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="published">Published (Tampil)</option>
                    <option value="draft">Draft (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Harga (IDR) <span className="text-orange-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="899000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Harga Coret Asli (Opsional)
                  </label>
                  <input
                    type="number"
                    placeholder="1199000"
                    value={productForm.original_price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, original_price: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ukuran Tersedia (Pisahkan koma)
                </label>
                <input
                  type="text"
                  placeholder="39,40,41,42,43,44"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi singkat keunggulan sepatu..."
                  value={productForm.excerpt}
                  onChange={(e) => setProductForm({ ...productForm, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Upload Foto Thumbnail */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Foto Thumbnail Produk
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden shrink-0">
                    <Image
                      src={productForm.thumbnail_path || "/images/hero-shoe.jpg"}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors">
                      <Upload className="w-4 h-4 text-orange-600" />
                      <span>{uploadingImage ? "Mengunggah..." : "Unggah Foto Baru"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Maksimal 5MB (JPG, PNG, atau WEBP). Tersimpan di folder lokal `public/uploads/`.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  {editingProduct ? "Simpan Perubahan" : "Tambahkan ke Katalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TAMBAH ROLE BARU */}
      {/* ======================================================== */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Tambah Role Baru</h3>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRole} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Role <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: manager, staff, editor"
                  value={newRoleForm.name}
                  onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Tanggung Jawab
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Mengelola stok produk harian"
                  value={newRoleForm.description}
                  onChange={(e) =>
                    setNewRoleForm({ ...newRoleForm, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tingkat Permission
                </label>
                <select
                  value={newRoleForm.permissions}
                  onChange={(e) =>
                    setNewRoleForm({ ...newRoleForm, permissions: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="view">View Only (Hanya Membaca)</option>
                  <option value="edit">Editor (Membaca & Mengubah Produk)</option>
                  <option value="all">Full Access (Akses Penuh)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TOLAK / BATALKAN PESANAN */}
      {/* ======================================================== */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>Batalkan Tiket Pesanan</span>
              </h3>
              <button
                onClick={() => setRejectModalOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Anda akan membatalkan pesanan tiket{" "}
              <strong className="font-mono text-slate-900">{rejectModalOrder.id}</strong> atas nama{" "}
              <strong>{rejectModalOrder.recipient_name}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Alasan Pembatalan
              </label>
              <textarea
                rows={3}
                required
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                placeholder="Contoh: Bukti transfer tidak valid / stok ukuran habis..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectOrder}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Konfirmasi Pembatalan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
