---
name: proje-planlama
description: Yeni bir yazılım projesini (veya bir MVP'yi) koda geçmeden önce kullanıcıyla birlikte uçtan uca planlar — fizibilite, tech stack, mimari, iş mantığı ve dizayn kararlarını numaralı karar turlarıyla kesinleştirir, açık kalan konuları kullanıcı sormadan kendisi sorar, kararları docs/kararlar.md, docs/v1-plan.md, docs/v2-yapilacaklar.md ve CLAUDE.md olarak yazar ve "bağımsız geliştirmek için neye ihtiyacım var" kontrolüyle otonom geliştirmeye hazırlar. Use when the user starts a new project or app idea and wants to plan it before building, or says "yeni bir proje yapmak istiyorum", "bir uygulama yapalım", "MVP planlayalım", "tech stack ne olmalı", "nasıl bir yapı kuralım", "başlamadan neleri kararlaştırmalıyız", "dizayn kararlarını netleştirelim", "projeyi planla", "plan this project", "help me plan an MVP", "what stack should I use", "let's decide the architecture before coding".
---

# Proje Planlama (koddan önce her şeyi kesinleştir)

Amaç: Kullanıcıyla birlikte düşünerek, **kod yazmadan önce** projenin tüm önemli kararlarını kesinleştirmek ve
sonunda Claude'un kullanıcıya sormadan v1'i (MVP) uçtan uca geliştirebileceği bir zemin bırakmak.

Bu skill teknik planlama içindir. Pazar/fikir doğrulaması isteniyorsa önce `product-idea-validation` skill'i kullanılır.

## Temel ilkeler (her turda geçerli)

1. **Kullanıcının dilinde yaz** (varsayılan Türkçe). Kod, commit ve kod yorumları İngilizce kalır.
2. **Sonuç önce:** her cevabın ilk cümlesi önerin/sonucun olsun; gerekçe altta.
3. **Açık konuları sen sor.** Kullanıcının "başka açık konu var mı?" demesini bekleme. Her turun sonunda kalan açık
   kararları kendin listele (bkz. [Karar turları](#3-karar-turları)).
4. **Her soruya bir öneri ekle** (`→ Öneri: …`). Kullanıcı "önerini uygula" diyebilmeli; yalnızca gerçekten
   kullanıcıya ait seçimlerde (marka, bütçe, hesap, kişisel tercih) öneri vermeden sor.
5. **Numaralı listeler kullan**, kullanıcı numarayla cevaplasın ("1, 3, 4 uygula; 2'yi tartışalım").
6. **Karşılaştırmaları tabloyla ver** (seçenek | artısı | eksisi | maliyet) ve tek bir öneriyle bitir.
7. **Anlaşılmayan kavramı önce sade dille açıkla, sonra karar iste.** Kullanıcı "anlamadım" derse benzetme +
   küçük şema + seçenek tablosu ver; jargonla cevaplama.
8. **"Tartışalım" = sadece konuş.** Kullanıcı tartışmak istediğinde komut çalıştırma, dosya/sunucu/bucket değiştirme;
   hipotezleri ve hangi verinin hangisini doğrulayacağını yaz, gerekiyorsa belirli bir kontrol öner ve onay bekle.
9. **Verilmiş kararı yeniden tartışma.** Önceki önerini değiştirmen gerekiyorsa açıkça "önerimi değiştiriyorum,
   çünkü …" de ve onay iste (ör. yeni bir bilgi bir kuyruk/registry seçimini değiştirdiğinde).
10. **Doğrulanabilir bilgiyi uydurma.** Sürümler, API limitleri, fiyatlar, platform kısıtları için güncel kaynağa bak
    (registry, resmi dokümanlar, endoflife.date). Doğrulayamadığını "doğrulanmadı" diye işaretle.
11. **Sır isteme.** Anahtar/şifre asla sohbete yazdırılmaz. Kullanıcıya sırları yerelde üreten ve doğrudan
    `.env`/secret store'a yazan komutlar ver. `.env` okunmaz; yalnızca anahtar adlarının varlığı kontrol edilir.
12. **Kurulum ve geri dönüşsüz işler onaylıdır:** sistem paketleri, global araçlar, silme, dışa açılan işlemler
    (push, deploy, secret yükleme) için onay al; proje bağımlılıkları serbesttir.

## Akış

### 1. Fikir ve kapsam

- Kullanıcının ne yapmak istediğini 2–3 cümleyle geri özetle.
- Kim kullanacak (tek kullanıcı mı, ekip mi, SaaS mı), nerede çalışacak, v1'in "bitti" tanımı ne?
- Kapsam belirsizse en fazla 3 kritik soru sor; gerisini öneriyle varsay ve listede göster.

### 2. Fizibilite ve dış bağımlılıklar

- Projenin dayandığı dış servisleri (API, ödeme, depolama, sosyal platform…) araştır: resmi API var mı,
  hesap türü/izin şartları, limitler, ücret, kullanım şartları (ToS) riskleri.
- Alternatif yolları (resmi API / üçüncü parti servis / tarayıcı otomasyonu vb.) tabloyla karşılaştır; riskleri
  (hesap kısıtlanması, kırılganlık) açıkça yaz ve bir yol öner.
- Desteklenmeyen şeyleri ("API ile X yapılamaz") erken söyle; ürün kararlarını etkiler.

### 3. Tech stack ve mimari

- Katman katman tablo: Katman | Seçim | Neden. (Dil, framework, UI, veritabanı, ORM, kuyruk/zamanlayıcı,
  depolama, auth, i18n, loglama, test, kod kalitesi, CI, barındırma.)
- Mevcut ekosistemle uyumu gözet (kullanıcının zaten kullandığı diller/araçlar).
- Kullanıcı bir seçimi sorarsa (ör. SQLite vs Postgres) tarafsız karşılaştırma + projeye özel öneri ver.
- **Sürümleri doğrula:** her araç için güncel LTS/son kararlı sürümü çevrimiçi kontrol et, kullanıcının makinesindeki
  sürümleri de kontrol et; güncelleme gerekiyorsa nasıl kurulduğunu tespit edip aynı yolla güncellemeyi öner ve
  onay bekle.
- Repo yapısını (monorepo/paketler), gelecekteki sürümlerin (v2) eklenme noktalarını (adapter, kuyruk, kaynak alanı)
  şimdiden göster.

### 4. Karar turları

Her tur şu biçimde biter:

```
## Netleştirmemiz gerekenler
1. **<Konu>:** <kısa soru/bağlam>. → Öneri: <öneri ve tek cümle gerekçe>
2. ...
Hangi maddelerde farklı düşünüyorsun? Cevap verirsen bir sonraki tura geçerim.
```

- Kullanıcının cevabını üç gruba ayırıp geri yansıt: **uygulanacak öneriler**, **değiştirilenler**, **tartışılacaklar**.
- Tartışılacakları ayrı başlıklarla, seçenek tablosuyla ele al.
- Ertelenen her fikri hemen `docs/v2-yapilacaklar.md`'ye kısa madde olarak yaz ("unutulmasın").
- Kapsanması gereken karar alanları için **[references/karar-kontrol-listesi.md](references/karar-kontrol-listesi.md)**'yi
  her turdan önce gözden geçir; konuşulmamış alanları sıradaki tura ekle. Projeyle ilgisiz alanları atla, ama
  atladığını bilerek atla.
- Turlar, kontrol listesinde projeyle ilgili açık alan kalmayana kadar sürer. Kullanıcı "önerilerini beğendim, uygula"
  derse kalan önerileri karar olarak kaydet.

### 5. Kararları yazıya dök

Açık karar kalmadığında şablonlara göre ([references/sablonlar.md](references/sablonlar.md)) yaz:

- `docs/kararlar.md` — **tek referans**: tüm ürün, iş mantığı ve teknik kararlar, varsayılan değerler tablosu.
- `docs/v2-yapilacaklar.md` — bilerek ertelenenler.
- `docs/v1-plan.md` — aşamalar, her aşamanın kabul kriterleri, kullanıcıdan gereken dış işler, durum tablosu.
- `CLAUDE.md` — çalışma kuralları (ne zaman sorulur, kesin yasaklar, git kuralları, aşama akışı, teknik notlar).
- Git deposu yoksa başlat; kullanıcı izin verdiyse ilk commit + push.

### 6. Bağımsız geliştirme hazırlığı ("başka neye ihtiyacım var?")

Kullanıcıya sormadan şu üç başlıkta eksikleri listele:

1. **Kullanıcının yapması gerekenler (hesaplar/anahtarlar/dış paneller):** her biri için ne, neden, ne zaman
   gerektiği (hangi aşamada) ve "adım adım ben yaptıracağım" notu. Dış paneller (Meta, Cloudflare, Stripe…) için
   adımları ilgili aşama geldiğinde, kullanıcının o anki ekranına uygun ve tek tek ver.
2. **Kalan küçük kararlar:** proje konumu, isim (geçici isimle ilerlenebilir), marka/palet (tek dosyadan
   değiştirilebilir varsayılanla başla), test hesabı (gerçek hesap yerine), araç sürümleri.
3. **Çalışma kuralları:** commit/push izni ve formatı, ne zaman durup sorulacağı, aşama sonu kontrol noktaları
   veya otonom mod, "bitti" tanımı (lint, typecheck, unit/integration, E2E, build, CI), izin listesi
   (`.claude/settings.json`), kurulum yasakları, sır kuralları.

Dış hesap gerektiren servisler hazır değilse **yerel muadilleriyle** ilerleme planını öner (S3 → MinIO/benzeri,
dış API → sahte sunucu/mocks, tünel → sonraya) ki geliştirme bloklanmasın; gerçek servise geçişi en sona bir
rehberle bırak.

### 7. Geliştirmeye geçiş

- Kullanıcı onayladığında: ya aşama aşama (her aşama sonunda özet + onay), ya da kullanıcı isterse **otonom mod**
  (aşamalar arasında durmadan, her aşamada kendi testleri, commit, push, CI kontrolü). Otonom modu CLAUDE.md'ye yaz.
- Büyük projelerde koddan önce bir mimari blueprint (`docs/<sürüm>-architecture.md`) çıkar: şema, durum makinesi,
  işler/kuyruklar, modüller, sayfalar, test planı, aşama bazında kabul kriterleri; kararlar.md ile çelişmesin.
- Geliştirme sırasında alınan her yeni karar `docs/kararlar.md`'ye "(otonom karar)" etiketiyle eklenir.

## Cevap biçimi hatırlatıcıları

- Başlıklar kısa, maddeler kısa; uzun gerekçeler tabloda.
- Her turun sonunda tek, net bir "sıradaki adım" cümlesi.
- Kullanıcının verdiği bilgiyle (ör. sunucu adı, alan adı, hesap kimliği) çelişen bir şey görürsen (ör. "root login
  kapalı" dedi ama açık) bunu kibarca ve kanıtla bildir; kendiliğinden değiştirme, onay iste.
