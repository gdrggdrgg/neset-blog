"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

export default function AdminPanel() {
  const [giris, setGiris] = useState(false);
  const [kadi, setKadi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");

  const [yorumlar, setYorumlar] = useState([]);
  const [kullanicilar, setKullanicilar] = useState([]);
  const [arama, setArama] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlenenYorum, setDuzenlenenYorum] = useState("");

  async function yorumlariGetir() {
    const q = query(collection(db, "yorumlar"), orderBy("tarih", "desc"));
    const snap = await getDocs(q);
    setYorumlar(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function kullanicilariGetir() {
    const snap = await getDocs(collection(db, "kullanicilar"));
    setKullanicilar(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  function adminGiris() {
    setHata("");

    if (kadi === "admin" && sifre === "wvrccxr4e43tt") {
      setGiris(true);
      yorumlariGetir();
      kullanicilariGetir();
    } else {
      setHata("Kullanıcı adı veya şifre hatalı.");
    }
  }

  function adminCikis() {
    setGiris(false);
    setKadi("");
    setSifre("");
  }

  async function yorumSil(id) {
    const onay = confirm("Bu yorumu silmek istediğinize emin misiniz?");
    if (!onay) return;

    await deleteDoc(doc(db, "yorumlar", id));
    yorumlariGetir();
  }

  function duzenleBaslat(item) {
    setDuzenlenenId(item.id);
    setDuzenlenenYorum(item.yorum);
  }

  async function yorumGuncelle(id) {
    if (!duzenlenenYorum.trim()) return;

    await updateDoc(doc(db, "yorumlar", id), {
      yorum: duzenlenenYorum
    });

    setDuzenlenenId(null);
    setDuzenlenenYorum("");
    yorumlariGetir();
  }

  const filtreliYorumlar = yorumlar.filter((item) => {
    const kullanici = item.kullaniciAdi || item.email || "";
    const metin = item.yorum || "";
    return (
      kullanici.toLowerCase().includes(arama.toLowerCase()) ||
      metin.toLowerCase().includes(arama.toLowerCase())
    );
  });

  if (!giris) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-[#1a1208] to-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-yellow-600/20 bg-[#181818] p-8 shadow-2xl">
          <Link href="/" className="text-sm text-gray-400 hover:text-yellow-400">
            ← Ana Sayfaya Dön
          </Link>

          <h1 className="mt-5 text-4xl font-bold text-yellow-400">
            Admin Panel
          </h1>

          <p className="mt-3 text-gray-300">
            Site yorumlarını ve kullanıcı mesajlarını yönetmek için giriş yap.
          </p>

          <input
            placeholder="Admin kullanıcı adı"
            className="mt-8 w-full rounded-xl border border-yellow-600/20 bg-black p-4 text-white placeholder-gray-400"
            onChange={(e) => setKadi(e.target.value)}
          />

          <input
            type="password"
            placeholder="Admin şifre"
            className="mt-4 w-full rounded-xl border border-yellow-600/20 bg-black p-4 text-white placeholder-gray-400"
            onChange={(e) => setSifre(e.target.value)}
          />

          {hata && (
            <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-red-300">
              {hata}
            </div>
          )}

          <button
            onClick={adminGiris}
            className="mt-6 w-full rounded-xl bg-yellow-500 py-3 font-bold text-black hover:bg-yellow-400"
          >
            Giriş Yap
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] via-[#1a1208] to-[#0f0f0f] text-white p-6">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-4 rounded-3xl border border-yellow-600/20 bg-[#181818] p-6 shadow-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400">
              Admin Yönetim Paneli
            </h1>
            <p className="mt-2 text-gray-300">
              Yorumları ve kayıtlı kullanıcıları yönet.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl border border-yellow-600/30 px-5 py-3 text-yellow-300 hover:bg-yellow-500/10"
            >
              Ana Sayfa
            </Link>

            <button
              onClick={adminCikis}
              className="rounded-xl bg-red-600 px-5 py-3 font-bold hover:bg-red-700"
            >
              Çıkış
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-yellow-600/20 bg-[#181818] p-6">
            <p className="text-gray-400">Toplam Yorum</p>
            <h2 className="mt-2 text-4xl font-bold text-yellow-400">
              {yorumlar.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-600/20 bg-[#181818] p-6">
            <p className="text-gray-400">Kayıtlı Kullanıcı</p>
            <h2 className="mt-2 text-4xl font-bold text-yellow-400">
              {kullanicilar.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-600/20 bg-[#181818] p-6">
            <p className="text-gray-400">Filtrelenen Sonuç</p>
            <h2 className="mt-2 text-4xl font-bold text-yellow-400">
              {filtreliYorumlar.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-yellow-600/20 bg-[#181818] p-6">
            <p className="text-gray-400">Panel Durumu</p>
            <h2 className="mt-2 text-2xl font-bold text-green-400">
              Aktif
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-yellow-600/20 bg-[#181818] p-6">
          <h2 className="text-2xl font-bold text-yellow-400">
            Kayıtlı Kullanıcılar
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {kullanicilar.map((kisi) => (
              <div
                key={kisi.id}
                className="rounded-2xl border border-yellow-600/10 bg-black/50 p-4"
              >
                <p className="text-lg font-bold text-yellow-400">
                  {kisi.kullaniciAdi}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {kisi.email}
                </p>
              </div>
            ))}

            {kullanicilar.length === 0 && (
              <p className="text-gray-400">
                Henüz kayıtlı kullanıcı görünmüyor. Bundan sonra kayıt olanlar burada listelenecek.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-yellow-600/20 bg-[#181818] p-6">
          <input
            placeholder="Kullanıcı adı veya yorum içinde ara..."
            className="w-full rounded-xl border border-yellow-600/20 bg-black p-4 text-white placeholder-gray-400"
            onChange={(e) => setArama(e.target.value)}
          />
        </div>

        <div className="mt-8 space-y-5">
          {filtreliYorumlar.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-yellow-600/20 bg-[#181818] p-6 shadow-xl"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-400">Kullanıcı</p>
                  <p className="text-lg font-bold text-yellow-400">
                    {item.kullaniciAdi || item.email || "Bilinmeyen Kullanıcı"}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => duzenleBaslat(item)}
                    className="rounded-xl bg-yellow-500 px-5 py-2 font-bold text-black hover:bg-yellow-400"
                  >
                    Düzenle
                  </button>

                  <button
                    onClick={() => yorumSil(item.id)}
                    className="rounded-xl bg-red-600 px-5 py-2 font-bold hover:bg-red-700"
                  >
                    Sil
                  </button>
                </div>
              </div>

              {duzenlenenId === item.id ? (
                <div className="mt-5">
                  <textarea
                    value={duzenlenenYorum}
                    onChange={(e) => setDuzenlenenYorum(e.target.value)}
                    className="h-32 w-full rounded-xl border border-yellow-600/20 bg-black p-4 text-white"
                  />

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => yorumGuncelle(item.id)}
                      className="rounded-xl bg-green-600 px-5 py-2 font-bold hover:bg-green-700"
                    >
                      Kaydet
                    </button>

                    <button
                      onClick={() => {
                        setDuzenlenenId(null);
                        setDuzenlenenYorum("");
                      }}
                      className="rounded-xl border border-gray-600 px-5 py-2 text-gray-300 hover:bg-black"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-5 rounded-2xl bg-black/50 p-5 leading-7 text-gray-300">
                  {item.yorum}
                </p>
              )}
            </div>
          ))}

          {filtreliYorumlar.length === 0 && (
            <div className="rounded-3xl border border-yellow-600/20 bg-[#181818] p-8 text-center text-gray-400">
              Gösterilecek yorum bulunamadı.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}