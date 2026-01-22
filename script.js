// DOM Hazır Olduğunda
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobil Menü Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // Hero Swiper
    const heroSwiper = new Swiper('.heroSwiper', {
        direction: 'horizontal',
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        effect: 'fade',
        speed: 800,
    });
    
    // OYUNLARIMIZ Scroll Fonksiyonları - DÜZELTİLMİŞ
    const gamesScrollWrapper = document.querySelector('.games-scroll-wrapper');
    const gamesScroll = document.querySelector('.games-scroll');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    const gameItems = document.querySelectorAll('.game-item');
    
    let currentScroll = 0;
    let currentSlide = 0;
    let slidesPerView = 3; // Varsayılan olarak 3 görünür
    
    // Ekran boyutuna göre slidesPerView ayarla
    function updateSlidesPerView() {
        if (window.innerWidth < 768) {
            slidesPerView = 1;
        } else if (window.innerWidth < 992) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        updateIndicator();
    }
    
    // İlk yüklemede çağır
    updateSlidesPerView();
    
    // Pencere boyutu değiştiğinde güncelle
    window.addEventListener('resize', updateSlidesPerView);
    
    // Kaydırma miktarını hesapla
    function getScrollAmount() {
        if (gameItems.length === 0) return 0;
        const gameItemWidth = gameItems[0].offsetWidth;
        const gap = 30; // CSS'teki gap değeri
        return (gameItemWidth + gap) * slidesPerView;
    }
    
    // Maksimum kaydırma miktarını hesapla
    function getMaxScroll() {
        if (gameItems.length === 0) return 0;
        const totalWidth = gamesScroll.scrollWidth;
        const visibleWidth = gamesScrollWrapper.offsetWidth;
        return Math.max(0, totalWidth - visibleWidth);
    }
    
    // Kaydırma fonksiyonu
    function scrollGames(direction) {
        const scrollAmount = getScrollAmount();
        const maxScroll = getMaxScroll();
        
        if (direction === 'right') {
            currentScroll = Math.min(currentScroll + scrollAmount, maxScroll);
        } else if (direction === 'left') {
            currentScroll = Math.max(currentScroll - scrollAmount, 0);
        }
        
        gamesScroll.style.transform = `translateX(-${currentScroll}px)`;
        gamesScroll.style.transition = 'transform 0.5s ease';
        
        // Hangi slaytın göründüğünü hesapla
        const gameItemWidth = gameItems[0] ? gameItems[0].offsetWidth + 30 : 300;
        currentSlide = Math.round(currentScroll / gameItemWidth);
        
        updateIndicator();
    }
    
    // Buton event listener'ları
    if (scrollLeftBtn && scrollRightBtn) {
        scrollRightBtn.addEventListener('click', function() {
            scrollGames('right');
        });
        
        scrollLeftBtn.addEventListener('click', function() {
            scrollGames('left');
        });
        
        // Klavye ok tuşları ile kontrol
        document.addEventListener('keydown', function(e) {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return; // Form elemanındayken çalışmasın
            }
            
            if (e.key === 'ArrowRight') {
                scrollGames('right');
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                scrollGames('left');
                e.preventDefault();
            }
        });
    }
    
    // İndikatör güncelleme
    function updateIndicator() {
        if (indicatorDots.length === 0) return;
        
        const totalSlides = Math.ceil(gameItems.length / slidesPerView);
        const currentDotIndex = Math.floor(currentSlide / slidesPerView);
        
        // Gerektiğinde indicator dot'larını güncelle
        if (indicatorDots.length !== totalSlides) {
            // Bu kısmı basit tutuyoruz, kompleks olmasın
            return;
        }
        
        indicatorDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentDotIndex) {
                dot.classList.add('active');
            }
        });
    }
    
    // İndikatör noktalarına tıklama
    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            if (gameItems.length === 0) return;
            
            const gameItemWidth = gameItems[0].offsetWidth + 30;
            const totalSlides = Math.ceil(gameItems.length / slidesPerView);
            
            // Tıklanan dot'a göre pozisyon hesapla
            if (index < totalSlides) {
                currentScroll = index * slidesPerView * gameItemWidth;
                currentScroll = Math.min(currentScroll, getMaxScroll());
                
                gamesScroll.style.transform = `translateX(-${currentScroll}px)`;
                gamesScroll.style.transition = 'transform 0.5s ease';
                
                currentSlide = index * slidesPerView;
                updateIndicator();
            }
        });
    });
    
    // Dokunmatik kaydırma desteği (mobil için)
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (gamesScrollWrapper) {
        gamesScrollWrapper.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        gamesScrollWrapper.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum kaydırma mesafesi
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Sola kaydırma (sağa git)
            scrollGames('right');
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Sağa kaydırma (sola git)
            scrollGames('left');
        }
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-question.active');
            if (currentlyActive && currentlyActive !== question) {
                currentlyActive.classList.remove('active');
                currentlyActive.nextElementSibling.classList.remove('active');
            }
            
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
    
    // Form Gönderimi
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // Pixel efekti ile mesaj gösterimi
            const submitBtn = contactForm.querySelector('.btn-form');
            const originalText = submitBtn.textContent;
            const originalBg = submitBtn.style.backgroundColor;
            
            submitBtn.textContent = 'GÖNDERİLİYOR...';
            submitBtn.style.backgroundColor = '#ff3b3b';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Başarı mesajı (pixel stili)
                showPixelMessage('TEŞEKKÜRLER! MESAJINIZ ALINDI.');
                
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = originalBg;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Pixel mesaj gösterimi
    function showPixelMessage(message) {
        // Var olan mesajı kaldır
        const existingMsg = document.querySelector('.pixel-message');
        if (existingMsg) existingMsg.remove();
        
        // Yeni mesaj oluştur
        const messageDiv = document.createElement('div');
        messageDiv.className = 'pixel-message';
        messageDiv.innerHTML = `
            <div class="pixel-message-content">
                <span class="pixel-message-text">${message}</span>
                <button class="pixel-message-close">✕</button>
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // CSS ekle
        const style = document.createElement('style');
        style.textContent = `
            .pixel-message {
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background-color: var(--dark);
                border: 4px solid var(--primary-pink);
                padding: 20px;
                z-index: 9999;
                font-family: var(--font-heading);
                color: white;
                text-align: center;
                min-width: 300px;
                box-shadow: 0 0 20px rgba(255, 45, 117, 0.5);
                animation: pixelMessageAppear 0.5s ease;
            }
            
            .pixel-message-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
            }
            
            .pixel-message-text {
                font-size: 1rem;
                text-transform: uppercase;
            }
            
            .pixel-message-close {
                background: var(--accent-red);
                color: white;
                border: 2px solid var(--dark-pink);
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-family: var(--font-body);
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .pixel-message-close:hover {
                background: var(--primary-pink);
            }
            
            @keyframes pixelMessageAppear {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Kapatma butonu
        const closeBtn = messageDiv.querySelector('.pixel-message-close');
        closeBtn.addEventListener('click', () => {
            messageDiv.style.animation = 'pixelMessageAppear 0.5s ease reverse';
            setTimeout(() => messageDiv.remove(), 500);
        });
        
        // 5 saniye sonra otomatik kapan
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'pixelMessageAppear 0.5s ease reverse';
                setTimeout(() => messageDiv.remove(), 500);
            }
        }, 5000);
    }
    
    // Scroll ile Header efekti
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(26, 26, 44, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.backgroundColor = 'rgba(26, 26, 44, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Pixel karakter animasyonları
    function animatePixelCharacters() {
        const characters = document.querySelectorAll('.pixel-character, .pixel-heart, .pixel-cake, .pixel-gift, .pixel-palm, .pixel-house, .pixel-music, .pixel-pet');
        
        characters.forEach((char, index) => {
            char.style.animationDelay = `${index * 0.5}s`;
            
            // Rastgele hareket ekle
            if (char.classList.contains('pixel-character')) {
                char.style.animation = `float 2s ease-in-out ${index * 0.5}s infinite`;
            }
        });
    }
    
    // Otomatik kaydırma (opsiyonel)
    let autoScrollInterval;
    
    function startAutoScroll() {
        // Sadece mouse oyunlar bölümünde değilken çalışsın
        autoScrollInterval = setInterval(() => {
            if (!isMouseOverGames) {
                const maxScroll = getMaxScroll();
                if (currentScroll >= maxScroll - 10) {
                    currentScroll = 0; // Başa dön
                } else {
                    currentScroll += getScrollAmount() / 3; // Daha yavaş otomatik kaydırma
                    currentScroll = Math.min(currentScroll, maxScroll);
                }
                
                gamesScroll.style.transform = `translateX(-${currentScroll}px)`;
                gamesScroll.style.transition = 'transform 1.5s ease';
                
                const gameItemWidth = gameItems[0] ? gameItems[0].offsetWidth + 30 : 300;
                currentSlide = Math.round(currentScroll / gameItemWidth);
                updateIndicator();
            }
        }, 4000); // 4 saniyede bir
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
    }
    
    // Mouse oyunlar bölümünde mi kontrolü
    let isMouseOverGames = false;
    const gamesSection = document.querySelector('.games-section');
    
    if (gamesSection) {
        gamesSection.addEventListener('mouseenter', () => {
            isMouseOverGames = true;
            stopAutoScroll();
        });
        
        gamesSection.addEventListener('mouseleave', () => {
            isMouseOverGames = false;
            startAutoScroll();
        });
    }
    
    // Yüklenme animasyonu
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            
            // Başlıklara pixel efekti
            const titles = document.querySelectorAll('.section-title, .hero-title, .step h3, .game-header h3');
            titles.forEach(title => {
                title.style.textShadow = '3px 3px 0 var(--dark-pink)';
            });
            
            // Animasyonları başlat
            animatePixelCharacters();
            
            // Otomatik kaydırmayı başlat (opsiyonel, isterseniz kapatabilirsiniz)
            // startAutoScroll();
            
            // Scroll butonlarını göster
            if (scrollLeftBtn && scrollRightBtn) {
                scrollLeftBtn.style.opacity = '1';
                scrollRightBtn.style.opacity = '1';
            }
            
        }, 100);
    });
    
    // Oyun kartlarına hover efekti
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const pixelScreen = this.querySelector('.pixel-screen');
            if (pixelScreen) {
                pixelScreen.style.borderColor = '#ff3b3b';
                pixelScreen.style.boxShadow = '0 0 10px rgba(255, 59, 59, 0.5)';
            }
            
            // Pixel karakterini hareket ettir
            const pixelChar = this.querySelector('.pixel-character');
            if (pixelChar) {
                pixelChar.style.animation = 'float 0.5s ease-in-out infinite';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const pixelScreen = this.querySelector('.pixel-screen');
            if (pixelScreen) {
                pixelScreen.style.borderColor = '';
                pixelScreen.style.boxShadow = '';
            }
            
            const pixelChar = this.querySelector('.pixel-character');
            if (pixelChar) {
                pixelChar.style.animation = '';
            }
        });
    });
    
    // Pixel butonlarına tıklama efekti
    const pixelButtons = document.querySelectorAll('.pixel-btn');
    pixelButtons.forEach(btn => {
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'translate(4px, 4px)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Scroll butonlarına hover efekti
    if (scrollLeftBtn && scrollRightBtn) {
        [scrollLeftBtn, scrollRightBtn].forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.backgroundColor = '#ff3b3b';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.backgroundColor = '';
            });
        });
    }
    
    // Sayfa kapatılırken otomatik kaydırmayı durdur
    window.addEventListener('beforeunload', function() {
        stopAutoScroll();
    });
});
// games-scroll için dokunmatik kontrol (mevcut kodunuzu güncelleyin)
if (gamesScrollWrapper) {
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    gamesScrollWrapper.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].pageX - gamesScrollWrapper.offsetLeft;
        scrollLeft = gamesScroll.scrollLeft;
        gamesScroll.style.transition = 'none';
    });
    
    gamesScrollWrapper.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - gamesScrollWrapper.offsetLeft;
        const walk = (x - startX) * 2;
        gamesScroll.style.transform = `translateX(${-currentScroll - walk}px)`;
    });
    
    gamesScrollWrapper.addEventListener('touchend', function(e) {
        isDragging = false;
        gamesScroll.style.transition = 'transform 0.5s ease';
    });
}
// OYUNLARIMIZ Scroll Fonksiyonları - MOBİL DOSTU VERSİYON
const gamesScrollWrapper = document.querySelector('.games-scroll-wrapper');
const gamesScroll = document.querySelector('.games-scroll');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const indicatorDots = document.querySelectorAll('.indicator-dot');
const gameItems = document.querySelectorAll('.game-item');

let currentScroll = 0;
let currentSlide = 0;
let slidesPerView = 3;
let isDragging = false;
let startX = 0;
let scrollLeftStart = 0;
let autoScrollInterval;
let isMouseOverGames = false;

// Ekran boyutuna göre slidesPerView ayarla
function updateSlidesPerView() {
    if (window.innerWidth < 480) {
        slidesPerView = 1;
    } else if (window.innerWidth < 768) {
        slidesPerView = 1.2; // Kısmen görünen
    } else if (window.innerWidth < 992) {
        slidesPerView = 2;
    } else {
        slidesPerView = 3;
    }
    updateIndicator();
}

// İlk yüklemede çağır
updateSlidesPerView();

// Pencere boyutu değiştiğinde güncelle
window.addEventListener('resize', updateSlidesPerView);

// Kaydırma miktarını hesapla
function getScrollAmount() {
    if (gameItems.length === 0) return 0;
    const gameItemWidth = gameItems[0].offsetWidth;
    const gap = 20; // CSS'teki gap değeri (mobilde daha küçük)
    return (gameItemWidth + gap) * slidesPerView;
}

// Maksimum kaydırma miktarını hesapla
function getMaxScroll() {
    if (gameItems.length === 0) return 0;
    const totalWidth = gamesScroll.scrollWidth;
    const visibleWidth = gamesScrollWrapper.offsetWidth;
    return Math.max(0, totalWidth - visibleWidth);
}

// MOBİL DOKUNMATİK KAYDIRMA
function setupTouchScrolling() {
    if (!gamesScrollWrapper || !gamesScroll) return;
    
    // Dokunmatik başlangıç
    gamesScrollWrapper.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].pageX - gamesScrollWrapper.offsetLeft;
        scrollLeftStart = currentScroll;
        gamesScroll.style.transition = 'none';
        
        // Otomatik kaydırmayı durdur
        stopAutoScroll();
    });
    
    // Dokunmatik hareket
    gamesScrollWrapper.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.touches[0].pageX - gamesScrollWrapper.offsetLeft;
        const walk = (x - startX) * 2.5; // Hız çarpanı
        const newScroll = Math.max(0, Math.min(scrollLeftStart - walk, getMaxScroll()));
        
        currentScroll = newScroll;
        gamesScroll.style.transform = `translateX(-${currentScroll}px)`;
        
        // Hangi slaytın göründüğünü hesapla
        updateCurrentSlide();
    });
    
    // Dokunmatik bitiş
    gamesScrollWrapper.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        gamesScroll.style.transition = 'transform 0.3s ease';
        
        // En yakın slayta snap et
        snapToNearestSlide();
        
        // İndikatörü güncelle
        updateIndicator();
        
        // Otomatik kaydırmayı yeniden başlat (mouse üzerinde değilse)
        if (!isMouseOverGames) {
            setTimeout(startAutoScroll, 3000); // 3 saniye sonra başla
        }
    });
    
    // Fare ile sürükleme (mobil olmayan cihazlar için)
    gamesScrollWrapper.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.pageX - gamesScrollWrapper.offsetLeft;
        scrollLeftStart = currentScroll;
        gamesScroll.style.transition = 'none';
        stopAutoScroll();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const x = e.pageX - gamesScrollWrapper.offsetLeft;
        const walk = (x - startX) * 2.5;
        const newScroll = Math.max(0, Math.min(scrollLeftStart - walk, getMaxScroll()));
        
        currentScroll = newScroll;
        gamesScroll.style.transform = `translateX(-${currentScroll}px)`;
        updateCurrentSlide();
    });
    
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;
        gamesScroll.style.transition = 'transform 0.3s ease';
        snapToNearestSlide();
        updateIndicator();
        
        if (!isMouseOverGames) {
            setTimeout(startAutoScroll, 3000);
        }
    });
}

// En yakın slayta snap et
function snapToNearestSlide() {
    if (gameItems.length === 0) return;
    
    const gameItemWidth = gameItems[0].offsetWidth + 20; // Gap dahil
    const nearestSlide = Math.round(currentScroll / gameItemWidth);
    const maxSlide = Math.max(0, gameItems.length - Math.ceil(slidesPerView));
    
    currentSlide = Math.min(nearestSlide, maxSlide);
    currentScroll = currentSlide * gameItemWidth;
    
    gamesScroll.style.transform = `translateX(-${currentScroll}px)`;
}

// Mevcut slaytı güncelle
function updateCurrentSlide() {
    if (gameItems.length === 0) return;
    const gameItemWidth = gameItems[0].offsetWidth + 20;
    currentSlide = Math.round(currentScroll / gameItemWidth);
}

// OTOMATİK KAYDIRMA
function startAutoScroll() {
    stopAutoScroll(); // Önce varsa durdur
    
    autoScrollInterval = setInterval(() => {
        if (isDragging || isMouseOverGames || gameItems.length === 0) return;
        
        const maxScroll = getMaxScroll();
        const gameItemWidth = gameItems[0].offsetWidth + 20;
        
        // Son slayta ulaştıysak başa dön
        if (currentScroll >= maxScroll - 10) {
            currentScroll = 0;
            currentSlide = 0;
        } else {
            // Bir slayt ilerle
            currentScroll += gameItemWidth;
            currentScroll = Math.min(currentScroll, maxScroll);
            currentSlide = Math.round(currentScroll / gameItemWidth);
        }
        
        gamesScroll.style.transform = `translateX(-${currentScroll}px)`;
        gamesScroll.style.transition = 'transform 0.8s ease';
        
        updateIndicator();
        
        // Mobilde daha yavaş kaydır
        if (window.innerWidth < 768) {
            gamesScroll.style.transition = 'transform 1.2s ease';
        }
        
    }, 4000); // 4 saniyede bir
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// İndikatör güncelleme
function updateIndicator() {
    if (indicatorDots.length === 0) return;
    
    const totalSlides = gameItems.length;
    const visibleSlides = Math.ceil(slidesPerView);
    const totalDots = Math.ceil(totalSlides / visibleSlides);
    const currentDotIndex = Math.floor(currentSlide / visibleSlides);
    
    // İndikatör noktalarını güncelle
    indicatorDots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentDotIndex) {
            dot.classList.add('active');
        }
    });
}

// Mouse oyunlar bölümünde mi kontrolü
const gamesSection = document.querySelector('.games-section');
if (gamesSection) {
    gamesSection.addEventListener('mouseenter', () => {
        isMouseOverGames = true;
        stopAutoScroll();
    });
    
    gamesSection.addEventListener('mouseleave', () => {
        isMouseOverGames = false;
        if (!isDragging) {
            startAutoScroll();
        }
    });
}

// Dokunmatik kurulumunu başlat
setupTouchScrolling();

// Otomatik kaydırmayı başlat (ilk yüklemede)
setTimeout(() => {
    if (!isMouseOverGames && !isDragging) {
        startAutoScroll();
    }
}, 2000);

// Sayfa kapatılırken temizlik
window.addEventListener('beforeunload', () => {
    stopAutoScroll();
});

// Pencere boyutu değişince otomatik kaydırmayı yeniden başlat
window.addEventListener('resize', () => {
    setTimeout(() => {
        if (!isMouseOverGames && !isDragging) {
            startAutoScroll();
        }
    }, 500);
});
