"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

export default function Giris() {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [basarili, setBasarili] = useState("");

  function kullaniciAdiToEmail(ad) {
    return `${ad.toLowerCase().trim()}@neset.local`;
  }

  function hataMesaji(errorCode) {
    if (errorCode.includes("missing-password")) return "Lütfen şifre giriniz.";
    if (errorCode.includes("missing-email")) return "Lütfen kullanıcı adı giriniz.";
    if (errorCode.includes("weak-password")) return "Şifre en az 6 karakter olmalıdır.";
    if (errorCode.includes("email-already-in-use")) return "Bu kullanıcı adı zaten alınmış.";
    if (errorCode.includes("invalid-credential")) return "Kullanıcı adı veya şifre hatalı.";
    return "Bir hata oluştu. Bilgileri kontrol edin.";
  }

  async function kayitOl() {
    setHata("");
    setBasarili("");

    if (!kullaniciAdi.trim()) {
      setHata("Lütfen kullanıcı adı giriniz.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        kullaniciAdiToEmail(kullaniciAdi),
        sifre
      );

      localStorage.setItem("kullaniciAdi", kullaniciAdi.trim());

      setBasarili("Kayıt başarılı. Ana sayfaya yönlendiriliyorsunuz...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err) {
      setHata(hataMesaji(err.code));
    }
  }

  async function girisYap() {
    setHata("");
    setBasarili("");

    if (!kullaniciAdi.trim()) {
      setHata("Lütfen kullanıcı adı giriniz.");
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        kullaniciAdiToEmail(kullaniciAdi),
        sifre
      );

      localStorage.setItem("kullaniciAdi", kullaniciAdi.trim());

      setBasarili("Giriş başarılı. Ana sayfaya yönlendiriliyorsunuz...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err) {
      setHata(hataMesaji(err.code));
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#1a1208] to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-yellow-600/20 bg-[#181818] p-10 shadow-2xl">

        <Link href="/" className="text-sm text-gray-400 hover:text-yellow-400">
          ← Ana Sayfaya Dön
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-yellow-400">
          Üyelik Girişi
        </h1>

        <p className="mt-3 text-gray-300">
          Yorum yapmak ve paylaşım eklemek için kullanıcı adıyla giriş yapın.
        </p>

        <input
          placeholder="Kullanıcı adı"
          className="mt-8 w-full rounded-xl bg-black border border-yellow-600/20 p-4 text-white placeholder-gray-400"
          onChange={(e) => setKullaniciAdi(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifre"
          className="mt-4 w-full rounded-xl bg-black border border-yellow-600/20 p-4 text-white placeholder-gray-400"
          onChange={(e) => setSifre(e.target.value)}
        />

        {hata && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-red-300">
            {hata}
          </div>
        )}

        {basarili && (
          <div className="mt-4 rounded-xl border border-green-500/40 bg-green-950/40 p-4 text-green-300">
            {basarili}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={kayitOl}
            className="rounded-xl bg-yellow-500 py-3 font-bold text-black hover:bg-yellow-400"
          >
            Kayıt Ol
          </button>

          <button
            onClick={girisYap}
            className="rounded-xl bg-white py-3 font-bold text-black hover:bg-gray-200"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    </main>
  );
}