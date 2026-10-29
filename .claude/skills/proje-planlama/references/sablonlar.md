# Doküman şablonları

Kararlar kesinleşince bu dosyaları oluştur. Projeye uymayan bölümleri çıkar; boş başlık bırakma.

## docs/kararlar.md

```markdown
# <Proje> — Kararlar (v1)

<Bir cümlelik tanım>. v2 kapsamı: [v2-yapilacaklar.md](v2-yapilacaklar.md).

## 1. Tech stack ve yapı

| Konu | Karar |
|---|---|
| Dil | … |
| Sürümler | … (güncel LTS; kurulum/güncelleme yalnızca kullanıcı onayıyla) |
| Repo | … |
| Veritabanı | … |
| Kuyruk | … |
| Depolama | … (adapter arkasında) |
| Giriş | … |
| i18n | … |
| Tema | Tüm renkler tek dosyada; varsayılan palet … |
| Loglama | … |
| Test | … |
| Barındırma | … |

<Repo yapısı ağacı>

## 2. Ayarlar
- Tek gerçeklik kaynağı: … ; varsayılanlar tablosu:

| Ayar | Varsayılan |
|---|---|

## 3. … (kapsam, iş mantığı, durum makinesi, zamanlama, medya, hatalar, arayüz — her biri ayrı başlık)

## Aşama N — otonom kararlar
- … (otonom karar)
```

## docs/v2-yapilacaklar.md

```markdown
# <Proje> — v2'de Yapılacaklar

v1 = MVP. Aşağıdakiler bilerek v1 dışında bırakıldı; v1 altyapısı bunlara uygun kurulacak.

## <Başlık>
- <kısa madde>
```

## docs/v1-plan.md

```markdown
# v1 Planı

Kararlar: [kararlar.md](kararlar.md).

Durum: ⬜ başlamadı · 🔄 devam ediyor · ✅ bitti

| # | Aşama | Durum |
|---|---|---|
| 0 | Kurulum | ⬜ |

## 0. Kurulum
- <işler>

**Kabul:** <çalıştırılabilir, doğrulanabilir kriterler>
**Kullanıcıdan:** <bu aşamada gereken dış işler; adım adım anlatılacak>
```

Tipik aşama sırası: 0 Kurulum → 1 Temel (auth, ayarlar, i18n, tema, iskelet) → 2..n çekirdek özellikler
(dış servis gerektirmeyenler önce) → görünümler → bitiriş (yedek, cilalama, deploy hazırlığı, gerçek servis rehberi).

## CLAUDE.md

```markdown
# <Proje>

<Bir cümle>.

**Önce oku:**
- docs/kararlar.md — tek referans; kodla çelişirse karar dokümanı geçerli, karar değişirse önce bu dosya güncellenir.
- docs/v1-plan.md — aşamalar ve kabul kriterleri.
- docs/v2-yapilacaklar.md — ertelenenler; kancalarını kur, kendilerini yapma.

## Çalışma kuralları

### Ne zaman durup sorulur
- kararlar.md'de olmayan ve geri alınması zor karar; kararlar.md ile çelişen ihtiyaç.
- Diğer her şeyde kararlara uyarak devam et; küçük kararları not et.
(Otonom modda: sormadan ilerle, yeni kararları "(otonom karar)" ile kararlar.md'ye ekle.)

### Kesin yasaklar
- Onaysız sistem paketi/global araç kurulumu veya güncellemesi.
- .env dosyalarını okumak; sırları sohbete/loglara yazmak.
- Arayüzde sabit metin (hepsi i18n JSON'dan); ayarları servis dışından okumak; renkleri bileşene gömmek.
- Gerçek dış hesaplara test verisi göndermek (test hesabı/mocks kullan).

### Git
- Commit/push izni: <var/yok>. Mesaj: tek satır, İngilizce, Conventional Commits, AI atıf satırı yok.
- Force push, reset --hard, geçmişi yeniden yazma yasak; geri almak için revert.

### Aşama akışı
1. Kabul kriterlerini oku → 2. geliştir, anlamlı adımlarda commit → 3. bitti: lint, typecheck, test, E2E, build, CI
→ 4. planda durumu güncelle, push → 5. <dur ve özetle | otonom modda devam et>.

## Teknik
- <sürümler, paket yapısı, env yükleme, ayar ekleme adımları, tema dosyası vb.>
```
