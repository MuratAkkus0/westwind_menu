# Westwind Sipariş — Kararlar (v1)

Westwind (Café/Bistro/Bar, Spadenteich 1, Hamburg) için garsonların telefonda kullandığı, masa bazlı basit sipariş alma uygulaması.
Veri yalnızca cihazın localStorage'ında durur. v2 kapsamı: [v2-yapilacaklar.md](v2-yapilacaklar.md).

## 1. Tech stack ve yapı

| Konu | Karar |
|---|---|
| Dil | TypeScript |
| Framework | Next.js (App Router), statik export (`output: 'export'`) |
| Sürümler | Güncel LTS/son kararlı; Aşama 0'da çevrimiçi doğrulanır (doğrulanmadı). Kurulum/güncelleme yalnızca kullanıcı onayıyla |
| Paket yöneticisi | pnpm |
| Stil | Tailwind CSS; tüm renkler tek dosyada token (tek dosyadan değişen varsayılan palet) |
| State + kalıcılık | Zustand + `persist` (localStorage), sürümlü şema + migration |
| Menü verisi | `src/data/menu.ts` (typed), PDF'lerden çıkarılır; tek doğruluk kaynağı. Fiyatlar cent cinsinden integer |
| Veritabanı / kuyruk / depolama | Yok (v1) |
| Giriş | Yok (v1) |
| i18n | Arayüz metinleri JSON'dan; varsayılan dil Almanca (`de`); ileride dil eklenebilir. Menü ürün adları Almanca kalır |
| Para | EUR, `Intl.NumberFormat('de-DE')`. Fiyatlar MwSt. + servis dahil (menü notu) |
| Loglama | v1'de yok (yalnızca geliştirme konsolu) |
| Test | Vitest (unit: toplam hesabı, store, menü doğrulaması) + Playwright (E2E: masa ekle → ürün ekle → kapat, yenileme sonrası kalıcılık) |
| Barındırma | Statik host (Vercel/Netlify, sonra); lokal çalıştırma yeterli. PWA/offline v2 |
| Hedef cihaz | Garson telefonu; mobil-öncelikli, büyük dokunma alanları |

```
westwind_meu/
  reference/        # orijinal menü PDF'leri
  docs/             # kararlar, plan, v2 listesi
  src/
    app/            # sayfalar (masalar, masa detayı, ayarlar)
    data/menu.ts    # menü verisi
    i18n/de.json    # arayüz metinleri
    store/          # zustand store + şema + migration
    lib/            # fiyat/toplam hesabı, para formatı
```

## 2. Ayarlar (v1)

Ayarlar sayfası küçük tutulur; localStorage'da tek bir `settings` nesnesi, kodda yalnızca tip/varsayılan/doğrulama.

| Ayar | Varsayılan |
|---|---|
| Arayüz dili | `de` |
| Tükendi (86'd) ürünler | boş liste |

## 3. Kapsam

- Kullanıcı: tek cihaz, tek garson oturumu; giriş yok. Çok kullanıcı / çok cihaz v2.
- Mutfak/bar ekranı, fiş, ödeme entegrasyonu, gün sonu raporu v1'de yok.
- Ana kasa yazılımına bağlanma ileride yapılacak; şu an nasıl bağlanacağı bilinmiyor (kullanıcı araştıracak). Bunun için `src/lib/orders` altında dış sisteme gönderim noktası (adapter arayüzü) şimdiden ayrı tutulur, v1'de boş/no-op.

## 4. Masalar

- Ana ekranda yalnızca **eklenmiş** masalar numaralı kutucuk olarak görünür; sabit masa sayısı yok.
- Masa ekleme: girdi alanına tek numara veya virgülle ayrılmış liste yazılır (`3`, `3,14,2`) → **Ekle** → her numara için bir masa oluşur.
- Zaten var olan numara tekrar eklenmez (sessizce atlanır, kullanıcıya "zaten var" bilgisi).
- Geçersiz girdi (harf, boş, 0, negatif) satır içi hata ile reddedilir.
- Kutucuğa tıklayınca o masanın sipariş ekranı açılır.
- Masanın kaldırılması/hesap kapandıktan sonra kutunun ana ekranda kalıp kalmayacağı: bkz. §9 (açık karar).

## 5. Menü modeli

- Yapı: **Bölüm** (Speisekarte, Mittagstisch, Saisonale Speisen) → **Kategori** → **Ürün**.
- Ürün: `id`, `name`, `description?`, `station` (`kitchen` | `bar`; v2 yönlendirme kancası), `additives?` (Zusatzstoffe numaraları; v1'de UI'da gösterilmez), `variants` (en az bir; ad + cent fiyat; ör. 0,3l / 0,5l, klein / groß), `optionGroups?` (ekstralar/Aufpreis; ör. Hafermilch +0,50, Mohn +0,50, Sahne +1,00; seçim grubu: tekli veya çoklu, zorunlu/isteğe bağlı).
- Sipariş kaleminde serbest metin **Not**.
- Menüde uygulama içi düzenleme yok; fiyat/ürün değişikliği dosyadan. Tek istisna: ürün bazında "tükendi" anahtarı.
- Frühstück/Mittagstisch/hafta sonu/kış ürünleri zamana göre otomatik gizlenmez; hepsi görünür.
- Veri girişinde PDF'teki yazım tutarsızlıkları düzeltilir ve "(otonom karar)" ile not edilir.

## 6. Sipariş modeli (geçici — bkz. §9)

- Masa başına tek açık adisyon; kalemler eklenir.
- Kalem: ürün adı ve fiyat **anlık görüntü (snapshot)** olarak saklanır; menü değişse eski sipariş bozulmaz.
- v1 işlemleri: kalem ekle, adet ±, kalem sil, not, hesabı kapat (geçmişe taşı), açık adisyonu iptal.
- Ödeme: yalnızca toplam gösterilir; isteğe bağlı ödeme yöntemi etiketi (Bar / Karte). Gerçek ödeme yok.
- Kalem durumu (mutfağa gitti/hazır) v1'de yok.

## 7. Kalıcılık ve güvenlik

- localStorage anahtarı sürümlü (`westwind:v1`); şema değişince migration yazılır.
- Tarayıcı verisi silinirse siparişler kaybolur; v1'de yedekleme/dışa aktarma yok (kullanıcı kararı).
- Giriş/PIN yok.

## 8. Arayüz

- Sayfalar: Masalar (ana), Masa detayı (sipariş + menü), Ayarlar.
- Masa detayı: üstte bölüm sekmeleri, kategori çipleri, arama (aksan ve büyük/küçük harf duyarsız, Almanca), "son kullanılanlar", altta sabit toplam + "Hesabı kapat".
- Boş / yükleniyor / hata durumları tanımlı; mobil-öncelikli; tema: sistem (açık/koyu), tüm renkler token.

## 9. Açık kararlar

1. **Sipariş modeli / adisyon:** kullanıcı "neyden bahsettiğini anlamadım" dedi; tartışılacak. Geçici öneri: masa başına tek açık adisyon (§6). Bağlı alt soru: hesap kapanınca masa kutusu ana ekrandan kalksın mı (öneri: kalksın; masa tekrar eklenir).

## 10. Çalışma şekli

- Commit ve push izni verildi (repo: https://github.com/MuratAkkus0/westwind_menu.git, dal: `main`).
- Commit mesajı: tek satır, İngilizce, Conventional Commits, AI atıf/Co-Authored-By satırı yok.
- Aşama aşama ilerlenir; her aşama sonunda özet + onay.
