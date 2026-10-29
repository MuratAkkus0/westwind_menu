# Westwind Sipariş — Kararlar (v1)

Westwind (Café/Bistro/Bar, Spadenteich 1, Hamburg) için garsonların telefonda kullandığı, masa bazlı basit sipariş alma uygulaması.
Veri yalnızca cihazın localStorage'ında durur. v2 kapsamı: [v2-yapilacaklar.md](v2-yapilacaklar.md).

## 1. Tech stack ve yapı

| Konu | Karar |
|---|---|
| Dil | TypeScript |
| Framework | Next.js (App Router), statik export (`output: 'export'`) |
| Sürümler | Node v24.22.0 (yerelde kurulu, LTS hattı; yeterli, güncelleme gerekmez), pnpm 12.14.0 (yerel; son 12.16.1, gerekmez). Next.js ve Tailwind son kararlı sürümü kurulumda `npm view` ile doğrulanır (bugün: Next 16.4.3, Tailwind 4.3.3). Sistem/global araç kurulumu yalnızca kullanıcı onayıyla |
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
- Hesap kapatılınca veya açık adisyon iptal edilince masa kutusu ana ekrandan kalkar.

## 5. Menü modeli

- Yapı: **Bölüm** (Speisekarte, Mittagstisch, Saisonale Speisen) → **Kategori** → **Ürün**.
- Ürün: `id`, `name`, `description?`, `station` (`kitchen` | `bar`; v2 yönlendirme kancası), `additives?` (Zusatzstoffe numaraları; v1'de UI'da gösterilmez), `variants` (en az bir; ad + cent fiyat; ör. 0,3l / 0,5l, klein / groß), `optionGroups?` (ekstralar/Aufpreis; ör. Hafermilch +0,50, Mohn +0,50, Sahne +1,00; seçim grubu: tekli veya çoklu, zorunlu/isteğe bağlı).
- Sipariş kaleminde serbest metin **Not**.
- Menüde uygulama içi düzenleme yok; fiyat/ürün değişikliği dosyadan. Tek istisna: ürün bazında "tükendi" anahtarı.
- Frühstück/Mittagstisch/hafta sonu/kış ürünleri zamana göre otomatik gizlenmez; hepsi görünür.
- Veri girişinde PDF'teki yazım tutarsızlıkları düzeltilir ve "(otonom karar)" ile not edilir.

## 6. Sipariş modeli

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

Yok. Kapanan kararlar:
1. **Adisyon modeli:** A seçildi — masa başına tek açık adisyon, tur/gönderim kavramı yok.
2. **Hesap kapanınca:** masa kutusu ana ekrandan kalkar; masa tekrar kullanılacaksa numarası yeniden eklenir.

## 10. Çalışma şekli

- Commit ve push izni verildi (repo: https://github.com/MuratAkkus0/westwind_menu.git, dal: `main`).
- Commit mesajı: tek satır, İngilizce, Conventional Commits, AI atıf/Co-Authored-By satırı yok.
- Aşama aşama ilerlenir; her aşama sonunda özet + onay.

## Aşama 1 — otonom kararlar

- Menü dosyası üç parçalı: `menu-types.ts` (tipler), `menu-builders.ts` (id üreten yardımcılar), `menu.ts` (veri). Ürün id'si `bölüm--kategori--ürün-adı` slug'ıdır; ad değişirse id değişir. (otonom karar)
- Kategoriler PDF başlıklarını izler. Tapas, Weine ve Warme Getränke alt başlıkları ayrı kategori oldu (ör. "Tapas Fisch", "Warme Getränke mit Schuss"). Tapas başlığındaki "Portion Brot", "Tapas Veggi" altına kondu. (otonom karar)
- Fiyatı aynı olan seçimler zorunlu tekli seçim grubu oldu (Kakao-Sorte, Tee-Sorte, Saft, Thai Curry rot/gelb/grün…). Fiyatı farklı olanlar varyant oldu (Größe, Glas/Karaffe/Flasche, "mit Amaretto"). Fiyat farkı ürün üstüne eklenen seçimler Aufpreis seçeneği oldu (Thai Curry + Hähnchen 16,90 € = 13,90 € + 3,00 €). (otonom karar)
- Ortak ekstralar: Kaffee (Hafermilch / laktosefrei / entkoffeiniert +0,50, Extra Shot +1,50, Geeist +1,00), Aroma +0,50 (Milchkaffee, Cappuccino, Latte), Hafermilch/laktosefrei +0,50 süt bazlı sıcak içeceklerde, Mohn +0,50 (Pfannkuchen süß, Waffeln), Sahne +1,00 (Waffeln, Kakao), Salatbeilage +2,00 (Mittagstisch ana yemekleri), Dressing (tüm Salate), Toppings (yalnızca Gemischter Salat). (otonom karar)
- Mittagstisch ürün adlarında PDF'teki numara korundu ("1. Backfisch …"), çünkü garson numarayla arayabilir. (otonom karar)
- Saisonale Speisen'deki Elbling, Saisonal kartında ayrıca duruyor (0,1l fiyatı orada 3,50 €; Speisekarte'de 3,60 €). (otonom karar)
- Zusatzstoffe yalnızca ürün düzeyinde ve PDF'te açıkça işaretli olanlar için girildi; varyanta bağlı işaretler (ör. Rühreier mit Speckwürfeln) girilmedi. (otonom karar)
- PDF yazım düzeltmeleri: Mandekuchen → Mandelkuchen, Serrano Schinke → Schinken, Gratein & Meyer Crémat → Gratien & Meyer Crémant, Pigueras → Piqueras, Blody Mary → Bloody Mary, Pringels → Pringles, Ramazotti → Ramazzotti, Roibush → Rooibos, Bailey's → Baileys, Glühgin fiyatındaki fazladan "(" atıldı. "Pimentos del Patron" ve "Fuetec" PDF'teki gibi bırakıldı. (otonom karar)

## Aşama 2 — otonom kararlar

- Renk token'ları `src/app/theme.css` dosyasında; Tailwind adları `bg-surface`, `text-muted`, `bg-primary` vb. Varsayılan palet denizci lacivert + kum (açık/koyu sistem temasına göre). (otonom karar)
- Arayüz metinleri `src/i18n/de.json`; `useTranslation()` dili store'daki ayardan alır. (otonom karar)
- Store localStorage'ı ilk client render'dan sonra okur (`skipHydration` + `StoreHydrator`); okunana kadar sayfalar "Lädt…" gösterir. Böylece statik HTML ile ilk render çakışmaz. (otonom karar)
- Aynı ürün + varyant + seçenekler + not ile eklenen kalem yeni satır açmaz, adedi artırır. (otonom karar)
- Kapanan adisyonlar `history` içinde en fazla 200 kayıt tutulur (localStorage'ı şişirmemek için); v1'de görüntülenmez, v2'deki gün sonu raporuna veri olur. (otonom karar)
- "Son kullanılanlar" en fazla 12 ürün tutar. (otonom karar)
- Kasa entegrasyonu kancası: `src/lib/order-sink.ts` (`tabClosed`), v1'de boş. (otonom karar)

## Aşama 3 — otonom kararlar

- Masa numarası girişinde virgül, nokta, noktalı virgül ve boşluk ayırıcıdır (`3.14.2` de çalışır), çünkü telefonların sayı klavyelerinde farklı ayırıcı tuşları var. Alan `inputMode="decimal"` ile sayı klavyesi açar. (otonom karar)
- Masa numarası 1–999 arası tam sayı. Geçersiz girdide geçerli numaralar yine eklenir, girdi alanı düzeltme için silinmez. (otonom karar)
- Masa kutuları numaraya göre sıralı; siparişi olan masa dolu renkte, kalem sayısı ve toplamı gösterir. (otonom karar)

## Aşama 4 — otonom kararlar

- Masa ekranı yolu `/table?number=3`. Statik export her masa numarası için sayfa üretemeyeceği için numara query parametresinden okunur. (otonom karar)
- Masa ekranında iki sekme var: "Menü" ve "Bestellung (n)". Menüde altta sabit "Bestellung · n Pos. · toplam" düğmesi var, üst barda toplam her zaman görünür. (otonom karar)
- Ürün satırına dokunma davranışı: seçeneği olmayan ürün tek dokunuşla eklenir. Seçeneği olan ürün seçim panelini açar. Tek fiyatlı ve zorunlu seçimi olmayan ürünlerde (ör. Espresso) ayrıca sağda "+" düğmesi var, varsayılanla tek dokunuşta ekler. (otonom karar)
- Ürün paneli zorunlu seçim eksikse ekleme yapmaz ve eksik grupları kırmızıyla gösterir. Tekli isteğe bağlı gruplar (ör. Einlage, Dressing) tekrar dokunulunca kaldırılabilir. (otonom karar)
- Adisyonda kalem adedi 0'a inerse kalem silinir. Not, kalem üzerinden sonradan eklenip düzenlenebilir. (otonom karar)
- Hesap kapatma: ödeme yöntemi Bar / Karte / Keine Angabe (varsayılan). Karte seçilip toplam 15,00 €'nun altındaysa uyarı gösterilir ama engellenmez. Masa iptali onay ister. İkisinde de ana ekrana dönülür, masa kutusu kalkar. (otonom karar)
- Tükendi yönetimi Einstellungen sayfasında, arama ile. Tükenen ürün menüde soluk ve "ausverkauft" olarak görünür, eklenemez. (otonom karar)
- Renk değerleri `theme.css`'te kalır ama layout'tan doğrudan import edilir. Tailwind eşlemesi `globals.css`'te yapılır. Neden: dev modunda `@import` ile gelen `:root` değişkenleri CSS'e girmiyordu. (otonom karar)

## Aşama 5 — otonom kararlar

- `trailingSlash: true`: export `table/index.html` üretir, böylece her sade statik sunucu `/table/?number=3` adresini sayfa yenilemede de bulur. (otonom karar)
- "Hinzufügen" düğmesi store yüklenene kadar devre dışı. Yavaş ağda erken dokunuş native form gönderimiyle sayfayı yenilemesin diye. (otonom karar)
- `pnpm e2e:static` aynı testleri `out/` klasörüne karşı `serve` ile çalıştırır. Python `http.server` eşzamanlı isteklerde chunk düşürdüğü için kullanılmadı. (otonom karar)
