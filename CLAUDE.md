# Westwind Sipariş

Westwind restoranı için garson telefonunda çalışan, localStorage tabanlı masa siparişi uygulaması (Next.js, MVP).

**Önce oku:**
- docs/kararlar.md — tek referans; kodla çelişirse karar dokümanı geçerli, karar değişirse önce bu dosya güncellenir.
- docs/v1-plan.md — aşamalar ve kabul kriterleri.
- docs/v2-yapilacaklar.md — ertelenenler; kancalarını kur, kendilerini yapma.

## Çalışma kuralları

### Ne zaman durup sorulur
- kararlar.md'de olmayan ve geri alınması zor karar; kararlar.md ile çelişen ihtiyaç.
- kararlar.md §9'daki açık kararlar çözülmeden ilgili kod yazılmaz.
- Diğer her şeyde kararlara uyarak devam et; küçük kararları "(otonom karar)" ile kararlar.md'ye ekle.

### Kesin yasaklar
- Onaysız sistem paketi/global araç kurulumu veya güncellemesi.
- .env dosyalarını okumak; sırları sohbete/loglara yazmak.
- Arayüzde sabit metin (hepsi i18n JSON'dan); renkleri bileşene gömmek.
- Menü fiyatlarını float tutmak (cent integer).

### Git
- Commit ve push izni var (repo: https://github.com/MuratAkkus0/westwind_menu.git, dal `main`).
- Mesaj: tek satır, İngilizce, Conventional Commits (`type(scope): summary`), emir kipi, küçük harf, noktasız. AI atıf veya Co-Authored-By satırı eklenmez.
- Force push, reset --hard, geçmişi yeniden yazma yasak; geri almak için revert.

### Aşama akışı
1. Kabul kriterlerini oku → 2. geliştir, anlamlı adımlarda commit → 3. bitti: lint, typecheck, test, E2E, build →
4. planda durumu güncelle, push → 5. dur, özetle ve onay bekle.

## Teknik
- Next.js App Router, statik export; pnpm; Zustand persist (`westwind:v1`); Tailwind, renkler tek token dosyasında.
- Menü verisi `src/data/menu.ts`; kaynak PDF'ler `reference/`.
- Arayüz metinleri `src/i18n/de.json`.
- Sürümler Aşama 0'da çevrimiçi doğrulanır.
