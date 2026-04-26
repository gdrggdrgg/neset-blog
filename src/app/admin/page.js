"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

export default function Admin() {
  const [giris, setGiris] = useState(false);
  const [kadi, setKadi] = useState("");
  const [sifre, setSifre] = useState("");
  const [yorumlar, setYorumlar] = useState([]);

  async function getir() {
    const q = query(collection(db, "yorumlar"), orderBy("tarih", "desc"));
    const snap = await getDocs(q);
    setYorumlar(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function sil(id) {
    await deleteDoc(doc(db, "yorumlar", id));
    getir();
  }

  function kontrol() {
    if (kadi === "admin" && sifre === "wvrccxr4e43tt") {
      setGiris(true);
      getir();
    } else {
      alert("Bilgiler yanlış");
    }
  }

  if (!giris) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white p-6">
        <div className="w-full max-w-md bg-[#181818] p-8 rounded-3xl">
          <h1 className="text-3xl font-bold text-yellow-400">Admin Giriş</h1>

          <input
            placeholder="Kullanıcı Adı"
            className="mt-6 w-full p-4 rounded-xl bg-black"
            onChange={(e) => setKadi(e.target.value)}
          />

          <input
            type="password"
            placeholder="Şifre"
            className="mt-4 w-full p-4 rounded-xl bg-black"
            onChange={(e) => setSifre(e.target.value)}
          />

          <button
            onClick={kontrol}
            className="mt-6 w-full bg-yellow-500 text-black font-bold py-3 rounded-xl"
          >
            Giriş Yap
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400">Admin Panel</h1>

      <div className="mt-8 space-y-4">
        {yorumlar.map((item) => (
          <div
            key={item.id}
            className="bg-[#181818] p-5 rounded-2xl border border-yellow-600/20"
          >
            <p className="text-yellow-400">{item.kullaniciAdi}</p>
            <p className="mt-2">{item.yorum}</p>

            <button
              onClick={() => sil(item.id)}
              className="mt-4 bg-red-600 px-5 py-2 rounded-xl font-bold"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}