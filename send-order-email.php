<?php
/**
 * PIXWE - Sipariş E-posta Gönderimi
 * Hosting.com.tr için optimize edilmiştir
 * Dosya: send-order-email.php
 */

// 1. TEMEL AYARLAR
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Hosting.com.tr'de hata gösterimi (geliştirme için)
ini_set('display_errors', 0); // Canlıda 0, testte 1 yapın
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// 2. TÜRKÇE KARAKTER DESTEĞİ
mb_internal_encoding('UTF-8');
date_default_timezone_set('Europe/Istanbul');

// 3. GÜVENLİK KONTROLLERİ
function securityCheck($data) {
    // Boş veri kontrolü
    if (empty($data)) {
        return ['success' => false, 'error' => 'Boş veri gönderildi'];
    }
    
    // Gerekli alanlar
    $required = ['email', 'yourName', 'orderId', 'gameTitle', 'giftFor', 'gamePrice'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            return ['success' => false, 'error' => $field . ' alanı boş olamaz'];
        }
    }
    
    // E-posta formatı kontrolü
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'error' => 'Geçersiz e-posta adresi'];
    }
    
    // XSS koruması
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $data[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        }
    }
    
    return ['success' => true, 'data' => $data];
}

// 4. JSON VERİ ALMA
$input = file_get_contents('php://input');
$rawData = json_decode($input, true);

// 5. GÜVENLİK KONTROLÜ
$securityResult = securityCheck($rawData);
if (!$securityResult['success']) {
    echo json_encode($securityResult);
    exit;
}

$data = $securityResult['data'];

// 6. E-POSTA İÇERİĞİ OLUŞTURMA (Hosting.com.tr için optimize)
function createEmailTemplate($data) {
    $orderId = $data['orderId'];
    $gameTitle = $data['gameTitle'];
    $giftFor = $data['giftFor'];
    $yourName = $data['yourName'];
    $gamePrice = $data['gamePrice'];
    $phone = $data['phone'] ?? '';
    $specialMessage = $data['specialMessage'] ?? '';
    
    return '<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pixwe Sipariş Onayı</title>
    <style>
        /* HOSTING.COM.TR UYUMLU STİLLER */
        body {
            font-family: Arial, sans-serif;
            background-color: #0f0b1c;
            margin: 0;
            padding: 20px;
            color: #ffffff;
            line-height: 1.6;
        }
        
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(26, 26, 44, 0.95);
            border: 4px solid #ff2d75;
        }
        
        .email-header {
            background: linear-gradient(135deg, #ff2d75 0%, #ff3b3b 100%);
            padding: 30px;
            text-align: center;
        }
        
        .email-logo {
            font-family: "Courier New", monospace;
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin: 0 0 10px 0;
            letter-spacing: 2px;
        }
        
        .email-content {
            padding: 30px;
        }
        
        .section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(255, 45, 117, 0.3);
        }
        
        .section-title {
            color: #ff2d75;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .info-label {
            color: #97ff7d;
            font-weight: bold;
        }
        
        .info-value {
            color: white;
        }
        
        .bank-card {
            background: rgba(255, 45, 117, 0.05);
            border: 2px solid rgba(255, 45, 117, 0.2);
            padding: 20px;
            margin: 20px 0;
        }
        
        .bank-row {
            display: flex;
            margin-bottom: 12px;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .bank-row:last-child {
            border-bottom: none;
        }
        
        .bank-label {
            color: #ff6b8b;
            font-weight: bold;
            min-width: 140px;
        }
        
        .bank-value {
            color: white;
            flex: 1;
            font-family: "Courier New", monospace;
            word-break: break-all;
        }
        
        .important-box {
            background: rgba(255, 59, 59, 0.1);
            border: 2px solid #ff3b3b;
            padding: 20px;
            margin: 25px 0;
        }
        
        .important-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .important-box li {
            margin-bottom: 8px;
        }
        
        .contact-section {
            text-align: center;
            margin-top: 30px;
            padding-top: 25px;
            border-top: 2px solid #ff2d75;
        }
        
        .whatsapp-btn {
            display: inline-block;
            background: #25D366;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            margin: 15px 0;
        }
        
        .email-footer {
            text-align: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            color: #8a8aa3;
            font-size: 14px;
        }
        
        /* MOBİL UYUMLU */
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .bank-row {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .bank-label {
                min-width: auto;
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- HEADER -->
        <div class="email-header">
            <div class="email-logo">PIXWE</div>
            <h1 style="color: white; margin: 10px 0; font-size: 24px;">SİPARİŞİNİZ ONAYLANDI! 🎮</h1>
            <p style="color: white; opacity: 0.9; font-size: 16px;">Sevgiliniz için özel oyununuz hazırlanıyor...</p>
        </div>
        
        <!-- CONTENT -->
        <div class="email-content">
            <!-- Sipariş Detayları -->
            <div class="section">
                <h2 class="section-title">📦 SİPARİŞ DETAYLARI</h2>
                <div class="info-grid">
                    <div class="info-label">Sipariş No:</div>
                    <div class="info-value">' . $orderId . '</div>
                    
                    <div class="info-label">Oyun:</div>
                    <div class="info-value">' . $gameTitle . '</div>
                    
                    <div class="info-label">Hediyesi:</div>
                    <div class="info-value">' . $giftFor . '</div>
                    
                    <div class="info-label">Sipariş Veren:</div>
                    <div class="info-value">' . $yourName . '</div>
                    
                    <div class="info-label">İletişim:</div>
                    <div class="info-value">' . $data['email'] . '</div>';
    
    if ($phone) {
        $template .= '<div class="info-label">Telefon:</div>
                      <div class="info-value">' . $phone . '</div>';
    }
    
    $template .= '<div class="info-label">Toplam Tutar:</div>
                  <div class="info-value">' . $gamePrice . '</div>
                </div>';
    
    if ($specialMessage) {
        $template .= '<div style="margin-top: 15px; padding: 15px; background: rgba(255, 255, 255, 0.05);">
                        <strong>Özel Mesajınız:</strong><br>
                        ' . $specialMessage . '
                      </div>';
    }
    
    $template .= '</div>
            
            <!-- Ödeme Bilgileri -->
            <div class="section">
                <h2 class="section-title">💰 ÖDEME BİLGİLERİ</h2>
                <p style="color: #97ff7d; margin-bottom: 15px;">Aşağıdaki banka bilgilerine EFT/havale yapabilirsiniz:</p>
                
                <div class="bank-card">
                    <div class="bank-row">
                        <span class="bank-label">BANKA:</span>
                        <span class="bank-value">İŞ BANKASI</span>
                    </div>
                    <div class="bank-row">
                        <span class="bank-label">ŞUBE:</span>
                        <span class="bank-value">ORTA ŞUBESİ (1234)</span>
                    </div>
                    <div class="bank-row">
                        <span class="bank-label">HESAP SAHİBİ:</span>
                        <span class="bank-value">PIXWE OYUN TASARIM</span>
                    </div>
                    <div class="bank-row">
                        <span class="bank-label">IBAN:</span>
                        <span class="bank-value">TR12 3456 7890 1234 5678 9012 34</span>
                    </div>
                    <div class="bank-row">
                        <span class="bank-label">AÇIKLAMA:</span>
                        <span class="bank-value">' . $yourName . ' - Oyun Siparişi (' . $orderId . ')</span>
                    </div>
                </div>
                
                <div class="important-box">
                    <h3 style="color: #ff3b3b; margin-top: 0;">⚠️ ÖNEMLİ UYARILAR</h3>
                    <ul style="color: white;">
                        <li>Lütfen <strong>IBAN numarasını doğru</strong> kopyalayın</li>
                        <li>Açıklama kısmına <strong>yukarıdaki açıklamayı</strong> yazın</li>
                        <li>Ödeme yaptıktan sonra <strong>dekontu WhatsApp\'tan gönderin</strong></li>
                        <li>Dekont aldıktan sonra <strong>24 saat içinde</strong> tasarıma başlayacağız</li>
                        <li>E-posta adresinize <strong>tasarım güncellemeleri</strong> göndereceğiz</li>
                    </ul>
                </div>
            </div>
            
            <!-- İletişim -->
            <div class="contact-section">
                <h2 class="section-title">📞 İLETİŞİM BİLGİLERİ</h2>
                
                <div style="margin: 20px 0;">
                    <p style="margin: 8px 0;"><strong>WhatsApp:</strong> +90 (538) 608 21 55</p>
                    <p style="margin: 8px 0;"><strong>E-posta:</strong> info@pixwe.com</p>
                    <p style="margin: 8px 0;"><strong>Web Sitesi:</strong> https://pixwe.com</p>
                </div>
                
                <a href="https://wa.me/905386082155?text=Merhaba!%20' . $orderId . '%20numara%CC%88lı%CC%87%20siparis%CC%27im%20ic%CC%A7in%20dekont%20go%CC%88nderiyorum." 
                   class="whatsapp-btn" 
                   target="_blank">
                    📱 WHATSAPP\'TAN DEKONT GÖNDER
                </a>
                
                <p style="margin-top: 20px; font-size: 14px; color: #97ff7d;">
                    WhatsApp mesajında otomatik olarak sipariş numaranız yazacaktır.
                </p>
            </div>
        </div>
        
        <!-- FOOTER -->
        <div class="email-footer">
            <p>© ' . date('Y') . ' PIXWE - Tüm hakları saklıdır.</p>
            <p>Orta Mahallesi, Sofoğlu Caddesi No:40, SAMSUN</p>
            <p style="font-size: 12px; margin-top: 10px;">
                Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
            </p>
        </div>
    </div>
</body>
</html>';
}

// 7. E-POSTA GÖNDERME FONKSİYONU (Hosting.com.tr için)
function sendEmail($to, $subject, $message) {
    // Hosting.com.tr mail() fonksiyonu için başlıklar
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: PIXWE <info@pixwe.com>\r\n";
    $headers .= "Reply-To: info@pixwe.com\r\n";
    $headers .= "Return-Path: info@pixwe.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "X-Priority: 1 (Highest)\r\n";
    $headers .= "X-MSMail-Priority: High\r\n";
    $headers .= "Importance: High\r\n";
    
    // Hosting.com.tr genelde bu şekilde çalışır
    return mail($to, $subject, $message, $headers);
}

// 8. SİPARİŞ KAYDETME FONKSİYONU
function saveOrder($data) {
    $orderData = [
        'order_id' => $data['orderId'],
        'customer_name' => $data['yourName'],
        'customer_email' => $data['email'],
        'customer_phone' => $data['phone'] ?? '',
        'game_title' => $data['gameTitle'],
        'gift_for' => $data['giftFor'],
        'price' => $data['gamePrice'],
        'special_message' => $data['specialMessage'] ?? '',
        'additional_notes' => $data['additionalNotes'] ?? '',
        'order_date' => date('Y-m-d H:i:s'),
        'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'status' => 'pending_payment'
    ];
    
    // JSON dosyasına kaydet
    $ordersFile = 'orders.json';
    $allOrders = [];
    
    // Mevcut siparişleri oku
    if (file_exists($ordersFile)) {
        $currentData = file_get_contents($ordersFile);
        if ($currentData !== false) {
            $allOrders = json_decode($currentData, true);
            if (!is_array($allOrders)) {
                $allOrders = [];
            }
        }
    }
    
    // Yeni siparişi ekle
    $allOrders[] = $orderData;
    
    // Hosting.com.tr'de dosya izinleri 644 olmalı
    $result = file_put_contents($ordersFile, json_encode($allOrders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    return $result !== false;
}

// 9. ANA İŞLEM
try {
    // E-posta içeriğini oluştur
    $emailContent = createEmailTemplate($data);
    $emailSubject = "PIXWE - Sipariş Onayı (#" . $data['orderId'] . ") - " . $data['gameTitle'];
    
    // E-postayı gönder
    $emailSent = sendEmail($data['email'], $emailSubject, $emailContent);
    
    // Siparişi kaydet
    $orderSaved = saveOrder($data);
    
    // Kendinize de bildirim gönder (opsiyonel)
    $adminEmail = "info@pixwe.com"; // Kendi e-postanız
    $adminSubject = "YENİ SİPARİŞ: " . $data['orderId'];
    $adminMessage = "Yeni sipariş alındı!\n\n";
    $adminMessage .= "Sipariş No: " . $data['orderId'] . "\n";
    $adminMessage .= "Müşteri: " . $data['yourName'] . "\n";
    $adminMessage .= "E-posta: " . $data['email'] . "\n";
    $adminMessage .= "Oyun: " . $data['gameTitle'] . "\n";
    $adminMessage .= "Tutar: " . $data['gamePrice'] . "\n";
    $adminMessage .= "Tarih: " . date('d.m.Y H:i:s');
    
    // Kendi e-postanıza bildirim gönder
    mail($adminEmail, $adminSubject, $adminMessage);
    
    // 10. YANIT HAZIRLAMA
    if ($emailSent && $orderSaved) {
        $response = [
            'success' => true,
            'message' => 'Siparişiniz başarıyla alındı! E-posta adresinize onay mesajı gönderildi.',
            'orderId' => $data['orderId'],
            'nextSteps' => [
                '1. Banka bilgilerine EFT/havale yapın',
                '2. Dekontu WhatsApp\'tan gönderin',
                '3. Tasarım süreci başlayacak'
            ],
            'contact' => [
                'whatsapp' => '+905386082155',
                'email' => 'info@pixwe.com'
            ]
        ];
    } elseif ($orderSaved) {
        // E-posta gönderilemedi ama sipariş kaydedildi
        $response = [
            'success' => true,
            'message' => 'Siparişiniz alındı! E-posta gönderilemedi, lütfen bizimle iletişime geçin.',
            'orderId' => $data['orderId'],
            'warning' => 'E-posta gönderilemedi, spam klasörünü kontrol edin veya bizimle iletişime geçin.'
        ];
    } else {
        // Hiçbir şey çalışmadı
        $response = [
            'success' => false,
            'error' => 'Teknik bir sorun oluştu. Lütfen WhatsApp\'tan iletişime geçin: +90 (538) 608 21 55',
            'orderId' => $data['orderId']
        ];
    }
    
    // 11. LOG KAYDI (Hosting.com.tr için)
    $logEntry = date('Y-m-d H:i:s') . " | ";
    $logEntry .= "Order: " . $data['orderId'] . " | ";
    $logEntry .= "Email: " . ($emailSent ? 'OK' : 'FAIL') . " | ";
    $logEntry .= "Save: " . ($orderSaved ? 'OK' : 'FAIL') . " | ";
    $logEntry .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
    
    // Log dosyasına yaz
    file_put_contents('order_log.txt', $logEntry, FILE_APPEND);
    
} catch (Exception $e) {
    // HATA DURUMU
    $response = [
        'success' => false,
        'error' => 'Sistem hatası: ' . $e->getMessage(),
        'contact' => 'Lütfen WhatsApp: +90 (538) 608 21 55'
    ];
    
    // Hata logu
    error_log("PIXWE Error: " . $e->getMessage() . " - Order: " . ($data['orderId'] ?? 'unknown'));
}

// 12. SONUÇU GÖNDER
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>