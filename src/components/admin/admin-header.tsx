import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="md:hidden bg-gray-800 text-white p-4 fixed top-0 w-full z-40 flex items-center">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-gray-700"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Buka menu</span>
      </button>
      <h2 className="text-xl font-semibold ml-4">Admin Desa</h2>
    </header>
  );
}
