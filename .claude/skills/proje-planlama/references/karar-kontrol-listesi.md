# Karar kontrol listesi

Her karar turundan önce bu listeyi tara. Projeyle ilgili ama henüz konuşulmamış her alan sıradaki turun
maddesi olur (öneriyle birlikte). İlgisiz alanları atla.

## Ürün ve kapsam
- [ ] v1'in (MVP) "bitti" tanımı; v1'e girmeyenler → v2 listesi
- [ ] Kullanıcı modeli: tek kullanıcı / çok kullanıcı / çok kiracılı (veri modeli ileriye dönük mü?)
- [ ] Desteklenecek içerik/varlık tipleri (v1'de hangileri, hangileri sonra)
- [ ] Dış platformların desteklemedikleri ve bunun ürüne etkisi
- [ ] Uygulama adı (geçici isimle ilerlenebilir), marka/palet (tek dosyadan değişebilir varsayılan)
- [ ] Arayüz dili ve i18n (metinler JSON'dan, ileride dil eklenebilir mi?)

## Ayarlar ve varsayılanlar
- [ ] Kullanıcının değiştirebileceği davranışlar → Ayarlar sayfası
- [ ] Ayarların **tek gerçeklik kaynağı** (DB tablosu + kodda yalnızca tanım/doğrulama/varsayılan)
- [ ] Her ayarın varsayılan değeri; ayar değişince hangi süreçlerin anında etkileneceği
- [ ] Öğe bazında ayar ezme (ör. gönderi bazında seçenek) ve oluşturma anında anlık görüntü (snapshot)

## İş mantığı ve güvenilirlik
- [ ] Ana varlığın yaşam döngüsü / durum makinesi (tüm durumlar ve geçişler)
- [ ] Çift işlem riski (çift ödeme, çift paylaşım): kilit/idempotency, belirsiz sonuçta "önce kontrol et"
- [ ] Tekrar deneme politikası: geçici vs kalıcı hata ayrımı, deneme sayısı/bekleme
- [ ] Takılan işler (zaman aşımı → başarısız, süre ayardan) ve doğrulama
- [ ] Sistem kapalıyken kaçırılan işler (tolerans, sonrası ne olur)
- [ ] Kısmi başarı durumu ve sonradan tekrar deneme
- [ ] Zamanlama semantiği: saat dilimi, UTC saklama, zaman aralığı/rastgelelik, minimum aralık kuralları,
      ön hazırlık süresi, kuyruk/slot mantığı
- [ ] Düzenleme kuralları: hangi durumlara kadar düzenlenebilir, düzenleme neyi geçersiz kılar
- [ ] Kopyalama/çoğaltma, iptal, yeniden planlama akışları

## Veri, medya ve depolama
- [ ] Depolama seçimi (maliyet tablosu: depolama, egress, işlem; kredi kartı/hesap şartları) ve soyutlama (adapter)
- [ ] Yükleme akışı (tarayıcıdan doğrudan imzalı URL vs sunucu üzerinden), CORS, imzalı URL ömrü
- [ ] Dosya doğrulama (format/boyut/süre), reddetme mesajları, otomatik dönüştürme (şimdi mi v2 mi?)
- [ ] Kütüphane modeli (bağımsız varlık + referans) vs öğeye bağlı dosya
- [ ] Silme akışları: kullanılmıyorsa basit onay, kullanılıyorsa etkilenenleri listeleyen + yazılı onaylı popup;
      silmenin bağlı kayıtlara etkisi
- [ ] Saklama/arşiv süresi, yedekleme (ne, nereye, ne sıklıkla, geri yükleme testi)

## Hatalar, olaylar, gözlemlenebilirlik
- [ ] Hata kaydı modeli: başlık + açıklama (i18n anahtarı + parametre) + teknik detay; kaynak, önem, çözüldü
- [ ] Olay zaman çizelgesi (öğe bazında) ve uygulama genel hataları; Hatalar sekmesi, okunmamış rozeti
- [ ] Kayıt saklama süresi; çözülenlerin gizlenmesi
- [ ] Loglama (yapılandırılmış log, sır maskeleme); harici hata izleme (Sentry vb.) gerekli mi?
- [ ] Bildirimler: uygulama içi mi, e-posta/push mu?

## Güvenlik ve erişim
- [ ] Uygulamaya giriş (auth kütüphanesi, kayıt kapalı mı, ilk kullanıcı nasıl oluşur, şifre kuralı)
- [ ] Dış servis token'larının şifreli saklanması, anahtar yönetimi, token yenileme ve süresi dolma uyarısı
- [ ] Sırların yeri (.env, CI secret store), örnek dosya (.env.example) — sırlar asla repoya/sohbete
- [ ] En az yetki: sunucu kullanıcısı, deploy anahtarı kısıtı, API token kapsamı (bucket/IP kısıtı etkileri!)
- [ ] Rate limit, CORS, güvenlik başlıkları

## Arayüz
- [ ] Sayfa listesi ve menü; dashboard'da hangi widget'lar
- [ ] Liste/takvim/detay görünümleri; önizleme, sayaçlar, boş/yükleniyor/hata durumları
- [ ] Mobil uyumluluk düzeyi; tema (açık/koyu/sistem) ve tüm renklerin tek dosyada token olması

## Altyapı ve teslim
- [ ] Repo yapısı (monorepo/paketler), paket yöneticisi, araç sürümleri (güncel LTS, çevrimiçi doğrulanmış)
- [ ] Kuyruk/zamanlayıcı (ayrı worker süreci?), tek worker garantisi
- [ ] Yerel geliştirme: Docker Compose servisleri, dış servislerin yerel muadilleri (sahte sunucu, MinIO…), HTTPS/tünel
- [ ] Test stratejisi: unit, integration (gerçek DB), E2E (tarayıcı), dış API mock'ları; CI'da hangileri
- [ ] Kod kalitesi araçları ve CI (lint, typecheck, test, build, E2E)
- [ ] Barındırma: lokal → sunucu geçişi, alan adı/DNS, reverse proxy veya tünel, sertifika
- [ ] Deploy: otomatik mi elle mi; imaj nerede derlenir/nasıl taşınır (registry kotası/ücreti!), migration,
      sağlık kontrolü, rollback, sunucuda en az yetkili kullanıcı
- [ ] Gelecek sürüm kancaları (v2 için şimdiden şemada/arayüzde bırakılacak yerler)

## Çalışma şekli
- [ ] Commit/push izni ve mesaj formatı; geçmişi yeniden yazma yasağı (revert kullan)
- [ ] Ne zaman durup sorulacağı / otonom mod
- [ ] Aşama sonu kontrol noktaları, "bitti" tanımı
- [ ] Kurulum izinleri ve izin listesi (`.claude/settings.json`)
- [ ] Kullanıcının dış panellerde yapacağı işler (adım adım, ilgili aşamada)
