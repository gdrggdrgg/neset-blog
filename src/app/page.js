"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export default function Home() {
  const [uye, setUye] = useState(null);
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [yorum, setYorum] = useState("");
  const [yorumlar, setYorumlar] = useState([]);
  const [yorumHata, setYorumHata] = useState("");
  const [yorumBasarili, setYorumBasarili] = useState("");
  const [acilis, setAcilis] = useState(true);
  const [gecis, setGecis] = useState(false);

  async function siteyeGir() {
    const ses = new Audio("/baglama.mp3");
    ses.volume = 0.35;
    ses.play().catch(() => {});

    setGecis(true);

    setTimeout(() => {
      setAcilis(false);
    }, 1200);
  }

  async function cikisYap() {
    await signOut(auth);
    localStorage.removeItem("kullaniciAdi");
    setKullaniciAdi("");
  }

  async function yorumlariGetir() {
    const q = query(collection(db, "yorumlar"), orderBy("tarih", "desc"));
    const snapshot = await getDocs(q);
    setYorumlar(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }

  async function yorumEkle() {
    setYorumHata("");
    setYorumBasarili("");

    if (!uye) {
      setYorumHata("Yorum yapmak için önce giriş yapmalısınız.");
      return;
    }

    if (!yorum.trim()) {
      setYorumHata("Lütfen yorum alanını boş bırakmayınız.");
      return;
    }

    const ad =
      kullaniciAdi ||
      localStorage.getItem("kullaniciAdi") ||
      uye.email.replace("@neset.local", "");

    await addDoc(collection(db, "yorumlar"), {
      yorum,
      kullaniciAdi: ad,
      tarih: serverTimestamp()
    });

    setYorum("");
    setYorumBasarili("Yorumunuz başarıyla eklendi.");
    yorumlariGetir();
  }

  useEffect(() => {
    yorumlariGetir();

    const unsub = onAuthStateChanged(auth, (user) => {
      setUye(user);

      if (user) {
        const kayitliAd =
          localStorage.getItem("kullaniciAdi") ||
          user.email.replace("@neset.local", "");

        setKullaniciAdi(kayitliAd);
      }
    });

    return () => unsub();
  }, []);

  if (acilis) {
    return (
      <main
        className={`min-h-screen bg-black flex items-center justify-center text-center px-6 transition-opacity duration-1000 ${
          gecis ? "opacity-0" : "opacity-100"
        }`}
      >
        <div>
          <h1 className="text-6xl md:text-7xl font-bold text-yellow-400 drop-shadow-lg">
            Türküler Diyarı
          </h1>

          <p className="mt-6 text-2xl md:text-3xl text-white">
            Türküler • Makaleler • Fotoğraflar • Paylaşımlar
          </p>

          <button
            onClick={siteyeGir}
            className="mt-10 rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black hover:bg-yellow-400"
          >
            Siteye Gir
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] via-[#1a1208] to-[#0f0f0f] text-white transition-opacity duration-1000">

      <header className="px-8 py-20 text-center border-b border-yellow-700/30 relative">
        <div className="absolute top-8 right-8 flex gap-3">
          {uye ? (
            <>
              <span className="rounded-xl border border-yellow-600/30 px-4 py-3 text-sm text-yellow-300 bg-[#111]">
                {kullaniciAdi}
              </span>

              <button
                onClick={cikisYap}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 font-bold"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="rounded-xl bg-yellow-500 hover:bg-yellow-400 px-6 py-3 font-bold text-black"
            >
              Giriş Yap / Kayıt Ol
            </Link>
          )}
        </div>

        <h1 className="text-5xl font-bold text-yellow-400 drop-shadow-lg">
          Türküler Diyarı
        </h1>

        <p className="mt-5 text-gray-300 text-xl">
          Türküler • Makaleler • Fotoğraflar • Paylaşımlar
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">

        <div className="rounded-3xl bg-[#181818] border border-yellow-600/20 p-8 shadow-2xl overflow-hidden">

          <div className="rounded-2xl bg-gradient-to-r from-yellow-600/20 via-yellow-400/10 to-transparent p-8 border border-yellow-500/20">
            <p className="text-sm tracking-[4px] text-yellow-400 uppercase">
              Özel İçerik
            </p>

            <h2 className="mt-3 text-4xl font-bold text-yellow-400">
              Neşet Ertaş Makalesi
            </h2>

            <p className="mt-4 text-gray-300 leading-8 text-lg">
              Neşet Ertaş türkülerinde kadın, doğa, sevda ve Anadolu kültürü üzerine hazırlanmış özel çalışma.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-black p-4 shadow-inner">
            <iframe
              src="/neset-ertas-makale.pdf"
              className="w-full h-[820px] rounded-xl"
            ></iframe>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
            <div className="h-[2px] w-12 bg-yellow-500"></div>
            Blog İçeriği • PDF Makale • Eğitim Projesi
          </div>

        </div>

        <div className="mt-12 rounded-3xl bg-[#181818] border border-yellow-600/20 p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-400">Türküler</h2>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-[#111] rounded-2xl p-5 border border-yellow-500/20">
              <h3 className="text-xl font-bold mb-4 text-yellow-300">
                Gönül Dağı
              </h3>

              <video controls className="rounded-xl w-full">
                <source src="/gonul-dagi.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="bg-[#111] rounded-2xl p-5 border border-yellow-500/20">
              <h3 className="text-xl font-bold mb-4 text-yellow-300">
                Zahidem
              </h3>

              <video controls className="rounded-xl w-full">
                <source src="/zahidem.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-[#181818] border border-yellow-600/20 p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-400">Yorumlar</h2>

          <textarea
            value={yorum}
            onChange={(e) => setYorum(e.target.value)}
            placeholder={
              uye ? "Yorum yaz..." : "Yorum yazmak için giriş yapmalısınız."
            }
            className="mt-6 w-full h-36 rounded-2xl bg-[#0f0f0f] border border-yellow-500/20 p-4"
          />

          {yorumHata && (
            <div className="mt-4 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-red-300">
              {yorumHata}
            </div>
          )}

          {yorumBasarili && (
            <div className="mt-4 rounded-xl border border-green-500/40 bg-green-950/40 p-4 text-green-300">
              {yorumBasarili}
            </div>
          )}

          <button
            onClick={yorumEkle}
            className="mt-5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3"
          >
            Yorum Yap
          </button>

          <div className="space-y-4 mt-8">
            {yorumlar.map((item) => (
              <div
                key={item.id}
                className="bg-[#101010] border border-yellow-600/10 rounded-2xl p-5"
              >
                <p className="text-yellow-400 text-sm">
                  {item.kullaniciAdi || item.email}
                </p>
                <p className="mt-2 text-gray-300">{item.yorum}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      <footer className="border-t border-yellow-700/20 py-8 text-center text-gray-400">
        © Neşet Ertaş Blog
      </footer>
    </main>
  );
}