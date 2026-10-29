# Westwind Sipariş — v2'de Yapılacaklar

v1 = MVP. Aşağıdakiler bilerek v1 dışında bırakıldı; v1 altyapısı bunlara uygun kurulacak.

## Entegrasyon ve çok cihaz
- Ana kasa yazılımına bağlanma (şu an yöntem bilinmiyor; kullanıcı araştıracak). Kanca: `orders` adapter arayüzü.
- Backend + çok cihazlı senkron (birden fazla garson, mutfak/bar ekranı).
- Mutfak/bar yönlendirmesi ve fiş yazdırma. Kanca: üründe `station` alanı.
- Kalem durumu (mutfağa gitti, hazır, servis edildi).

## Sipariş işlemleri
- Masa taşıma/birleştirme, hesap bölme, indirim, bahşiş.
- Gün sonu raporu (kapanan adisyon toplamı).
- Yedekleme: JSON dışa/içe aktarma.

## Menü
- Uygulama içi menü düzenleme (fiyat, ürün gizle/ekle).
- Zamana bağlı menü görünürlüğü (Frühstück 15:00'e / hafta sonu 18:00'e kadar, hafta sonuna özel ürünler, kış ürünleri).
- Zusatzstoffe/allergen rozetleri arayüzde. Kanca: üründe `additives` alanı.

## Altyapı ve erişim
- PIN/giriş ekranı (paylaşımlı cihaz).
- PWA / offline kurulum.
- Ek diller (arayüz JSON'u zaten hazır).
