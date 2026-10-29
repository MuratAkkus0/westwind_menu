# Westwind Sipariş

Westwind (Café · Bistro · Bar, Hamburg) için garson telefonunda çalışan masa siparişi uygulaması.
Veriler yalnızca cihazın tarayıcısında (localStorage) tutulur; sunucu ve giriş yoktur.

- Kararlar: [docs/kararlar.md](docs/kararlar.md)
- Plan ve durum: [docs/v1-plan.md](docs/v1-plan.md)
- Sonraya bırakılanlar: [docs/v2-yapilacaklar.md](docs/v2-yapilacaklar.md)

## Gereksinimler

- Node.js 24 (LTS)
- pnpm 12

## Komutlar

| Komut | Ne yapar |
|---|---|
| `pnpm install` | Bağımlılıkları kurar |
| `pnpm dev` | Geliştirme sunucusu: http://localhost:3000 |
| `pnpm build` | Statik çıktıyı `out/` klasörüne üretir |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript kontrolü |
| `pnpm test` | Unit testler (Vitest) |
| `pnpm e2e` | Uçtan uca testler, dev sunucusuna karşı (Playwright, telefon görünümü) |
| `pnpm e2e:static` | Build alır, uçtan uca testleri statik çıktıya karşı çalıştırır |

İlk E2E çalıştırmasından önce bir kez `pnpm exec playwright install chromium` gerekir.

## Telefonda denemek

Bilgisayar ve telefon aynı Wi-Fi ağındayken `pnpm dev` çalıştır, telefonda
`http://<bilgisayarın-ip-adresi>:3000` adresini aç.

## Yayınlama

`pnpm build` sonrası `out/` klasörü herhangi bir statik barındırmaya (Vercel, Netlify,
GitHub Pages, kendi sunucun) olduğu gibi yüklenebilir.

## Yapı

```
src/
  app/                sayfalar: / (masalar), /table?number=3 (sipariş), /settings
    theme.css         tüm renk değerleri (açık/koyu)
  components/         arayüz bileşenleri
  data/menu.ts        menü verisi (fiyatlar cent cinsinden), kaynak: reference/*.pdf
  i18n/de.json        arayüz metinleri
  lib/orders.ts       fiyat, toplam ve masa numarası mantığı
  lib/order-sink.ts   ana kasaya aktarım kancası (v1'de boş)
  store/              Zustand store, localStorage anahtarı `westwind:v1`
e2e/                  Playwright testleri
```

## Menüyü güncellemek

Fiyat veya ürün değişikliği `src/data/menu.ts` dosyasında yapılır. `pnpm test` id'lerin
benzersizliğini ve fiyatların geçerliliğini kontrol eder. Ürünün adı değişirse id'si de
değişir; açık adisyonlardaki kalemler etkilenmez, çünkü ad ve fiyat sipariş anında kopyalanır.
