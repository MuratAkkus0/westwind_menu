# v1 Planı

Kararlar: [kararlar.md](kararlar.md).

Durum: ⬜ başlamadı · 🔄 devam ediyor · ✅ bitti

| # | Aşama | Durum |
|---|---|---|
| 0 | Kurulum | ⬜ |
| 1 | Menü verisi | ⬜ |
| 2 | Temel (i18n, tema, store, iskelet) | ⬜ |
| 3 | Masalar ekranı | ⬜ |
| 4 | Sipariş ekranı | ⬜ |
| 5 | Bitiriş | ⬜ |

## 0. Kurulum
- Node/pnpm sürümlerini çevrimiçi ve yerelde doğrula; güncelleme gerekiyorsa kullanıcıdan onay al.
- Next.js + TypeScript + Tailwind projesini repo köküne kur; statik export ayarla.
- ESLint, Prettier, Vitest, Playwright kurulumu.

**Kabul:** `pnpm dev` açılır; `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` yeşil.
**Kullanıcıdan:** Sürüm güncellemesi gerekirse onay.

## 1. Menü verisi
- Tip tanımları (Bölüm, Kategori, Ürün, Varyant, OptionGroup).
- `reference/` altındaki üç PDF'ten `src/data/menu.ts` üret; PDF tutarsızlıklarını düzelt ve not et.
- Menü doğrulama testi (benzersiz id, en az bir varyant, fiyatlar pozitif integer).

**Kabul:** Üç PDF'teki tüm ürün ve fiyatlar eksiksiz; doğrulama testi geçer.
**Kullanıcıdan:** Üretilen menüyü gözden geçirmek (örneklem: her kategoriden birkaç ürün).

## 2. Temel
- `de.json` ve metin erişimi, tema token dosyası, zustand store ve `persist` (sürümlü şema), uygulama iskeleti ve gezinme.

**Kabul:** Sayfa yenilense de store verisi kalır; hiçbir sabit metin bileşende yok.

## 3. Masalar ekranı
- Masa ekleme (`3,14,2`), doğrulama ve mükerrer kontrolü, masa kutucukları, masaya tıklayınca sipariş ekranı.

**Kabul:** E2E: `3,14,2` → üç kutu; tekrar `3` → "zaten var"; geçersiz girdi hata verir; yenilemede masalar durur.

## 4. Sipariş ekranı
- Bölüm sekmeleri, kategori çipleri, arama, son kullanılanlar, varyant ve ekstra seçimi, not, adet ±, silme, toplam, hesabı kapat, iptal, tükendi anahtarı.

**Kabul:** E2E: masa aç → ürün ekle (varyant + ekstra + not) → toplam doğru → hesabı kapat; fiyat snapshot testi.

## 5. Bitiriş
- Boş/hata durumları, mobil cilalama, erişilebilirlik kontrolü, README, statik build doğrulaması.

**Kabul:** Telefon boyutunda tüm akış kullanılabilir; build ve tüm testler yeşil.
