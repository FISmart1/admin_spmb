"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { LoadingScreen } from "@/components/loading-screen";

export default function LoginPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
      setTimeout(() => {
        const token = localStorage.getItem("admin_token");
  
        if (token) {
          router.replace("/dashboard"); 
          return;
        }
  
      }, 30);
    }, []); // ← FIX

  return (
    <>
      {/* 🔹 LOADING SCREEN */}
      <AnimatePresence>
        {!showLogin && <LoadingScreen onComplete={() => setShowLogin(true)} />}
      </AnimatePresence>

      {/* 🔹 LOGIN PAGE */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            key="login-form-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1E2B61] to-[#142B6D] p-6"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="w-full max-w-5xl"
            >
              <LoginForm />
            </motion.div>

            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p className="text-xs text-white/70 font-poppins">
                © 2026 SMK TI Bazma. Semua hak dilindungi.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
