// gift-selection.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('Gift selection sayfası yüklendi');
    
    const gameCards = document.querySelectorAll('.selection-card');
    const selectionMessage = document.getElementById('selectionMessage');
    const personalizationForm = document.getElementById('personalizationForm');
    const proceedButton = document.getElementById('proceedToPayment');
    const backButton = document.querySelector('.btn-back');
    const stepCircles = document.querySelectorAll('.step-circle');
    const stepTexts = document.querySelectorAll('.step-text');
    
    console.log('Elementler:', {
        gameCards: gameCards.length,
        selectionMessage: !!selectionMessage,
        personalizationForm: !!personalizationForm,
        proceedButton: !!proceedButton,
        backButton: !!backButton
    });
    
    let selectedGame = null;
    
    // Oyun seçim işlevi - DÜZELTİLMİŞ
    gameCards.forEach(card => {
        // Kartın kendisine tıklama
        card.addEventListener('click', function(e) {
            console.log('Karta tıklandı:', this.getAttribute('data-game'));
            handleCardSelection(this);
        });
        
        // Seç butonuna tıklama
        const selectBtn = card.querySelector('.select-btn');
        if (selectBtn) {
            selectBtn.addEventListener('click', function(e) {
                console.log('Seç butonuna tıklandı');
                e.stopPropagation(); // Kart tıklamasını engelle
                handleCardSelection(card);
            });
        }
    });
    
    // Kart seçimi işlemini yöneten fonksiyon
    function handleCardSelection(card) {
        // Tüm kartlardan seçimi kaldır
        gameCards.forEach(c => {
            c.classList.remove('selected');
            const btn = c.querySelector('.select-btn');
            if (btn) {
                btn.textContent = 'SEÇ';
                btn.style.backgroundColor = ''; // Varsayılan rengi sıfırla
            }
        });
        
        // Bu kartı seç
        card.classList.add('selected');
        selectedGame = card.getAttribute('data-game');
        
        // Seç butonunu güncelle
        const selectBtn = card.querySelector('.select-btn');
        if (selectBtn) {
            selectBtn.textContent = '✓ SEÇİLDİ';
            selectBtn.style.backgroundColor = 'var(--accent-red)';
        }
        
        // Mesajı güncelle
        const gameTitle = card.querySelector('.card-title').textContent;
        selectionMessage.innerHTML = `
            <strong style="color: var(--primary-pink);">✓ SEÇİLDİ:</strong> 
            <span style="color: white;">"${gameTitle}"</span> oyununu seçtiniz!
            <br>Aşağıdaki formu doldurarak kişiselleştirmeye devam edebilirsiniz.
        `;
        
        // Formu göster
        personalizationForm.style.display = 'block';
        
        // Adım göstergesini güncelle
        updateStepIndicator(2);
        
        // Form alanına kaydır
        setTimeout(() => {
            personalizationForm.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }
    
    // Adım göstergesini güncelleme fonksiyonu
    function updateStepIndicator(step) {
        console.log('Adım güncelleniyor:', step);
        stepCircles.forEach((circle, index) => {
            if (index < step) {
                circle.classList.add('active');
                stepTexts[index].classList.add('active');
            } else {
                circle.classList.remove('active');
                stepTexts[index].classList.remove('active');
            }
        });
    }
    
    // Devam et butonu
    if (proceedButton) {
        proceedButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Devam et butonuna tıklandı');
            
            if (!selectedGame) {
                showAlert('Lütfen önce bir oyun seçin!', 'error');
                return;
            }
            
            // Form verilerini kontrol et
            const giftFor = document.getElementById('giftFor').value.trim();
            const yourName = document.getElementById('yourName').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!giftFor || !yourName || !email) {
                showAlert('Lütfen zorunlu alanları doldurun! (Kime, İsim, E-posta)', 'error');
                return;
            }
            
            // E-posta formatını kontrol et
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Lütfen geçerli bir e-posta adresi girin!', 'error');
                return;
            }
            
            // Tüm verileri topla
            const formData = {
                game: selectedGame,
                giftFor: giftFor,
                yourName: yourName,
                email: email,
                specialDate: document.getElementById('specialDate').value.trim(),
                specialStory: document.getElementById('specialStory').value.trim(),
                specialMessage: document.getElementById('specialMessage').value.trim()
            };
            
            console.log('Sipariş Bilgileri:', formData);
            
            // Başarılı mesajı göster
            showAlert('Bilgileriniz başarıyla alındı! Ödeme sayfasına yönlendiriliyorsunuz...', 'success');
            
            // 2 saniye sonra sipariş özetini göster
            setTimeout(() => {
                showOrderSummary(formData);
            }, 2000);
        });
    }
    
    // Geri dön butonu
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Geri dön butonuna tıklandı');
            
            // Tüm seçimleri temizle
            gameCards.forEach(c => {
                c.classList.remove('selected');
                const btn = c.querySelector('.select-btn');
                if (btn) {
                    btn.textContent = 'SEÇ';
                    btn.style.backgroundColor = '';
                }
            });
            selectedGame = null;
            
            // Mesajı sıfırla
            selectionMessage.innerHTML = 'Lütfen hediye etmek istediğiniz oyunu seçin';
            
            // Formu gizle
            personalizationForm.style.display = 'none';
            
            // Formu temizle
            document.getElementById('giftFor').value = '';
            document.getElementById('yourName').value = '';
            document.getElementById('specialDate').value = '';
            document.getElementById('email').value = '';
            document.getElementById('specialStory').value = '';
            document.getElementById('specialMessage').value = '';
            
            // Adım göstergesini güncelle
            updateStepIndicator(1);
            
            // Oyun seçim alanına kaydır
            setTimeout(() => {
                const gameSelection = document.getElementById('gameSelection');
                if (gameSelection) {
                    gameSelection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    }
    
    // Alert mesajı gösterimi
    function showAlert(message, type = 'info') {
        // Önceki alert'leri temizle
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `pixel-alert ${type}`;
        alertDiv.innerHTML = `
            <div class="pixel-alert-content">
                <span class="pixel-alert-text">${message}</span>
                <button class="pixel-alert-close">✕</button>
            </div>
        `;
        
        // Stil ekle
        const style = document.createElement('style');
        style.textContent = `
            .pixel-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--dark);
                border: 4px solid;
                padding: 15px;
                z-index: 9999;
                font-family: var(--font-body);
                color: white;
                min-width: 300px;
                max-width: 400px;
                animation: pixelAlertAppear 0.5s ease;
            }
            
            .pixel-alert.error {
                border-color: var(--accent-red);
                background-color: rgba(255, 59, 59, 0.1);
            }
            
            .pixel-alert.success {
                border-color: var(--primary-pink);
                background-color: rgba(255, 45, 117, 0.1);
            }
            
            .pixel-alert-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
            }
            
            .pixel-alert-text {
                font-size: 1rem;
                flex: 1;
            }
            
            .pixel-alert-close {
                background: transparent;
                color: white;
                border: 2px solid currentColor;
                width: 25px;
                height: 25px;
                cursor: pointer;
                font-family: var(--font-body);
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            
            .pixel-alert-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            @keyframes pixelAlertAppear {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(alertDiv);
        
        // Kapatma butonu
        const closeBtn = alertDiv.querySelector('.pixel-alert-close');
        closeBtn.addEventListener('click', () => {
            alertDiv.style.animation = 'pixelAlertAppear 0.5s ease reverse';
            setTimeout(() => alertDiv.remove(), 500);
        });
        
        // 5 saniye sonra otomatik kapan
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.animation = 'pixelAlertAppear 0.5s ease reverse';
                setTimeout(() => alertDiv.remove(), 500);
            }
        }, 5000);
    }
    
    // Var olan alert'leri temizle
    function removeExistingAlert() {
        const existingAlerts = document.querySelectorAll('.pixel-alert');
        existingAlerts.forEach(alert => alert.remove());
    }
    
    // Sipariş özeti gösterimi
    function showOrderSummary(data) {
        const gameCard = document.querySelector(`.selection-card[data-game="${data.game}"]`);
        if (!gameCard) {
            console.error('Oyun kartı bulunamadı:', data.game);
            return;
        }
        
        const gameTitle = gameCard.querySelector('.card-title').textContent;
        const gamePrice = gameCard.querySelector('.card-price').textContent;
        
        const summaryHTML = `
            <div class="order-summary-content">
                <h3 class="summary-title">SİPARİŞ ÖZETİ</h3>
                <div class="summary-item">
                    <strong>Oyun:</strong> ${gameTitle}
                </div>
                <div class="summary-item">
                    <strong>Hediyesi:</strong> ${data.giftFor}
                </div>
                <div class="summary-item">
                    <strong>Sipariş Veren:</strong> ${data.yourName}
                </div>
                <div class="summary-item">
                    <strong>İletişim:</strong> ${data.email}
                </div>
                <div class="summary-item">
                    <strong>Fiyat:</strong> ${gamePrice}
                </div>
                ${data.specialDate ? `<div class="summary-item"><strong>Özel Tarih:</strong> ${data.specialDate}</div>` : ''}
                <div class="summary-note">
                    <p>Ödeme işlemi tamamlandıktan sonra tasarım sürecine başlayacağız.</p>
                    <p>E-posta adresinize onay mesajı gönderilecektir.</p>
                </div>
            </div>
        `;
        
        // Modal oluştur veya güncelle
        let modal = document.querySelector('.order-summary-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'order-summary-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            `;
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = summaryHTML + `
            <div class="summary-buttons">
                <button id="closeModal" class="pixel-btn">KAPAT</button>
                <button id="confirmOrder" class="pixel-btn confirm-btn">SİPARİŞİ ONAYLA</button>
            </div>
        `;
        
        // Stil ekle
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .order-summary-modal {
                animation: modalFadeIn 0.3s ease;
            }
            
            .order-summary-content {
                background: rgba(26, 26, 44, 0.95);
                padding: 30px;
                border: 4px solid var(--primary-pink);
                color: white;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 0 40px rgba(255, 45, 117, 0.3);
            }
            
            .summary-title {
                color: var(--primary-pink);
                text-align: center;
                margin-bottom: 25px;
                font-family: var(--font-heading);
                font-size: 1.3rem;
                text-transform: uppercase;
            }
            
            .summary-item {
                margin-bottom: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 1.1rem;
            }
            
            .summary-item strong {
                color: var(--light-pink);
                display: inline-block;
                min-width: 120px;
            }
            
            .summary-note {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 2px solid var(--primary-pink);
                color: var(--light-pink);
                font-size: 0.95rem;
                text-align: center;
            }
            
            .summary-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 25px;
                flex-wrap: wrap;
            }
            
            .confirm-btn {
                background: var(--accent-red) !important;
            }
            
            .confirm-btn:hover {
                background: var(--primary-pink) !important;
            }
            
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    backdrop-filter: blur(0);
                }
                to {
                    opacity: 1;
                    backdrop-filter: blur(10px);
                }
            }
        `;
        
        if (!document.querySelector('#modalStyle')) {
            modalStyle.id = 'modalStyle';
            document.head.appendChild(modalStyle);
        }
        
        modal.style.display = 'flex';
        
        // Modal kapatma butonu
        document.getElementById('closeModal').addEventListener('click', function() {
            modal.style.animation = 'modalFadeIn 0.3s ease reverse';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        // Onay butonu
        document.getElementById('confirmOrder').addEventListener('click', function() {
            showAlert('Siparişiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.', 'success');
            
            // Butonu devre dışı bırak
            this.disabled = true;
            this.textContent = '✓ ONAYLANDI';
            
            // Modalı kapat
            setTimeout(() => {
                modal.style.animation = 'modalFadeIn 0.3s ease reverse';
                setTimeout(() => {
                    modal.style.display = 'none';
                    
                    // Ana sayfaya yönlendir
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 300);
            }, 1500);
        });
        
        // Modal dışına tıklayınca kapat
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.animation = 'modalFadeIn 0.3s ease reverse';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Sayfa yüklendiğinde adım göstergesini ayarla
    updateStepIndicator(1);
    
    // Konsol log'ları için
    console.log('Gift selection JavaScript başarıyla yüklendi');
});
// gift-selection.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('Gift selection sayfası yüklendi');
    
    const gameCards = document.querySelectorAll('.selection-card');
    const selectionMessage = document.getElementById('selectionMessage');
    const personalizationForm = document.getElementById('personalizationForm');
    const proceedButton = document.getElementById('proceedToPayment');
    const backButton = document.querySelector('.btn-back');
    const stepCircles = document.querySelectorAll('.step-circle');
    const stepTexts = document.querySelectorAll('.step-text');
    
    // Oyunlara özel soru bölümleri
    const strestmatikQuestions = document.getElementById('strestmatikQuestions');
    const sevgililerGunuQuestions = document.getElementById('sevgililerGunuQuestions');
    const yildonumuQuestions = document.getElementById('yildonumuQuestions');
    
    let selectedGame = null;
    
    // Oyun soruları veritabanı
    const gameQuestions = {
        'strestmatik-sevgilim': {
            id: 'strestmatikQuestions',
            title: 'STRESTMATİK SEVGİLİM',
            questions: [
                {
                    id: 'firstMeetingDate',
                    label: 'İLK BULUŞMA TARİHİNİZ',
                    placeholder: 'Örn: 14 Şubat 2023',
                    type: 'text'
                },
                {
                    id: 'meetingPlace',
                    label: 'İLK NEREDE BULUŞTUNUZ?',
                    placeholder: 'Örn: Starbucks, park, sinema...',
                    type: 'text'
                },
                {
                    id: 'firstImpression',
                    label: 'İLK İZLENİMİNİZ NASILDI?',
                    placeholder: 'Onu ilk gördüğünüzde ne düşündünüz?...',
                    type: 'textarea'
                },
                {
                    id: 'firstConversation',
                    label: 'İLK NELER KONUŞTUNUZ?',
                    placeholder: 'Hatırladığınız ilk konuşmalarınız...',
                    type: 'textarea'
                }
            ]
        },
        'sevgililer-gunu': {
            id: 'sevgililerGunuQuestions',
            title: 'SEVGİLİLER GÜNÜ SÜRPRİZİ',
            questions: [
                {
                    id: 'favoriteGift',
                    label: 'EN SEVDİĞİ HEDİYE NEDİR?',
                    placeholder: 'Örn: çikolata, çiçek, mücevher...',
                    type: 'text'
                },
                {
                    id: 'romanticMemory',
                    label: 'EN ROMANTİK ANINIZ?',
                    placeholder: 'Birlikte yaşadığınız en romantik anı...',
                    type: 'textarea'
                },
                {
                    id: 'surpriseIdeas',
                    label: 'DAHA ÖNCE YAPTIĞINIZ SÜRPRİZLER',
                    placeholder: 'Onu şaşırtmak için yaptığınız şeyler...',
                    type: 'textarea'
                },
                {
                    id: 'valentineWish',
                    label: 'BU SEVGİLİLER GÜNÜ İÇİN DİLEĞİNİZ',
                    placeholder: 'Bu özel gün için dilekleriniz...',
                    type: 'textarea'
                }
            ]
        },
        'yildonumu-macerasi': {
            id: 'yildonumuQuestions',
            title: 'YILDÖNÜMÜ MACERASI',
            questions: [
                {
                    id: 'anniversaryDate',
                    label: 'YILDÖNÜMÜ TARİHİNİZ',
                    placeholder: 'Örn: 1 yıl, 2 yıl, evlilik yıldönümü...',
                    type: 'text'
                },
                {
                    id: 'specialMemories',
                    label: 'ÖZEL ANILARINIZ',
                    placeholder: 'Birlikte yaşadığınız en özel 3 anı...',
                    type: 'textarea'
                },
                {
                    id: 'insideJokes',
                    label: 'ARANIZDAKİ ESPRİLER / İÇ ŞAKALAR',
                    placeholder: 'Sadece sizin anladığınız şakalar, kelimeler...',
                    type: 'textarea'
                },
                {
                    id: 'futureDreams',
                    label: 'GELECEK HAYALLERİNİZ',
                    placeholder: 'Birlikte gerçekleştirmek istediğiniz hayaller...',
                    type: 'textarea'
                }
            ]
        }
    };
    
    // Oyun seçim işlevi
    gameCards.forEach(card => {
        // Kartın kendisine tıklama
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('select-btn') || e.target.closest('.select-btn')) {
                return; // Seç butonu kendi event'ini yönetecek
            }
            handleCardSelection(this);
        });
        
        // Seç butonuna tıklama
        const selectBtn = card.querySelector('.select-btn');
        if (selectBtn) {
            selectBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                handleCardSelection(card);
            });
        }
    });
    
    // Kart seçimi işlemini yöneten fonksiyon
    function handleCardSelection(card) {
        // Tüm kartlardan seçimi kaldır
        gameCards.forEach(c => {
            c.classList.remove('selected');
            const btn = c.querySelector('.select-btn');
            if (btn) {
                btn.textContent = 'SEÇ';
                btn.style.backgroundColor = '';
            }
        });
        
        // Bu kartı seç
        card.classList.add('selected');
        selectedGame = card.getAttribute('data-game');
        
        // Seç butonunu güncelle
        const selectBtn = card.querySelector('.select-btn');
        if (selectBtn) {
            selectBtn.textContent = '✓ SEÇİLDİ';
            selectBtn.style.backgroundColor = 'var(--accent-red)';
        }
        
        // Mesajı güncelle
        const gameTitle = card.querySelector('.card-title').textContent;
        selectionMessage.innerHTML = `
            <strong style="color: var(--primary-pink);">✓ SEÇİLDİ:</strong> 
            <span style="color: white;">"${gameTitle}"</span> oyununu seçtiniz!
            <br>Aşağıdaki formu doldurarak kişiselleştirmeye devam edebilirsiniz.
        `;
        
        // Oyunlara özel soruları göster/gizle
        showGameSpecificQuestions(selectedGame);
        
        // Formu göster
        personalizationForm.style.display = 'block';
        
        // Adım göstergesini güncelle
        updateStepIndicator(2);
        
        // Form alanına kaydır
        setTimeout(() => {
            personalizationForm.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }
    
    // Oyunlara özel soruları göster/gizle fonksiyonu
    function showGameSpecificQuestions(gameId) {
        console.log('Seçilen oyun:', gameId);
        
        // Tüm oyun soru bölümlerini gizle
        const allQuestionSections = document.querySelectorAll('.game-questions');
        allQuestionSections.forEach(section => {
            section.style.display = 'none';
            // İçeriği temizle
            const inputs = section.querySelectorAll('input, textarea');
            inputs.forEach(input => input.value = '');
        });
        
        // Seçilen oyunun sorularını göster
        if (gameQuestions[gameId]) {
            const questionSection = document.getElementById(gameQuestions[gameId].id);
            if (questionSection) {
                questionSection.style.display = 'block';
                console.log('Soru bölümü gösterildi:', gameQuestions[gameId].title);
            } else {
                console.error('Soru bölümü bulunamadı:', gameQuestions[gameId].id);
            }
        } else {
            console.error('Oyun bilgisi bulunamadı:', gameId);
        }
    }
    
    // Adım göstergesini güncelleme fonksiyonu
    function updateStepIndicator(step) {
        stepCircles.forEach((circle, index) => {
            if (index < step) {
                circle.classList.add('active');
                stepTexts[index].classList.add('active');
            } else {
                circle.classList.remove('active');
                stepTexts[index].classList.remove('active');
            }
        });
    }
    
    // Devam et butonu
    if (proceedButton) {
        proceedButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!selectedGame) {
                showAlert('Lütfen önce bir oyun seçin!', 'error');
                return;
            }
            
            // Temel bilgileri kontrol et
            const giftFor = document.getElementById('giftFor').value.trim();
            const yourName = document.getElementById('yourName').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!giftFor || !yourName || !email) {
                showAlert('Lütfen zorunlu alanları doldurun! (Kime, İsim, E-posta)', 'error');
                return;
            }
            
            // E-posta formatını kontrol et
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Lütfen geçerli bir e-posta adresi girin!', 'error');
                return;
            }
            
            // Seçilen oyuna özel verileri topla
            const gameData = collectGameSpecificData(selectedGame);
            
            // Tüm verileri topla
            const formData = {
                game: selectedGame,
                gameTitle: document.querySelector(`.selection-card[data-game="${selectedGame}"] .card-title`).textContent,
                giftFor: giftFor,
                yourName: yourName,
                email: email,
                phone: document.getElementById('phone').value.trim(),
                specialMessage: document.getElementById('specialMessage').value.trim(),
                additionalNotes: document.getElementById('additionalNotes').value.trim(),
                gameSpecificData: gameData
            };
            
            console.log('Sipariş Bilgileri:', formData);
            
            // Başarılı mesajı göster
            showAlert('Bilgileriniz başarıyla alındı! Ödeme sayfasına yönlendiriliyorsunuz...', 'success');
            
            // 2 saniye sonra sipariş özetini göster
            setTimeout(() => {
                showOrderSummary(formData);
            }, 2000);
        });
    }
    
    // Oyunlara özel verileri topla
    function collectGameSpecificData(gameId) {
        const data = {};
        
        if (gameQuestions[gameId]) {
            gameQuestions[gameId].questions.forEach(question => {
                const element = document.getElementById(question.id);
                if (element) {
                    data[question.id] = element.value.trim();
                }
            });
        }
        
        return data;
    }
    
    // Geri dön butonu
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Tüm seçimleri temizle
            gameCards.forEach(c => {
                c.classList.remove('selected');
                const btn = c.querySelector('.select-btn');
                if (btn) {
                    btn.textContent = 'SEÇ';
                    btn.style.backgroundColor = '';
                }
            });
            selectedGame = null;
            
            // Mesajı sıfırla
            selectionMessage.innerHTML = 'Lütfen hediye etmek istediğiniz oyunu seçin';
            
            // Tüm form alanlarını temizle
            clearAllFormFields();
            
            // Tüm oyun sorularını gizle
            const allQuestionSections = document.querySelectorAll('.game-questions');
            allQuestionSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Formu gizle
            personalizationForm.style.display = 'none';
            
            // Adım göstergesini güncelle
            updateStepIndicator(1);
            
            // Oyun seçim alanına kaydır
            setTimeout(() => {
                const gameSelection = document.getElementById('gameSelection');
                if (gameSelection) {
                    gameSelection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    }
    
    // Tüm form alanlarını temizle
    function clearAllFormFields() {
        const formElements = document.querySelectorAll('#personalizationForm input, #personalizationForm textarea');
        formElements.forEach(element => {
            element.value = '';
        });
    }
    
    // Alert mesajı gösterimi
    function showAlert(message, type = 'info') {
        // Önceki alert'leri temizle
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `pixel-alert ${type}`;
        alertDiv.innerHTML = `
            <div class="pixel-alert-content">
                <span class="pixel-alert-text">${message}</span>
                <button class="pixel-alert-close">✕</button>
            </div>
        `;
        
        // Stil ekle
        if (!document.querySelector('#alertStyle')) {
            const style = document.createElement('style');
            style.id = 'alertStyle';
            style.textContent = `
                .pixel-alert {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: var(--dark);
                    border: 4px solid;
                    padding: 15px;
                    z-index: 9999;
                    font-family: var(--font-body);
                    color: white;
                    min-width: 300px;
                    max-width: 400px;
                    animation: pixelAlertAppear 0.5s ease;
                }
                
                .pixel-alert.error {
                    border-color: var(--accent-red);
                    background-color: rgba(255, 59, 59, 0.1);
                }
                
                .pixel-alert.success {
                    border-color: var(--primary-pink);
                    background-color: rgba(255, 45, 117, 0.1);
                }
                
                .pixel-alert-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                }
                
                .pixel-alert-text {
                    font-size: 1rem;
                    flex: 1;
                }
                
                .pixel-alert-close {
                    background: transparent;
                    color: white;
                    border: 2px solid currentColor;
                    width: 25px;
                    height: 25px;
                    cursor: pointer;
                    font-family: var(--font-body);
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .pixel-alert-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                @keyframes pixelAlertAppear {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(alertDiv);
        
        // Kapatma butonu
        const closeBtn = alertDiv.querySelector('.pixel-alert-close');
        closeBtn.addEventListener('click', () => {
            alertDiv.style.animation = 'pixelAlertAppear 0.5s ease reverse';
            setTimeout(() => alertDiv.remove(), 500);
        });
        
        // 5 saniye sonra otomatik kapan
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.animation = 'pixelAlertAppear 0.5s ease reverse';
                setTimeout(() => alertDiv.remove(), 500);
            }
        }, 5000);
    }
    
    // Var olan alert'leri temizle
    function removeExistingAlert() {
        const existingAlerts = document.querySelectorAll('.pixel-alert');
        existingAlerts.forEach(alert => alert.remove());
    }
    
    // Sipariş özeti gösterimi - GÜNCELLENMİŞ
    function showOrderSummary(data) {
        const gameCard = document.querySelector(`.selection-card[data-game="${data.game}"]`);
        if (!gameCard) {
            console.error('Oyun kartı bulunamadı:', data.game);
            return;
        }
        
        const gameTitle = gameCard.querySelector('.card-title').textContent;
        const gamePrice = gameCard.querySelector('.card-price').textContent;
        
        // Oyunlara özel verileri formatla
        let gameSpecificHTML = '';
        if (data.gameSpecificData && Object.keys(data.gameSpecificData).length > 0) {
            gameSpecificHTML = '<div class="summary-section"><strong style="color: var(--primary-pink);">Özel Cevaplarınız:</strong>';
            
            // Soruları bul
            if (gameQuestions[data.game]) {
                gameQuestions[data.game].questions.forEach(question => {
                    const answer = data.gameSpecificData[question.id];
                    if (answer) {
                        gameSpecificHTML += `
                            <div class="summary-answer">
                                <strong>${question.label}:</strong> ${answer}
                            </div>
                        `;
                    }
                });
            }
            
            gameSpecificHTML += '</div>';
        }
        
        const summaryHTML = `
            <div class="order-summary-content">
                <h3 class="summary-title">SİPARİŞ ÖZETİ</h3>
                <div class="summary-item">
                    <strong>Oyun:</strong> ${gameTitle}
                </div>
                <div class="summary-item">
                    <strong>Hediyesi:</strong> ${data.giftFor}
                </div>
                <div class="summary-item">
                    <strong>Sipariş Veren:</strong> ${data.yourName}
                </div>
                <div class="summary-item">
                    <strong>İletişim:</strong> ${data.email}
                </div>
                ${data.phone ? `<div class="summary-item"><strong>Telefon:</strong> ${data.phone}</div>` : ''}
                <div class="summary-item">
                    <strong>Fiyat:</strong> ${gamePrice}
                </div>
                ${data.specialMessage ? `<div class="summary-item"><strong>Özel Mesaj:</strong> ${data.specialMessage}</div>` : ''}
                ${gameSpecificHTML}
                <div class="summary-note">
                    <p>Ödeme işlemi tamamlandıktan sonra tasarım sürecine başlayacağız.</p>
                    <p>E-posta adresinize onay mesajı gönderilecektir.</p>
                </div>
            </div>
        `;
        
        // Modal oluştur veya güncelle
        let modal = document.querySelector('.order-summary-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'order-summary-modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = summaryHTML + `
            <div class="summary-buttons">
                <button id="closeModal" class="pixel-btn">DÜZENLE</button>
                <button id="confirmOrder" class="pixel-btn confirm-btn">SİPARİŞİ ONAYLA</button>
            </div>
        `;
        
        // Modal stilleri
        if (!document.querySelector('#modalStyle')) {
            const modalStyle = document.createElement('style');
            modalStyle.id = 'modalStyle';
            modalStyle.textContent = `
                .order-summary-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                    animation: modalFadeIn 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .order-summary-content {
                    background: rgba(26, 26, 44, 0.95);
                    padding: 30px;
                    border: 4px solid var(--primary-pink);
                    color: white;
                    max-width: 600px;
                    width: 100%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 0 40px rgba(255, 45, 117, 0.3);
                }
                
                .summary-title {
                    color: var(--primary-pink);
                    text-align: center;
                    margin-bottom: 25px;
                    font-family: var(--font-heading);
                    font-size: 1.3rem;
                    text-transform: uppercase;
                }
                
                .summary-item {
                    margin-bottom: 12px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    font-size: 1.1rem;
                }
                
                .summary-item strong {
                    color: var(--light-pink);
                    display: inline-block;
                    min-width: 140px;
                }
                
                .summary-section {
                    margin: 20px 0;
                    padding: 15px;
                    background: rgba(255, 45, 117, 0.05);
                    border: 1px solid rgba(255, 45, 117, 0.2);
                }
                
                .summary-answer {
                    margin-top: 10px;
                    padding-left: 15px;
                    border-left: 3px solid var(--primary-pink);
                }
                
                .summary-answer strong {
                    color: var(--secondary-pink);
                    min-width: auto;
                    margin-right: 10px;
                }
                
                .summary-note {
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 2px solid var(--primary-pink);
                    color: var(--light-pink);
                    font-size: 0.95rem;
                    text-align: center;
                }
                
                .summary-buttons {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 25px;
                    flex-wrap: wrap;
                }
                
                .confirm-btn {
                    background: var(--accent-red) !important;
                }
                
                .confirm-btn:hover {
                    background: var(--primary-pink) !important;
                }
                
                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(modalStyle);
        }
        
        modal.style.display = 'flex';
        
        // Düzenle butonu (modalı kapat)
        document.getElementById('closeModal').addEventListener('click', function() {
            modal.style.animation = 'modalFadeIn 0.3s ease reverse';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        // Onay butonu
        document.getElementById('confirmOrder').addEventListener('click', function() {
            showAlert('Siparişiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.', 'success');
            
            // Butonu devre dışı bırak
            this.disabled = true;
            this.textContent = '✓ ONAYLANDI';
            
            // 2 saniye sonra ana sayfaya yönlendir
            setTimeout(() => {
                modal.style.animation = 'modalFadeIn 0.3s ease reverse';
                setTimeout(() => {
                    modal.style.display = 'none';
                    window.location.href = 'index.html';
                }, 300);
            }, 2000);
        });
        
        // Modal dışına tıklayınca kapat
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.animation = 'modalFadeIn 0.3s ease reverse';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Sayfa yüklendiğinde adım göstergesini ayarla
    updateStepIndicator(1);
    
    console.log('Gift selection JavaScript başarıyla yüklendi');
});
// Shopier Entegrasyonu
function integrateWithShopier(orderData) {
    // Shopier API entegrasyonu
    const shopierData = {
        name: orderData.yourName,
        surname: orderData.yourName.split(' ')[1] || '',
        email: orderData.email,
        phone: orderData.phone || '',
        order_id: generateOrderId(),
        product_name: orderData.gameTitle,
        product_price: extractPrice(orderData.gamePrice),
        buyer_id: generateBuyerId(orderData.email),
        quantity: 1,
        billing_address: 'Özel Oyun Siparişi',
        shipping_address: 'Dijital Ürün',
        currency: 'TRY',
        callback_url: 'https://pixwe.com/order-success',
        error_url: 'https://pixwe.com/order-error'
    };
    
    // Shopier API çağrısı
    fetch('https://api.shopier.com/v1/orders/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_SHOPIER_API_KEY'
        },
        body: JSON.stringify(shopierData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.payment_url) {
            // Kullanıcıyı Shopier ödeme sayfasına yönlendir
            window.location.href = data.payment_url;
        }
    })
    .catch(error => {
        console.error('Shopier hatası:', error);
        showAlert('Ödeme sistemi geçici olarak hizmet veremiyor. Lütfen banka havalesi ile devam edin.', 'error');
    });
}

function generateOrderId() {
    return 'PIX' + Date.now() + Math.floor(Math.random() * 1000);
}

function extractPrice(priceText) {
    // "₺299" -> 299
    return parseInt(priceText.replace('₺', '').replace(',', ''));
}

function generateBuyerId(email) {
    // E-postadan hash oluştur
    return 'BUYER_' + btoa(email).substring(0, 10);
}
// gift-selection.js - GÜNCELLENMİŞ VE BASİTLEŞTİRİLMİŞ

document.addEventListener('DOMContentLoaded', function() {
    console.log('Gift selection sayfası yüklendi');
    
    const gameCards = document.querySelectorAll('.selection-card');
    const selectionMessage = document.getElementById('selectionMessage');
    const personalizationForm = document.getElementById('personalizationForm');
    const proceedButton = document.getElementById('proceedToPayment');
    const backButton = document.querySelector('.btn-back');
    const stepCircles = document.querySelectorAll('.step-circle');
    const stepTexts = document.querySelectorAll('.step-text');
    
    let selectedGame = null;
    
    // Oyun seçim işlevi
    gameCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('select-btn') || e.target.closest('.select-btn')) {
                return;
            }
            handleCardSelection(this);
        });
        
        const selectBtn = card.querySelector('.select-btn');
        if (selectBtn) {
            selectBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                handleCardSelection(card);
            });
        }
    });
    
    function handleCardSelection(card) {
        gameCards.forEach(c => {
            c.classList.remove('selected');
            const btn = c.querySelector('.select-btn');
            if (btn) {
                btn.textContent = 'SEÇ';
                btn.style.backgroundColor = '';
            }
        });
        
        card.classList.add('selected');
        selectedGame = card.getAttribute('data-game');
        
        const selectBtn = card.querySelector('.select-btn');
        if (selectBtn) {
            selectBtn.textContent = '✓ SEÇİLDİ';
            selectBtn.style.backgroundColor = 'var(--accent-red)';
        }
        
        const gameTitle = card.querySelector('.card-title').textContent;
        selectionMessage.innerHTML = `
            <strong style="color: var(--primary-pink);">✓ SEÇİLDİ:</strong> 
            <span style="color: white;">"${gameTitle}"</span> oyununu seçtiniz!
            <br>Aşağıdaki formu doldurarak kişiselleştirmeye devam edebilirsiniz.
        `;
        
        personalizationForm.style.display = 'block';
        updateStepIndicator(2);
        
        setTimeout(() => {
            personalizationForm.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }
    
    function updateStepIndicator(step) {
        stepCircles.forEach((circle, index) => {
            if (index < step) {
                circle.classList.add('active');
                stepTexts[index].classList.add('active');
            } else {
                circle.classList.remove('active');
                stepTexts[index].classList.remove('active');
            }
        });
    }
    
    // Devam et butonu - BASİTLEŞTİRİLDİ
    if (proceedButton) {
        proceedButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!selectedGame) {
                showAlert('Lütfen önce bir oyun seçin!', 'error');
                return;
            }
            
            // Form kontrolü
            const giftFor = document.getElementById('giftFor').value.trim();
            const yourName = document.getElementById('yourName').value.trim();
            const email = document.getElementById('email').value.trim();
            
            if (!giftFor || !yourName || !email) {
                showAlert('Lütfen zorunlu alanları doldurun! (Kime, İsim, E-posta)', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Lütfen geçerli bir e-posta adresi girin!', 'error');
                return;
            }
            
            // Verileri topla
            const formData = {
                game: selectedGame,
                gameTitle: document.querySelector(`.selection-card[data-game="${selectedGame}"] .card-title`).textContent,
                gamePrice: document.querySelector(`.selection-card[data-game="${selectedGame}"] .card-price`).textContent,
                giftFor: giftFor,
                yourName: yourName,
                email: email,
                phone: document.getElementById('phone').value.trim(),
                specialMessage: document.getElementById('specialMessage').value.trim(),
                additionalNotes: document.getElementById('additionalNotes').value.trim(),
                orderDate: new Date().toLocaleString('tr-TR'),
                orderId: generateOrderId()
            };
            
            console.log('Sipariş Bilgileri:', formData);
            
            // Sipariş özetini göster
            showOrderSummary(formData);
        });
    }
    
    function generateOrderId() {
        return 'PIX' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);
    }
    
    function extractPrice(priceText) {
        return parseInt(priceText.replace('₺', '').replace(',', '')) || 0;
    }
    
    // Geri dön butonu
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            gameCards.forEach(c => {
                c.classList.remove('selected');
                const btn = c.querySelector('.select-btn');
                if (btn) {
                    btn.textContent = 'SEÇ';
                    btn.style.backgroundColor = '';
                }
            });
            selectedGame = null;
            
            selectionMessage.innerHTML = 'Lütfen hediye etmek istediğiniz oyunu seçin';
            clearAllFormFields();
            personalizationForm.style.display = 'none';
            updateStepIndicator(1);
            
            setTimeout(() => {
                const gameSelection = document.getElementById('gameSelection');
                if (gameSelection) {
                    gameSelection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    }
    
    function clearAllFormFields() {
        document.querySelectorAll('#personalizationForm input, #personalizationForm textarea').forEach(el => {
            el.value = '';
        });
    }
    
    function showAlert(message, type = 'info') {
        removeExistingAlert();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `pixel-alert ${type}`;
        alertDiv.innerHTML = `
            <div class="pixel-alert-content">
                <span class="pixel-alert-text">${message}</span>
                <button class="pixel-alert-close">✕</button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        const closeBtn = alertDiv.querySelector('.pixel-alert-close');
        closeBtn.addEventListener('click', () => {
            alertDiv.remove();
        });
        
        setTimeout(() => {
            if (alertDiv.parentNode) alertDiv.remove();
        }, 5000);
    }
    
    function removeExistingAlert() {
        document.querySelectorAll('.pixel-alert').forEach(alert => alert.remove());
    }
    
    // SİPARİŞ ÖZETİ GÖSTERİMİ - GÜNCELLENMİŞ (Sadece Banka)
    function showOrderSummary(data) {
        const gameCard = document.querySelector(`.selection-card[data-game="${data.game}"]`);
        if (!gameCard) return;
        
        const gameTitle = gameCard.querySelector('.card-title').textContent;
        const gamePrice = gameCard.querySelector('.card-price').textContent;
        
        const summaryHTML = `
            <div class="order-summary-content">
                <h3 class="summary-title">SİPARİŞ ÖZETİ</h3>
                
                <div class="summary-item">
                    <strong>Sipariş No:</strong> ${data.orderId}
                </div>
                <div class="summary-item">
                    <strong>Oyun:</strong> ${gameTitle}
                </div>
                <div class="summary-item">
                    <strong>Hediyesi:</strong> ${data.giftFor}
                </div>
                <div class="summary-item">
                    <strong>Sipariş Veren:</strong> ${data.yourName}
                </div>
                <div class="summary-item">
                    <strong>İletişim:</strong> ${data.email}
                </div>
                ${data.phone ? `<div class="summary-item"><strong>Telefon:</strong> ${data.phone}</div>` : ''}
                <div class="summary-item">
                    <strong>Toplam Tutar:</strong> ${gamePrice}
                </div>
                
                <div class="payment-instruction">
                    <h4><i class="fas fa-university"></i> ÖDEME YÖNERGESİ</h4>
                    <p>Aşağıdaki banka bilgilerine havale/EFT yaparak ödemenizi tamamlayabilirsiniz.</p>
                    
                    <div class="bank-info-card">
                        <div class="bank-info-row">
                            <span class="bank-label">BANKA ADI:</span>
                            <span class="bank-value">İŞ BANKASI</span>
                        </div>
                        <div class="bank-info-row">
                            <span class="bank-label">ŞUBE ADI:</span>
                            <span class="bank-value">ORTA ŞUBESİ</span>
                        </div>
                        <div class="bank-info-row">
                            <span class="bank-label">HESAP SAHİBİ:</span>
                            <span class="bank-value">PIXWE OYUN TASARIM</span>
                        </div>
                        <div class="bank-info-row">
                            <span class="bank-label">IBAN:</span>
                            <span class="bank-value">TR12 3456 7890 1234 5678 9012 34</span>
                            <button class="copy-btn" data-text="TR12 3456 7890 1234 5678 9012 34">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="bank-info-row">
                            <span class="bank-label">AÇIKLAMA:</span>
                            <span class="bank-value">${data.yourName} - Oyun Siparişi (${data.orderId})</span>
                            <button class="copy-btn" data-text="${data.yourName} - Oyun Siparişi (${data.orderId})">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="important-note">
                        <p><strong>ÖNEMLİ:</strong></p>
                        <p>1. Ödeme yaptıktan sonra dekontunuzu WhatsApp veya e-posta ile bize iletin.</p>
                        <p>2. Ödeme onaylandıktan sonra oyun tasarım sürecine başlayacağız.</p>
                        <p>3. E-posta adresinize tasarım güncellemeleri gönderilecektir.</p>
                        <br>
                        <p><strong>WhatsApp:</strong> +90 (538) 608 21 55</p>
                        <p><strong>E-posta:</strong> info@pixwe.com</p>
                    </div>
                </div>
                
                <div class="summary-buttons">
                    <button id="closeModal" class="pixel-btn">KAPAT</button>
                    <button id="sendEmail" class="pixel-btn confirm-btn">
                        <i class="fas fa-envelope"></i> BİLGİLERİ E-POSTA İLE GÖNDER
                    </button>
                </div>
            </div>
        `;
        
        let modal = document.querySelector('.order-summary-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'order-summary-modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = summaryHTML;
        modal.style.display = 'flex';
        
        // Kopyala butonları
        modal.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.getAttribute('data-text');
                navigator.clipboard.writeText(text).then(() => {
                    const icon = this.querySelector('i');
                    const originalClass = icon.className;
                    icon.className = 'fas fa-check';
                    
                    setTimeout(() => {
                        icon.className = originalClass;
                    }, 2000);
                });
            });
        });
        
        // E-posta gönder butonu
        modal.querySelector('#sendEmail').addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GÖNDERİLİYOR...';
            
            // E-posta gönderim simülasyonu
            setTimeout(() => {
                showAlert('Sipariş bilgileriniz e-posta adresinize gönderildi!', 'success');
                this.innerHTML = '<i class="fas fa-check"></i> GÖNDERİLDİ';
                
                // 3 saniye sonra ana sayfaya yönlendir
                setTimeout(() => {
                    modal.style.display = 'none';
                    window.location.href = 'index.html';
                }, 3000);
            }, 2000);
        });
        
        // Kapat butonu
        modal.querySelector('#closeModal').addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Modal dışına tıkla kapat
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    updateStepIndicator(1);
    console.log('Gift selection JavaScript başarıyla yüklendi');
});
// E-posta gönder butonu
modal.querySelector('#sendEmail').addEventListener('click', function() {
    const button = this;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GÖNDERİLİYOR...';
    
    // PHP'ye veri gönder
    fetch('send-order-email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.email,
            yourName: data.yourName,
            orderId: data.orderId,
            gameTitle: data.gameTitle,
            giftFor: data.giftFor,
            gamePrice: data.gamePrice,
            phone: data.phone || '',
            specialMessage: data.specialMessage || '',
            additionalNotes: data.additionalNotes || ''
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            showAlert(result.message, 'success');
            button.innerHTML = '<i class="fas fa-check"></i> GÖNDERİLDİ';
            
            // 3 saniye sonra ana sayfaya yönlendir
            setTimeout(() => {
                modal.style.display = 'none';
                window.location.href = 'index.html';
            }, 3000);
        } else {
            showAlert('E-posta gönderilemedi: ' + (result.error || 'Bilinmeyen hata'), 'error');
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-envelope"></i> TEKRAR DENE';
        }
    })
    .catch(error => {
        console.error('Hata:', error);
        showAlert('Bağlantı hatası! Lütfen daha sonra tekrar deneyin.', 'error');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-envelope"></i> TEKRAR DENE';
    });
});