import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <Sidebar active="dashboard" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
