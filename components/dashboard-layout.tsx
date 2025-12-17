"use client";

import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Table, Megaphone, GraduationCap, Menu, X } from "lucide-react";
import { AnimatedButton } from "@/components/animated-button";
import { SMKLogo } from "@/components/smk-logo";
import Image from "next/image";
import { gsap } from "gsap";
import LogoAdmin from "@/public/logo-admin.png";
import { useEffect } from "react";


const menuItems = [
  { id: "dashboard", name: "Dashboard", icon: Home, url: "/dashboard" },
  { id: "table-data", name: "Table data", icon: Table, url: "/table-data" },
  { id: "data-akhir", name: "Data Akhir", icon: Megaphone, url: "/data-akhir" },
  { id: "data-siswa", name: "Data Siswa", icon: GraduationCap, url: "/data-siswa" },
];






export function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      setTimeout(() => {
        const token = localStorage.getItem("admin_token");
  
        if (!token) {
          router.replace("/"); 
          return;
        }
  
      }, 30);
    }, []); // ← FIX

  useEffect(() => {
    const listener = () => setSidebarOpen((prev) => !prev);
    document.addEventListener("toggle-sidebar", listener);
    return () => document.removeEventListener("toggle-sidebar", listener);
  }, []);

  const openConfirm = () => {
    setShowConfirm(true);
    setTimeout(() => {
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { y: 100, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }, 10);
  };

  const closeConfirm = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => setShowConfirm(false),
      });
    } else {
      setShowConfirm(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_username");
    gsap.to(".sidebar", {
      x: -100,
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        router.push("/"); // arahkan ke halaman login utama
      },
    });
  };

  return (
    <>


      {/* Sidebar */}
      <div
        className={`sidebar fixed md:static top-0 left-0 h-full z-40 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        w-72 bg-[#1E3A8A] text-white flex flex-col rounded-r-3xl md:rounded-r-3xl`}
      >
        {/* Profil Admin */}
        <div className="p-8 pb-6">
          <div className="flex items-center space-x-4 mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{
                backgroundImage: `url(${LogoAdmin.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div>
              <h3 className="text-lg font-semibold font-inter text-white">Admin</h3>
              <p className="text-sm text-blue-200 font-poppins">admin@ppdb.com</p>
            </div>
          </div>
          <div className="w-full h-px bg-blue-600/30"></div>
        </div>

        {/* Menu Navigasi */}
        <div className="flex-1 px-6 overflow-y-auto">
          {menuItems.map((item, i) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.id}
                href={item.url}
                onClick={() => setSidebarOpen(false)}
                className={i !== menuItems.length - 1 ? "block mb-4" : "block"}
              >
                <AnimatedButton
                  variant="ghost"
                  className={`w-full justify-start text-left font-poppins py-4 px-6 transition-all duration-300 ${isActive
                    ? "bg-white text-[#1E3A8A] rounded-full shadow-md"
                    : "text-white hover:bg-white/10 rounded-full"
                    }`}
                >
                  <item.icon className="mr-4 h-5 w-5" />
                  {item.name}
                </AnimatedButton>
              </Link>
            );
          })}
        </div>

        {/* Footer Sidebar */}
        <div className="p-6 pt-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <SMKLogo warna="#ffffffff" className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold font-inter text-white">SMK TI BAZMA</h4>
              <p className="text-xs text-blue-200 font-poppins">Islamic Boarding School</p>
            </div>
          </div>

          <button
            className="w-full justify-center bg-white text-[#1E3A8A] hover:bg-gray-400 font-poppins rounded-2xl py-3 font-medium shadow-md"
            onClick={openConfirm}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay (klik luar sidebar untuk menutup di mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}

      {/* Popup Konfirmasi Logout (versi tengah layar) */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[100] px-4">
          <div
            ref={modalRef}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[200px] p-8 text-center relative"
          >
            {/* Logo SMK */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-lg">
              <SMKLogo warna="#1E3A8A" className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">
              Konfirmasi Logout
            </h3>
            <p className="text-gray-500 mb-6 font-poppins">
              Yakin ingin keluar dari dashboard?
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-[#1E3A8A] text-white px-6 py-2 rounded-xl hover:bg-[#162B6A] transition-all font-poppins shadow-md"
              >
                Ya, Keluar
              </button>
              <button
                onClick={closeConfirm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-all font-poppins"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}