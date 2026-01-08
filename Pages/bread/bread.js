// 添加通知樣式到頁面
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .global-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 9999;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 500;
                border-left: 4px solid #2196F3;
                min-width: 300px;
                max-width: 400px;
            }
            
            .global-notification.show {
                transform: translateX(0);
            }
            
            .global-notification.notification-success {
                border-left-color: #4CAF50;
                background: linear-gradient(135deg, #f8fff8 0%, #ffffff 100%);
            }
            .global-notification.notification-success i {
                color: #4CAF50;
            }

            .global-notification.notification-error {
                border-left-color: #ff4757;
                background: linear-gradient(135deg, #fff8f8 0%, #ffffff 100%);
            }
            .global-notification.notification-error i {
                color: #ff4757;
            }

            .global-notification.notification-info {
                border-left-color: #2196F3;
                background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
            }
            .global-notification.notification-info i {
                color: #2196F3;
            }
            
            .global-notification .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
            }
            
            .global-notification i {
                font-size: 1.2rem;
            }
            
            .global-notification span {
                font-size: 0.95rem;
                color: #333;
                font-weight: 500;
                flex: 1;
            }
        `;
        document.head.appendChild(style);
        console.log('通知樣式已同步更新 (Bread Version)');
    }
}

// 通知函數
function showNotification(message, type = 'info') {
    console.log(`顯示通知: "${message}" (${type})`);
    
    // 確保樣式存在
    addNotificationStyles();
    
    // 移除現有的通知
    const existingNotification = document.querySelector('.global-notification');
    if (existingNotification) existingNotification.remove();
    
    // 設定圖示
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `global-notification notification-${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 顯示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自動隱藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 兼容舊的函數名稱 (Bread)
function showBreadNotification(message, type = 'info') {
    showNotification(message, type);
}
// ==================== 歐式麵包專區評論系統功能 ====================
let currentReviewRating = 0;
let isInitialized = false;

// 初始化麵包評論系統
function initBreadReviewSystem() {
    if (isInitialized) {
        console.log('歐式麵包專區評論系統已初始化，跳過重複初始化');
        return;
    }
    
    console.log('初始化歐式麵包專區評論系統');
    
    // 檢查是否有評論資料，如果沒有則創建預設資料
    initializeBreadReviewsData();
    
    // 載入商品評論資料
    loadBreadProductReviews();
    
    // 設置評論按鈕事件
    setupBreadReviewButtons();
    
    // 初始化星星評分系統
    initBreadRatingModalStars();
    
    // 綁定提交按鈕
    bindBreadSubmitButton();
    bindBreadCancelButton(); 
    
    isInitialized = true;
}

// 初始化歐式麵包評論資料
function initializeBreadReviewsData() {
    const reviewsData = localStorage.getItem('chulinBreadReviews');
    
    if (!reviewsData) {
        console.log('沒有找到歐式麵包評論資料，創建預設資料');
        const defaultReviews = createBreadDefaultReviews();
        localStorage.setItem('chulinBreadReviews', JSON.stringify(defaultReviews));
        console.log('歐式麵包預設評論已創建:', defaultReviews);
    } else {
        console.log('已有歐式麵包評論資料:', JSON.parse(reviewsData));
    }
}

// 建立歐式麵包預設評論資料
function createBreadDefaultReviews() {
    return {
        '雙起司軟歐麵包': {
            rating: 4.5,
            reviews: [
                { name: '林先生', rating: 5, text: '起司塊給得很大方，鹹香的味道跟軟Q的歐式麵包體超合，加熱後口感更好！', date: '2024-04-15' },
                { name: '王小姐', rating: 4, text: '外皮帶點微脆，內裡真的很柔軟，鹹香濃郁卻不會覺得膩，當早餐很有飽足感。', date: '2024-04-16' },
                { name: '陳太太', rating: 5, text: '兩種起司的搭配太完美了，拉絲效果很好，配咖啡或牛奶都很適合！', date: '2024-04-12' }
            ]
        },
        '花生起司帕尼尼': {
            rating: 4.8,
            reviews: [
                { name: '謝先生', rating: 5, text: '花生醬超級濃郁，搭配起司的鹹味，這種甜鹹交織的味道真的會讓人上癮。', date: '2024-04-18' },
                { name: '張小姐', rating: 4, text: '熱壓過後的吐司邊邊酥酥脆脆的，花生顆粒感很加分，是層次非常豐富的一款。', date: '2024-04-20' },
                { name: '吳太太', rating: 5, text: '花生醬和起司的比例剛剛好，早餐吃這個超有滿足感，會一直想回購！', date: '2024-04-14' }
            ]
        },
        '海鹽奶油卷': {
            rating: 4.7,
            reviews: [
                { name: '陳小姐', rating: 5, text: '海鹽的鹹味把奶油的香氣完全提煉出來了，麵包體濕潤有彈性，簡單卻不平凡。', date: '2024-04-22' },
                { name: '李先生', rating: 5, text: '奶油香氣溫潤細緻，海鹽恰到好處地解了膩，一口接一口完全停不下來。', date: '2024-04-23' },
                { name: '鄭小姐', rating: 4, text: '外皮微脆內裡柔軟，海鹽的點綴讓奶油香氣更突出，配湯或當點心都很棒。', date: '2024-04-19' }
            ]
        },
        '蜂蜜生吐司': {
            rating: 4.9,
            reviews: [
                { name: '郭小姐', rating: 5, text: '用蜂蜜取代砂糖真的很特別，吐司散發著淡淡的天然清香，口感濕潤柔軟極了。', date: '2024-04-25' },
                { name: '周小姐', rating: 5, text: '即使不抹果醬也很好吃，每一口都能感受到蜂蜜的清甜，給小朋友吃也很安心。', date: '2024-04-26' },
                { name: '黃太太', rating: 5, text: '蜂蜜香氣自然不人工，吐司體超級柔軟，早上烤一下當早餐超幸福！', date: '2024-04-21' }
            ]
        }
    };
}

// 載入歐式麵包商品評論資料到頁面
function loadBreadProductReviews() {
    try {
        const reviewsData = localStorage.getItem('chulinBreadReviews');
        if (!reviewsData) {
            console.error('沒有找到歐式麵包評論資料');
            return;
        }
        
        const reviews = JSON.parse(reviewsData);
        console.log('載入歐式麵包評論資料，共有', Object.keys(reviews).length, '個商品評論');
        
        // 獲取頁面上的所有麵包商品卡片
        const breadCards = document.querySelectorAll('.bread-card');
        console.log('頁面上有', breadCards.length, '個麵包商品卡片');
        
        breadCards.forEach((card, index) => {
            const productName = card.querySelector('.bread-name').textContent.trim();
            console.log(`[${index + 1}] 商品名稱: "${productName}"`);
            
            // 直接比對商品名稱
            const productReviews = reviews[productName];
            
            if (productReviews) {
                console.log(`✓ 找到 ${productName} 的評論資料`);
                
                // 確保 rating 是正確的數字格式
                const rating = Number(productReviews.rating) || 0;
                
                // 更新評分顯示
                const ratingScore = card.querySelector('.rating-score');
                const reviewCount = card.querySelector('.review-count');
                const ratingStars = card.querySelector('.rating-stars');
                
                if (ratingScore) {
                    ratingScore.textContent = rating.toFixed(1);
                    console.log(`  更新評分: ${rating.toFixed(1)}`);
                }
                
                if (reviewCount) {
                    const reviewCountNum = productReviews.reviews ? productReviews.reviews.length : 0;
                    reviewCount.textContent = `(${reviewCountNum}則評論)`;
                    console.log(`  更新評論數量: ${reviewCountNum}`);
                }
                
                // 更新星星顯示
                if (ratingStars) {
                    updateBreadProductStarsDisplay(ratingStars, rating);
                }
                
                // 更新評論預覽
                if (productReviews.reviews && productReviews.reviews.length > 0) {
                    updateBreadReviewsPreview(card, productReviews.reviews);
                } else {
                    // 如果沒有評論，顯示暫無評論
                    const previewContainer = card.querySelector('.reviews-preview');
                    if (previewContainer) {
                        previewContainer.innerHTML = `
                            <div class="no-reviews-preview">
                                <i class="far fa-comment"></i>
                                <span>暫無評論</span>
                            </div>
                        `;
                    }
                }
            } else {
                console.log(`✗ 找不到 ${productName} 的評論資料`);
                // 如果找不到評論，設置為0
                const ratingScore = card.querySelector('.rating-score');
                const reviewCount = card.querySelector('.review-count');
                const previewContainer = card.querySelector('.reviews-preview');
                
                if (ratingScore) {
                    ratingScore.textContent = '0.0';
                }
                
                if (reviewCount) {
                    reviewCount.textContent = '(0則評論)';
                }
                
                if (previewContainer) {
                    previewContainer.innerHTML = `
                        <div class="no-reviews-preview">
                            <i class="far fa-comment"></i>
                            <span>暫無評論</span>
                        </div>
                    `;
                }
                
                // 初始化星星為0
                const ratingStars = card.querySelector('.rating-stars');
                if (ratingStars) {
                    updateBreadProductStarsDisplay(ratingStars, 0);
                }
            }
        });
        
        console.log('歐式麵包評論資料載入完成');
    } catch (error) {
        console.error('載入歐式麵包評論資料時發生錯誤:', error);
    }
}

// 更新歐式麵包評論預覽
function updateBreadReviewsPreview(card, reviews) {
    const previewContainer = card.querySelector('.reviews-preview');
    if (!previewContainer) return;
    
    // 清空現有內容
    previewContainer.innerHTML = '';

    // 創建內容容器
    const contentContainer = document.createElement('div');
    contentContainer.className = 'reviews-preview-content';
    
    // 只顯示最新2則評論
    const latestReviews = reviews.slice(0, 2);
    
    if (latestReviews.length === 0) {
        // 沒有評論時的顯示
        contentContainer.innerHTML = `
            <div class="no-reviews-preview">
                <i class="far fa-comment"></i>
                <span>暫無評論</span>
            </div>
        `;
    } else {
        console.log('顯示', latestReviews.length, '則評論預覽');
        
        // 添加評論項目
        latestReviews.forEach((review, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            // 使用 userName 或 name 顯示名稱
            const displayName = review.userName || review.name || '會員';
            
            reviewItem.innerHTML = `
                <div class="reviewer-info">
                    <span class="reviewer-name">${displayName}</span>
                    <div class="review-stars">
                        ${getBreadStarsHTML(review.rating)}
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
            `;
            contentContainer.appendChild(reviewItem);
        });
    }
    
    previewContainer.appendChild(contentContainer);
}

// 獲取歐式麵包星星HTML
function getBreadStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

// 更新歐式麵包商品星星顯示
function updateBreadProductStarsDisplay(starsElement, rating) {
    if (!starsElement) return;
    
    // 清空現有的星星
    starsElement.innerHTML = '';
    
    // 計算整星和半星
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // 添加整星
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        star.style.color = '#ffc107';
        star.style.textShadow = '0 0 4px rgba(255, 193, 7, 0.3)'; // 發光效果
        starsElement.appendChild(star);
    }
    
    // 添加半星
    if (hasHalfStar) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt';
        halfStar.style.color = '#ffc107';
        halfStar.style.textShadow = '0 0 4px rgba(255, 193, 7, 0.3)';
        starsElement.appendChild(halfStar);
    }
    
    // 添加空星
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        const emptyStar = document.createElement('i');
        emptyStar.className = 'far fa-star';
        emptyStar.style.color = '#ddd';
        emptyStar.style.textShadow = 'none';
        starsElement.appendChild(emptyStar);
    }
}

// 設置歐式麵包評論按鈕事件
function setupBreadReviewButtons() {
    console.log('設置歐式麵包評論按鈕事件...');
    
    // 為所有「我要評分」按鈕綁定事件
    const rateButtons = document.querySelectorAll('.bread-card .rate-product-btn');
    console.log('找到歐式麵包我要評分按鈕:', rateButtons.length);
    
    rateButtons.forEach(button => {
        // 移除所有事件監聽器（避免重複綁定）
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // 重新綁定事件 - 只阻止預設行為，不阻止事件冒泡
        newButton.addEventListener('click', function(e) {
            // 只阻止預設行為
            if (e.preventDefault) e.preventDefault();
            
            const card = this.closest('.bread-card');
            if (!card) {
                console.log('找不到麵包卡片元素');
                return;
            }
            
            const productName = card.querySelector('.bread-name').textContent.trim();
            console.log('點擊歐式麵包我要評分:', productName);
            
            // 開啟評分模態框
            openBreadRatingModalWithAuth(productName);
            
            return false;
        });
    });
    
    // 為所有「查看評論」按鈕綁定事件
    const viewAllButtons = document.querySelectorAll('.bread-card .view-all-reviews-btn');
    console.log('找到歐式麵包查看評論按鈕:', viewAllButtons.length);
    
    viewAllButtons.forEach(button => {
        // 移除所有事件監聽器（避免重複綁定）
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // 重新綁定事件 - 只阻止預設行為，不阻止事件冒泡
        newButton.addEventListener('click', function(e) {
            // 只阻止預設行為
            if (e.preventDefault) e.preventDefault();
            
            const card = this.closest('.bread-card');
            if (!card) {
                console.log('找不到麵包卡片元素');
                return;
            }
            
            const productName = card.querySelector('.bread-name').textContent.trim();
            console.log('點擊歐式麵包查看評論:', productName);
            
            // 開啟評論模態框
            openBreadReviewsModal(productName);
            
            return false;
        });
    });
}

// 開啟歐式麵包評分模態框（整合會員登入檢查）
function openBreadRatingModalWithAuth(productName) {
    console.log('開啟歐式麵包評分模態框:', productName);
    
    // 檢查是否已登入
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    if (!isLoggedIn || !userData.email) {
        console.log('用戶未登入，顯示登入模態框');
        showBreadNotification('請先登入會員才能進行評分', 'error');
        
        // 顯示登入模態框
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.style.display = 'flex';
            setTimeout(() => {
                authModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // 儲存要評分的商品名稱，登入後自動開啟評分
                localStorage.setItem('pendingBreadRatingProduct', productName);
            }, 10);
        }
        return;
    }
    
    // 如果已登入，直接開啟評分模態框
    console.log('用戶已登入，直接開啟評分模態框');
    openBreadRatingModal(productName);
}

// 初始化歐式麵包評分模態框的星星
function initBreadRatingModalStars() {
    const starsContainer = document.querySelector('#ratingModal .stars-selector');
    if (!starsContainer) return;
    
    // 清空並重新創建星星元素
    starsContainer.innerHTML = '';
    
    // 創建5顆星星
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = 'far fa-star';
        star.dataset.value = i;
        star.style.cursor = 'pointer';
        star.style.fontSize = '28px';
        star.style.margin = '0 5px';
        starsContainer.appendChild(star);
    }
    
    const stars = document.querySelectorAll('#ratingModal .stars-selector i');
    const ratingText = document.querySelector('#ratingModal .rating-value-text');
    
    if (!stars.length || !ratingText) return;
    
    // 重置評分
    currentReviewRating = 0;
    
    stars.forEach(star => {
        // 滑鼠移入事件 - 預覽效果
        star.addEventListener('mouseenter', function() {
            const value = parseInt(this.dataset.value);
            highlightBreadStars(stars, value);
            updateBreadRatingText(ratingText, value);
        });
        
        // 滑鼠移出事件 - 恢復實際評分
        star.addEventListener('mouseleave', function() {
            highlightBreadStars(stars, currentReviewRating);
            updateBreadRatingText(ratingText, currentReviewRating);
        });
        
        // 點擊事件 - 設定評分
        star.addEventListener('click', function(e) {
            currentReviewRating = parseInt(this.dataset.value);
            console.log('選擇評分:', currentReviewRating);
            highlightBreadStars(stars, currentReviewRating);
            updateBreadRatingText(ratingText, currentReviewRating);
        });
    });
    
    // 初始化顯示
    highlightBreadStars(stars, 0);
    updateBreadRatingText(ratingText, 0);
}

// 高亮歐式麵包星星
function highlightBreadStars(stars, rating) {
    console.log('高亮星星，評分:', rating);
    
    stars.forEach((star, index) => {
        const starValue = index + 1;
        
        // 移除所有類別
        star.classList.remove('fas', 'far', 'fa-star-half-alt');
        
        if (starValue <= rating) {
            // 實心星星
            star.classList.add('fas');
            star.style.color = '#ffc107';
            star.style.textShadow = '0 0 8px rgba(255, 193, 7, 0.5)'; // 發光效果
        } else {
            // 空心星星
            star.classList.add('far');
            star.style.color = '#ddd';
            star.style.textShadow = 'none';
        }
    });
}

// 更新歐式麵包評分文字
function updateBreadRatingText(element, rating) {
    if (!element) return;
    
    const texts = ['請選擇星等', '很差', '差', '普通', '好', '非常好'];
    element.textContent = texts[rating] || '請選擇星等';
    element.style.color = rating > 0 ? '#ffc107' : '#666';
    element.style.fontWeight = rating > 0 ? 'bold' : 'normal';
}

// 開啟歐式麵包評論模態框
function openBreadReviewsModal(productName) {
    const modal = document.getElementById('reviewsModal');
    const title = document.getElementById('reviewsModalTitle');
    
    if (!modal || !title) {
        console.error('找不到評論模態框元素');
        return;
    }
    
    console.log('開啟歐式麵包評論模態框:', productName);
    
    // 設定標題
    title.textContent = `${productName} - 商品評論`;
    
    // 載入評論資料
    const reviewsData = localStorage.getItem('chulinBreadReviews');
    if (!reviewsData) {
        console.error('沒有歐式麵包評論資料');
        return;
    }
    
    const reviews = JSON.parse(reviewsData);
    const productReviews = reviews[productName];
    
    if (productReviews) {
        // 更新總評分
        const overallRating = document.getElementById('overallRating');
        const totalReviews = document.getElementById('totalReviews');
        const ratingStarsLarge = document.querySelector('.rating-stars-large');
        const reviewsList = document.getElementById('reviewsList');
        
        if (overallRating) {
            overallRating.textContent = productReviews.rating.toFixed(1);
        }
        
        if (totalReviews) {
            totalReviews.textContent = `${productReviews.reviews.length}則評論`;
        }
        
        // 更新星星顯示
        if (ratingStarsLarge) {
            ratingStarsLarge.innerHTML = getBreadStarsHTML(productReviews.rating);
        }
        
        // 更新評論列表
        if (reviewsList) {
            reviewsList.innerHTML = '';
            
            // 確保沒有重複的評論
            const uniqueReviews = [];
            const seenReviews = new Set();
            
            productReviews.reviews.forEach(review => {
                // 創建唯一識別碼
                const reviewKey = `${review.userEmail || review.userName || review.name}_${review.date}_${review.text.substring(0, 50)}`;
                
                if (!seenReviews.has(reviewKey)) {
                    seenReviews.add(reviewKey);
                    uniqueReviews.push(review);
                }
            });
            
            // 顯示去重後的評論
            uniqueReviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-full';
                
                reviewElement.innerHTML = `
                    <div class="reviewer-info-full">
                        <span class="reviewer-name">${review.name}</span>
                        <div class="review-meta">
                            <div class="review-stars">
                                ${getBreadStarsHTML(review.rating)}
                            </div>
                            <span class="review-date">${review.date}</span>
                        </div>
                    </div>
                    <p class="review-text-full">${review.text}</p>
                `;
                
                reviewsList.appendChild(reviewElement);
            });
        }
    }
    
    // 顯示模態框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

// 關閉歐式麵包評論模態框
function closeBreadReviewsModal() {
    const modal = document.getElementById('reviewsModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// 開啟歐式麵包評分模態框
function openBreadRatingModal(productName) {
    const modal = document.getElementById('ratingModal');
    const title = document.getElementById('ratingModalTitle');
    
    if (!modal || !title) {
        console.error('找不到評分模態框元素');
        return;
    }
    
    console.log('開啟歐式麵包評分模態框:', productName);
    
    // 設定標題
    title.textContent = `為 ${productName} 評分`;
    
    // 儲存當前商品名稱
    modal.dataset.productName = productName;
    
    // 獲取會員資料
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    // 初始化表單
    const nameInput = document.getElementById('reviewerName');
    if (nameInput) {
        nameInput.value = userData.name || userData.email?.split('@')[0] || '會員';
    }
    
    // 重置表單
    const titleInput = document.getElementById('reviewTitle');
    const contentInput = document.getElementById('reviewContent');
    
    if (titleInput) titleInput.value = '';
    if (contentInput) contentInput.value = '';
    
    // 重置評分
    currentReviewRating = 0;
    
    // 重新初始化星星
    initBreadRatingModalStars();
    
    // 顯示模態框
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

// 關閉歐式麵包評分模態框
function closeBreadRatingModal() {
    const modal = document.getElementById('ratingModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// 綁定歐式麵包提交按鈕
function bindBreadSubmitButton() {
    const submitBtn = document.querySelector('.submit-rating-btn');
    if (submitBtn) {
        // 移除舊的onclick事件
        submitBtn.removeAttribute('onclick');
        
        // 重新綁定事件（避免重複綁定）
        const newSubmitBtn = submitBtn.cloneNode(true);
        submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
        
        newSubmitBtn.addEventListener('click', function(e) {
            // 只阻止表單的默認提交行為
            e.preventDefault();
            submitBreadRating();
        });
        
        console.log('歐式麵包提交按鈕已重新綁定');
    }
}

// 綁定取消按鈕
function bindBreadCancelButton() {
    const cancelBtn = document.querySelector('.cancel-rating-btn');
    if (cancelBtn) {
        // 移除舊的onclick事件
        cancelBtn.removeAttribute('onclick');
        
        // 重新綁定事件（避免重複綁定）
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        newCancelBtn.addEventListener('click', function(e) {
            // 只阻止預設行為
            e.preventDefault();
            closeBreadRatingModal();
        });
        
        console.log('歐式麵包取消按鈕已重新綁定');
    }
}

// 提交歐式麵包評分
function submitBreadRating() {
    const modal = document.getElementById('ratingModal');
    if (!modal) {
        console.error('找不到評分模態框');
        return;
    }
    
    const productName = modal.dataset.productName;
    
    console.log('提交歐式麵包評分，產品:', productName, '評分:', currentReviewRating);
    
    // 驗證評分
    if (currentReviewRating === 0) {
        showBreadNotification('請選擇評分星等', 'error');
        return;
    }
    
    const title = document.getElementById('reviewTitle')?.value.trim() || '';
    const content = document.getElementById('reviewContent')?.value.trim();
    const nameInput = document.getElementById('reviewerName');
    const name = nameInput?.value.trim() || '會員';
    
    // 驗證評論內容
    if (!content) {
        showBreadNotification('請填寫評論內容', 'error');
        return;
    }
    
    try {
        // 獲取會員資料
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
        
        console.log('=== 提交麵包評論時的用戶資料 ===');
        console.log('用戶資料完整物件:', userData);
        console.log('用戶Email:', userData.email);
        console.log('用戶名稱:', userData.name);
        
        // 確保用戶資料有正確的值
        const userEmail = userData.email || '';
        const userName = userData.name || userData.email?.split('@')[0] || '會員';
        
        // 獲取現有評論資料
        const reviewsData = localStorage.getItem('chulinBreadReviews');
        let reviews = reviewsData ? JSON.parse(reviewsData) : createBreadDefaultReviews();
        
        if (!reviews[productName]) {
            reviews[productName] = {
                rating: 0,
                reviews: []
            };
        }
        
        // 確保 reviews 陣列存在
        if (!Array.isArray(reviews[productName].reviews)) {
            reviews[productName].reviews = [];
        }
        
        // 檢查是否已評論過（使用 email 作為主要識別）
        let existingReviewIndex = -1;
        if (userData.email) {
            existingReviewIndex = reviews[productName].reviews.findIndex(
                review => review.userEmail === userData.email
            );
        }
        
        // 如果找不到 email 匹配，嘗試用名稱匹配
        if (existingReviewIndex === -1 && userData.name) {
            existingReviewIndex = reviews[productName].reviews.findIndex(
                review => review.userName === userData.name
            );
        }
        
        let newReview;
        if (existingReviewIndex !== -1) {
            // 更新現有評論
            newReview = {
                name: userName,
                userName: userName,
                userEmail: userEmail,
                rating: currentReviewRating,
                text: title ? `${title} - ${content}` : content,
                date: new Date().toISOString().split('T')[0],
                updated: true,
                isMember: isLoggedIn
            };
            reviews[productName].reviews[existingReviewIndex] = newReview;
            console.log('更新現有評論:', newReview);
        } else {
            // 添加新評論
            newReview = {
                name: userName,
                userName: userName,
                userEmail: userEmail,
                rating: currentReviewRating,
                text: title ? `${title} - ${content}` : content,
                date: new Date().toISOString().split('T')[0],
                isMember: isLoggedIn
            };
            reviews[productName].reviews.unshift(newReview);
            console.log('添加新評論:', newReview);
        }
        
        // 重新計算平均評分
        const productReviews = reviews[productName].reviews;
        const totalRating = productReviews.reduce((sum, review) => {
            const rating = Number(review.rating) || 0;
            return sum + rating;
        }, 0);
        
        const averageRating = productReviews.length > 0 ? 
            parseFloat((totalRating / productReviews.length).toFixed(1)) : 0;
        
        reviews[productName].rating = averageRating;
        
        // 儲存到 localStorage
        localStorage.setItem('chulinBreadReviews', JSON.stringify(reviews));
        
        console.log('歐式麵包評論已儲存，更新後的商品資料:', reviews[productName]);
        
        // 更新UI
        loadBreadProductReviews();
        
        // 顯示成功訊息
        showBreadNotification('評論提交成功！感謝您的分享', 'success');
        
        // 關閉模態框
        closeBreadRatingModal();
        
    } catch (error) {
        console.error('提交歐式麵包評分時發生錯誤:', error);
        showBreadNotification('提交評分時發生錯誤，請稍後再試', 'error');
    }
}

// 顯示歐式麵包通知
function showBreadNotification(message, type = 'info') {
    // 移除現有的通知
    const existingNotification = document.querySelector('.bread-notification');
    if (existingNotification) existingNotification.remove();
    
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `bread-notification notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 顯示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自動隱藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 檢查待處理的歐式麵包評分請求
function checkPendingBreadRating() {
    const pendingProduct = localStorage.getItem('pendingBreadRatingProduct');
    if (pendingProduct) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
        
        if (isLoggedIn && userData.email) {
            // 如果已登入，自動開啟評分模態框
            console.log('用戶已登入，自動開啟待處理的歐式麵包評分:', pendingProduct);
            setTimeout(() => {
                openBreadRatingModal(pendingProduct);
                // 清除待處理請求
                localStorage.removeItem('pendingBreadRatingProduct');
            }, 500);
        }
    }
}

// 歐式麵包模態框關閉功能
function fixBreadModalClose() {
    console.log('修復歐式麵包模態框關閉功能...');
    
    // 評論模態框的關閉按鈕
    const reviewsModalClose = document.querySelector('#reviewsModal .close-modal');
    if (reviewsModalClose) {
        // 移除舊的onclick事件
        reviewsModalClose.removeAttribute('onclick');
        
        // 重新綁定事件（移除 e.stopPropagation()）
        reviewsModalClose.addEventListener('click', function(e) {
            closeBreadReviewsModal();
        });
    }
    
    // 評分模態框的關閉按鈕
    const ratingModalClose = document.querySelector('#ratingModal .close-modal');
    if (ratingModalClose) {
        // 移除舊的onclick事件
        ratingModalClose.removeAttribute('onclick');
        
        // 重新綁定事件（移除 e.stopPropagation()）
        ratingModalClose.addEventListener('click', function(e) {
            closeBreadRatingModal();
        });
    }
    
    // 評分模態框的取消按鈕
    const ratingModalCancel = document.querySelector('#ratingModal .cancel-rating-btn');
    if (ratingModalCancel) {
        // 移除舊的onclick事件
        ratingModalCancel.removeAttribute('onclick');
        
        // 重新綁定事件（移除 e.stopPropagation()）
        ratingModalCancel.addEventListener('click', function(e) {
            e.preventDefault();
            closeBreadRatingModal();
        });
    }
    
    // 點擊模態框外部關閉
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                if (this.id === 'reviewsModal') {
                    closeBreadReviewsModal();
                } else if (this.id === 'ratingModal') {
                    closeBreadRatingModal();
                }
            }
        });
    });
}

// 添加歐式麵包通知樣式
function addBreadNotificationStyles() {
    if (!document.getElementById('bread-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'bread-notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                z-index: 9999;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                border-left: 4px solid;
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                border-left-color: #4CAF50;
            }
            
            .notification.error {
                border-left-color: #ff4757;
            }
            
            .notification.info {
                border-left-color: #2196F3;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification.success .notification-content i {
                color: #4CAF50;
            }
            
            .notification.error .notification-content i {
                color: #ff4757;
            }
            
            .notification.info .notification-content i {
                color: #2196F3;
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== 歐式麵包專區主初始化流程 ====================
function initializeBreadPage() {
    console.log('歐式麵包專區頁面加載完成，開始初始化...');
    
    // 初始化歐式麵包評論資料
    initializeBreadReviewsData();
    
    // 初始化歐式麵包評論系統
    initBreadReviewSystem();
    
    // 模態框關閉功能
    fixBreadModalClose();
    
    // 添加通知樣式
    addBreadNotificationStyles();
    
    // 檢查是否有待處理的評分請求
    checkPendingBreadRating();
    
    console.log('歐式麵包專區頁面初始化完成');
}

// ==================== DOM 載入完成後初始化歐式麵包專區 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('歐式麵包專區頁面已載入');
    
    // 初始化所有功能
    initializeAllFeatures();
    
    console.log('所有功能初始化完成');
});

// 初始化所有功能
function initializeAllFeatures() {
    console.log('開始初始化所有功能...');
    
    // 1. 先添加通知樣式（重要！）
    addNotificationStyles();
    
    // 2. 初始化歐式麵包評論系統
    initializeBreadPage();
    
    // 3. 初始化其他功能
    initModals();
    initCart();
    initProductButtons();
    initChat();
    initForms();
    initNavigation();
    initDropdowns();
    initScrollToTop();
    initTopRightButtons();
    
    // 4. 更新UI狀態
    checkLoginStatus();
    updateCartUI();
    updateFollowButtons();
    
    console.log('所有功能初始化完成');
}

// ==================== 調試函數 ====================
// 重置歐式麵包評論資料
function resetBreadReviews() {
    localStorage.removeItem('chulinBreadReviews');
    console.log('歐式麵包評論資料已重置');
    location.reload();
}

// 檢查歐式麵包當前狀態
function checkBreadReviewsStatus() {
    const reviewsData = localStorage.getItem('chulinBreadReviews');
    console.log('=== 歐式麵包評論系統狀態檢查 ===');
    console.log('LocalStorage 中是否有歐式麵包評論資料:', reviewsData ? '是' : '否');
    
    if (reviewsData) {
        const reviews = JSON.parse(reviewsData);
        console.log('所有歐式麵包商品鍵名:', Object.keys(reviews));
        
        // 檢查每個商品
        document.querySelectorAll('.bread-card').forEach((card, index) => {
            const productName = card.querySelector('.bread-name').textContent.trim();
            console.log(`商品 ${index + 1}: "${productName}"`);
            console.log(`  是否有評論:`, reviews[productName] ? '是' : '否');
            if (reviews[productName]) {
                console.log(`  評分:`, reviews[productName].rating);
                console.log(`  評論數量:`, reviews[productName].reviews?.length || 0);
            }
        });
    }
}

// 將調試函數暴露到全局
window.resetBreadReviews = resetBreadReviews;
window.checkBreadReviewsStatus = checkBreadReviewsStatus;

// 全局函數，讓HTML可以呼叫
window.openBreadReviewsModal = openBreadReviewsModal;
window.closeBreadReviewsModal = closeBreadReviewsModal;
window.openBreadRatingModal = openBreadRatingModal;
window.closeBreadRatingModal = closeBreadRatingModal;
window.submitBreadRating = submitBreadRating;
            
/// ==================== 會員登入/註冊模態框功能 ====================
function initModals() {
    console.log('初始化會員模態框功能');
    
    // 獲取模態框相關元素
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 檢查登入狀態
    checkLoginStatus();
    
    // 關閉模態框
    if (closeModalBtn && authModal) {
        closeModalBtn.addEventListener('click', function() {
            authModal.classList.remove('show');
            setTimeout(() => {
                authModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        });
    }
    
    // 點擊背景關閉模態框
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                setTimeout(() => {
                    this.style.display = 'none';
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }
    
    // 切換登入/註冊標籤頁
    modalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有標籤的active狀態
            modalTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加當前標籤的active狀態
            this.classList.add('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
    
    // 登入表單提交
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // 簡單的驗證
            if (!email || !password) {
                showNotification('請填寫所有欄位', 'error');
                return;
            }
            
            // 模擬登入過程
            const loginBtn = this.querySelector('.submit-btn');
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登入中...';
            }
            
            setTimeout(() => {
                // 儲存會員資料 - 確保包含必要的欄位
                const userData = {
                    email: email,
                    name: email.split('@')[0] || '使用者',
                    loginTime: new Date().toISOString(),
                    // 添加 id 以便將來使用
                    id: 'user_' + Date.now()
                };
                
                console.log('登入成功，儲存用戶資料:', userData);
                
                localStorage.setItem('chulin_user', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                // 關閉模態框
                if (authModal) {
                    authModal.classList.remove('show');
                    setTimeout(() => {
                        authModal.style.display = 'none';
                        document.body.style.overflow = '';
                    }, 300);
                }
                
                // 更新UI
                checkLoginStatus();
                showNotification('登入成功！');
                
                // 檢查是否有待處理的評分請求
                const pendingProduct = localStorage.getItem('pendingRatingProduct');
                if (pendingProduct) {
                    console.log('登入成功，自動開啟待處理的評分:', pendingProduct);
                    setTimeout(() => {
                        openRatingModal(pendingProduct);
                        // 清除待處理請求
                        localStorage.removeItem('pendingRatingProduct');
                    }, 300);
                }
                
                // 重置表單
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '登入';
                }
                loginForm.reset();
            }, 1500);
        });
    }
    
    // 註冊表單提交
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // 驗證
            if (!name || !email || !password || !confirmPassword) {
                showNotification('請填寫所有欄位', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('密碼至少需要6個字元', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('密碼與確認密碼不一致', 'error');
                return;
            }
            
            // 模擬註冊過程
            const registerBtn = this.querySelector('.submit-btn');
            if (registerBtn) {
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 註冊中...';
            }
            
            setTimeout(() => {
                // 儲存會員資料
                const userData = {
                    email: email,
                    name: name,
                    registerTime: new Date().toISOString(),
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('chulin_user', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                // 切換到登入標籤
                modalTabs.forEach(tab => {
                    if (tab.getAttribute('data-tab') === 'login') {
                        tab.click();
                    }
                });
                
                // 自動填充登入表單
                document.getElementById('loginEmail').value = email;
                document.getElementById('loginPassword').value = password;
                
                showNotification('註冊成功！已自動為您登入');
                
                // 檢查是否有待處理的評分請求
                const pendingProduct = localStorage.getItem('pendingRatingProduct');
                if (pendingProduct) {
                    console.log('註冊成功，自動開啟待處理的評分:', pendingProduct);
                    setTimeout(() => {
                        openRatingModal(pendingProduct);
                        // 清除待處理請求
                        localStorage.removeItem('pendingRatingProduct');
                    }, 300);
                }
                
                // 重置表單
                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.innerHTML = '註冊';
                }
                registerForm.reset();
            }, 1500);
        });
    }
}

// 檢查登入狀態並更新UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    const profileBtn = document.getElementById('profileBtn');
    
    if (profileBtn) {
        if (isLoggedIn && userData.email) {
            // 已登入狀態
            const displayName = userData.name || userData.email.split('@')[0] || '會員';
            profileBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
            profileBtn.title = `${displayName} 的個人資料`;
            profileBtn.classList.add('logged-in');
        } else {
            // 未登入狀態
            profileBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
            profileBtn.title = '會員登入';
            profileBtn.classList.remove('logged-in');
        }
    }
}

// 顯示會員資料快顯視窗
function showUserProfile() {
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn || !userData.email) return;
    
    // 移除現有的會員資料視窗
    const existingProfile = document.querySelector('.user-profile-popup');
    if (existingProfile) existingProfile.remove();
    
    // 創建會員資料快顯視窗
    const profilePopup = document.createElement('div');
    profilePopup.className = 'user-profile-popup';
    
    profilePopup.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="profile-info">
                <h4>${userData.name || userData.email.split('@')[0] || '會員'}</h4>
                <p>${userData.email}</p>
            </div>
            <button class="close-profile">&times;</button>
        </div>
        <div class="profile-links">
            <a href="../safe/safe.html" class="profile-link">
                <i class="fas fa-user-circle"></i> 帳戶管理
            </a>
            <button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> 登出
            </button>
        </div>
    `;
    
    document.body.appendChild(profilePopup);
    
    // 顯示快顯視窗
    setTimeout(() => {
        profilePopup.classList.add('show');
    }, 10);
    
    // 綁定關閉事件
    const closeBtn = profilePopup.querySelector('.close-profile');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            profilePopup.classList.remove('show');
            setTimeout(() => {
                profilePopup.remove();
            }, 300);
        });
    }
    
    // 點擊背景關閉
    profilePopup.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('show');
            setTimeout(() => {
                this.remove();
            }, 300);
        }
    });
    
    // 點擊連結關閉快顯視窗
    profilePopup.querySelectorAll('.profile-link').forEach(link => {
        link.addEventListener('click', function() {
            profilePopup.classList.remove('show');
            setTimeout(() => {
                profilePopup.remove();
            }, 300);
        });
    });
}

// 登出功能
function logout() {
    // 清除登入狀態
    localStorage.removeItem('isLoggedIn');
    
    showNotification('已成功登出');
    
    // 更新UI
    checkLoginStatus();
    
    // 關閉所有快顯視窗
    document.querySelectorAll('.user-profile-popup').forEach(popup => {
        popup.remove();
    });
    
    // 關閉模態框
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'none';
        authModal.classList.remove('show');
    }
}

// ==================== 購物車功能 ====================
let cart = JSON.parse(localStorage.getItem('chulinCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('chulinWishlist')) || [];

function initCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const continueBtn = document.querySelector('.continue-btn');
    
    // 購物車按鈕點擊
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // 關閉購物車
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 繼續購物按鈕
    if (continueBtn && cartSidebar) {
        continueBtn.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 初始化購物車顯示
    loadCart();
    updateCartUI();
    
    // 結帳按鈕事件
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cart.length === 0) {
                showNotification('購物車是空的，請先添加商品', 'error');
                return;
            }

            // 確保最新購物車資料
            localStorage.setItem('chulinCart', JSON.stringify(cart));

            // 跳轉到結帳頁
            window.location.href = '../pay/pay.html';
        });
    }

    initCartItemEvents();
}

// 載入購物車資料
function loadCart() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        showEmptyCartMessage();
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;
        
        cartItem.innerHTML = `
            <div class="cart-item-img" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">NT$ ${item.price.toLocaleString()}</p>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" type="button">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" type="button">+</button>
                    <button class="remove-item" type="button"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });

}

// 初始化購物車項目事件
function initCartItemEvents() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;

    cartItems.addEventListener('click', function(e) {
        const target = e.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const itemId = cartItem.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        if (target.classList.contains('plus')) {
            cart[itemIndex].quantity += 1;
            updateCart();
        }

        if (target.classList.contains('minus')) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
                updateCart();
            } else {
                removeFromCart(itemId);
            }
        }

        if (target.classList.contains('remove-item') || target.closest('.remove-item')) {
            removeFromCart(itemId);
        }
    });
}

// 更新購物車（保存到 localStorage 並更新UI）
function updateCart() {
    localStorage.setItem('chulinCart', JSON.stringify(cart));
    loadCart();
    updateCartUI();
}

// 添加商品到購物車
function addToCart(product) {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        // 商品已存在，增加數量
        cart[existingItemIndex].quantity += 1;
    } else {
        // 新商品，添加到購物車
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`已將 ${product.name} 加入購物車`, 'success');
}

// 從購物車移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('已從購物車移除商品', 'info');
}

// 更新購物車UI（數量顯示和總金額）
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const totalPrice = document.querySelector('.total-price');
    
    // 計算總數量和總金額
    let totalQuantity = 0;
    let totalAmount = 0;
    
    cart.forEach(item => {
        totalQuantity += item.quantity;
        totalAmount += item.price * item.quantity;
    });
    
    // 更新購物車數量
    if (cartCount) {
        cartCount.textContent = totalQuantity;
        cartCount.style.display = totalQuantity > 0 ? 'flex' : 'none';
    }
    
    // 更新總金額
    if (totalPrice) {
        totalPrice.textContent = `NT$ ${totalAmount.toLocaleString()}`;
    }
    
    // 更新追蹤商品數量
    updateWishlistCount();
}

// 顯示空購物車訊息
function showEmptyCartMessage() {
    const cartItems = document.querySelector('.cart-items');
    if (!cartItems) return;
    
    cartItems.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
            <p>您的購物車是空的</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">快來選購美味的甜點吧！</p>
        </div>
    `;
}

// ==================== 商品按鈕功能 ====================
function initProductButtons() {
    const followBtns = document.querySelectorAll('.btn-follow');
    followBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.bread-card');
            const productId = card.dataset.id;
            const productName = card.querySelector('.bread-name').textContent .trim();
            const productPrice = parseInt(card.querySelector('.bread-price').textContent.replace('NT$ ', '').replace(',', ''));
            const productImage = card.querySelector('img').src;
            
            toggleWishlist(productId, productName, productPrice, productImage);
        });
    });
    
    // 加入購物車按鈕事件
    const cartBtns = document.querySelectorAll('.btn-cart');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.bread-card');
            const productId = card.dataset.id;
            const productName = card.querySelector('.bread-name').textContent .trim();
            const productPrice = parseInt(card.querySelector('.bread-price').textContent.replace('NT$ ', '').replace(',', ''));
            const productImage = card.querySelector('img').src;
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            addToCart(product);
        });
    });
    
    // 追蹤商品按鈕事件
    const trackBtn = document.getElementById('trackBtn');
    if (trackBtn) {
        trackBtn.addEventListener('click', function() {
            showWishlist();
        });
    }
    
    // 初始化商品ID
    initProductIds();
}

// 初始化商品ID
function initProductIds() {
    const cards = document.querySelectorAll('.bread-card');
    cards.forEach((card, index) => {
        card.dataset.id = `bread_${index + 1}`;
    });
}

// ==================== 喜好清單功能 ====================
// 切換追蹤狀態
function toggleWishlist(productId, productName, productPrice, productImage) {
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    const followBtn = document.querySelector(`.bread-card[data-id="${productId}"] .btn-follow`);
    
    if (existingIndex !== -1) {
        // 已追蹤，移除
        wishlist.splice(existingIndex, 1);
        if (followBtn) {
            followBtn.innerHTML = '<i class="fas fa-heart"></i> 追蹤';
            followBtn.style.backgroundColor = '';
        }
        showNotification(`已取消追蹤 ${productName}`, 'info');
    } else {
        // 未追蹤，加入
        wishlist.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        });
        if (followBtn) {
            followBtn.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i> 已追蹤';
            followBtn.style.backgroundColor = 'rgba(255, 71, 87, 0.1)';
        }
        showNotification(`已追蹤 ${productName}`, 'success');
    }
    
    // 保存到 localStorage
    localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    // 更新追蹤按鈕狀態
    updateFollowButtons();
}

// 更新追蹤按鈕狀態
function updateFollowButtons() {
    const followBtns = document.querySelectorAll('.btn-follow');
    followBtns.forEach(btn => {
        const card = btn.closest('.bread-card');
        const productId = card.dataset.id;
        const isTracked = wishlist.some(item => item.id === productId);
        
        if (isTracked) {
            btn.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i> 已追蹤';
            btn.style.backgroundColor = 'rgba(255, 71, 87, 0.1)';
        } else {
            btn.innerHTML = '<i class="fas fa-heart"></i> 追蹤';
            btn.style.backgroundColor = '';
        }
    });
}

// 更新追蹤商品數量
function updateWishlistCount() {
    const trackBadge = document.querySelector('.icon-badge');
    if (trackBadge) {
        trackBadge.textContent = wishlist.length;
        trackBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// 顯示喜好清單
function showWishlist() {
    console.log('顯示喜好清單');
    
    // 移除現有的模態框
    const existingModal = document.getElementById('wishlistModal');
    if (existingModal) existingModal.remove();
    
    // 創建喜好清單模態框
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'wishlistModal';
    
    let wishlistHTML = '';
    
    if (wishlist.length === 0) {
        wishlistHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                <p>您的喜好清單是空的</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">快來追蹤您喜歡的商品吧！</p>
            </div>
        `;
    } else {
        wishlistHTML = `
            <div class="wishlist-container">
                <div class="wishlist-grid">
                    ${wishlist.map(item => `
                        <div class="wishlist-item" data-id="${item.id}">
                            <div class="wishlist-img" style="background-image: url('${item.image}')"></div>
                            <div class="wishlist-info">
                                <h4>${item.name}</h4>
                                <p>NT$ ${item.price.toLocaleString()}</p>
                                <div class="wishlist-actions">
                                    <button class="btn-add-to-cart" data-id="${item.id}">
                                        <i class="fas fa-shopping-cart"></i> 加入購物車
                                    </button>
                                    <button class="btn-remove-wishlist" data-id="${item.id}">
                                        <i class="fas fa-trash-alt"></i> 移除
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="margin: 0; color: var(--dark-color);">
                    <i class="fas fa-heart" style="color: #ff4757;"></i> 
                    我的喜好清單
                    <span style="font-size: 0.8em; background: #ff4757; color: white; padding: 2px 8px; border-radius: 10px; margin-left: 8px;">
                        ${wishlist.length} 件商品
                    </span>
                </h2>
                <span class="close-modal" style="font-size: 1.8rem; cursor: pointer; padding: 0 10px;">&times;</span>
            </div>
            
            ${wishlist.length > 0 ? `
                <div style="color: #666; margin-bottom: 15px; font-size: 0.9rem; background: #f8f9fa; padding: 10px 15px; border-radius: 8px;">
                    <i class="fas fa-info-circle"></i> 
                    點擊商品卡片可查看更多資訊
                </div>
            ` : ''}
            
            ${wishlistHTML}
            
            ${wishlist.length > 0 ? `
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <button class="cta-btn" id="addAllToCartBtn" style="margin-right: 10px; padding: 8px 20px;">
                            <i class="fas fa-cart-plus"></i> 全部加入購物車
                        </button>
                        <button class="btn-remove-wishlist" id="clearWishlistBtn" style="padding: 8px 20px;">
                            <i class="fas fa-trash"></i> 清空清單
                        </button>
                    </div>
                </div>
            ` : ''}
            
            <div style="margin-top: 25px; text-align: center;">
                <button class="cta-btn" id="closeWishlistBtn" style="padding: 10px 40px;">
                    <i class="fas fa-times"></i> 關閉視窗
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 綁定喜好清單事件
    initWishlistEvents(modal);
}

// 初始化喜好清單事件
function initWishlistEvents(modal) {
    // 關閉按鈕
    const closeBtn = modal.querySelector('.close-modal');
    const closeWishlistBtn = modal.querySelector('#closeWishlistBtn');
    
    const closeModalHandler = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
        document.body.style.overflow = '';
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModalHandler);
    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeModalHandler);
    
    // 點擊模態框外部關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });
    
    // 全部加入購物車
    const addAllToCartBtn = modal.querySelector('#addAllToCartBtn');
    if (addAllToCartBtn) {
        addAllToCartBtn.addEventListener('click', () => {
            wishlist.forEach(item => {
                addToCart(item);
            });
            showNotification(`已將 ${wishlist.length} 件商品加入購物車`, 'success');
            closeModalHandler();
        });
    }
    
    // 清空清單
    const clearWishlistBtn = modal.querySelector('#clearWishlistBtn');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', () => {
            if (confirm('確定要清空喜好清單嗎？')) {
                wishlist = [];
                localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
                updateWishlistCount();
                updateFollowButtons();
                showNotification('已清空喜好清單', 'info');
                closeModalHandler();
            }
        });
    }
    
    // 加入購物車按鈕
    modal.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            const product = wishlist.find(item => item.id === productId);
            
            if (product) {
                addToCart(product);
                closeModalHandler();
            }
        });
    });
    
    // 移除按鈕
    modal.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productIndex = wishlist.findIndex(item => item.id === productId);
            
            if (productIndex !== -1) {
                const productName = wishlist[productIndex].name;
                wishlist.splice(productIndex, 1);
                localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
                updateWishlistCount();
                updateFollowButtons();
                showNotification(`已從喜好清單移除 ${productName}`, 'info');
                
                // 重新打開喜好清單以更新顯示
                closeModalHandler();
                setTimeout(() => {
                    showWishlist();
                }, 300);
            }
        });
    });
}

// ==================== 線上客服功能 ====================
function initChat() {
    const chatTrigger = document.querySelector('.chat-trigger');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.querySelector('.close-chat');
    
    // 客服圖示點擊事件
    if (chatTrigger && chatWindow) {
        chatTrigger.addEventListener('click', toggleChat);
    }
    
    // 關閉聊天視窗
    if (closeChat && chatWindow) {
        closeChat.addEventListener('click', toggleChat);
    }
    
    // 初始化聊天輸入框
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        // Enter 鍵發送訊息
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// 切換聊天視窗
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow.style.display === 'flex') {
        chatWindow.style.display = 'none';
    } else {
        chatWindow.style.display = 'flex';
        const chatBody = document.getElementById('chatBody');
        if (chatBody) {
            setTimeout(() => {
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 100);
        }
    }
}

// 發送訊息
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    
    if (!chatInput || !chatBody) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    chatInput.value = '';
    
    setTimeout(() => {
        const response = getChatResponse(message);
        addMessage(response, 'sys');
    }, 1000);
}

// 快速回覆
function quickReply(topic) {
    const responses = {
        '運送問題': '我們的商品通常在下單後1-3個工作天內出貨，宅配約2-4天送達。冷藏商品會使用專用保冷箱運送。',
        '商品諮詢': '我們所有商品都是當日現做，使用天然食材，不含人工添加物。保存期限為冷藏3天，冷凍7天。',
        '訂單查詢': '請提供您的訂單編號，我可以為您查詢訂單狀態。您也可以到「會員中心 > 查詢訂單」查看。',
        '轉接人工': '正在為您轉接人工客服，請稍候...（客服時間：週一至週五 09:00-18:00）'
    };
    
    addMessage(topic, 'user');
    
    setTimeout(() => {
        const response = responses[topic] || '我可以為您提供更多資訊，請具體描述您的問題。';
        addMessage(response, 'sys');
    }, 800);
}

// 添加訊息
function addMessage(text, sender) {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    
    const now = new Date();
    const timeString = `${now.getHours().toString().padStatrt(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    msgDiv.innerHTML = `
        <div class="msg-content">${text}</div>
        <div class="msg-time">${timeString}</div>
    `;
    
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// 生成聊天回覆
function getChatResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('運費') || lowerMsg.includes('運送') || lowerMsg.includes('配送')) {
        return '消費滿$1500免運費，未滿額運費為$150。外島地區運費另計。';
    } else if (lowerMsg.includes('保存') || lowerMsg.includes('期限') || lowerMsg.includes('冷藏')) {
        return '冷藏商品建議3天內食用完畢，冷凍商品可保存7天。食用前請參考包裝上的保存說明。';
    } else if (lowerMsg.includes('訂單') || lowerMsg.includes('查詢') || lowerMsg.includes('狀態')) {
        return '您可以到「會員中心 > 查詢訂單」查看訂單狀態，或提供訂單編號給我，我可以為您查詢。';
    } else if (lowerMsg.includes('營業時間') || lowerMsg.includes('時間')) {
        return '實體門市營業時間：週一至週日 10:00-21:00。線上客服時間：週一至週五 09:00-18:00。';
    } else if (lowerMsg.includes('電話') || lowerMsg.includes('聯絡') || lowerMsg.includes('客服')) {
        return '客服專線：02-2345-6789（週一至週五 09:00-18:00）客服信箱：service@chulin.com.tw';
    } else if (lowerMsg.includes('謝謝') || lowerMsg.includes('感謝')) {
        return '不客氣！如有其他問題，隨時歡迎詢問。祝您有個美好的一天！';
    } else {
        return '感謝您的詢問！關於這個問題，建議您可以直接撥打客服專線 02-2345-6789，或寫信至 service@chulin.com.tw，我們會有專人為您詳細解答。';
    }
}

function initForms() {
    // 登入表單驗證
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!validateEmail(email)) {
                showNotification('請輸入有效的電子郵件地址', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('密碼長度至少為6位', 'error');
                return;
            }
            
            showNotification('登入成功！歡迎回來', 'success');
            
            const authModal = document.getElementById('authModal');
            if (authModal) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            loginForm.reset();
        });
    }
    
    // 註冊表單驗證
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (name.trim().length < 2) {
                showNotification('請輸入有效的姓名', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('請輸入有效的電子郵件地址', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('密碼長度至少為6位', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('兩次輸入的密碼不一致', 'error');
                return;
            }
            
            showNotification('註冊成功！歡迎加入微熱邱林', 'success');
            
            const loginTabBtn = document.querySelector('[data-tab="login"]');
            if (loginTabBtn) {
                loginTabBtn.click();
            }
            
            setTimeout(() => {
                const loginEmail = document.getElementById('loginEmail');
                const loginPassword = document.getElementById('loginPassword');
                if (loginEmail && loginPassword) {
                    loginEmail.value = email;
                    loginPassword.value = password;
                }
            }, 300);
            
            registerForm.reset();
        });
    }
}

// 電子郵件驗證
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== 導航功能 ====================
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (hamburger && mainNav) {
        // 漢堡選單切換
        hamburger.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // 轉換漢堡圖示為 X
            const spans = hamburger.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // 點擊導航連結關閉行動選單
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    // 如果有下拉選單，只切換下拉選單狀態
                    const parentItem = this.parentElement;
                    if (this.querySelector('.fa-chevron-down')) {
                        e.preventDefault();
                        parentItem.classList.toggle('active');
                    } else {
                        // 如果是普通連結，關閉整個選單
                        mainNav.classList.remove('active');
                        hamburger.classList.remove('active');
                        const spans = hamburger.querySelectorAll('span');
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                }
            });
        });
        
        // 點擊頁面其他地方關閉選單
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
                mainNav.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                
                // 關閉所有下拉選單
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }
    
    // 設定當前頁面活動狀態
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// ==================== 下拉選單功能 ====================
function initDropdowns() {
    const nestedDropdowns = document.querySelectorAll('.nested-dropdown');
    
    nestedDropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.classList.add('hover');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.classList.remove('hover');
            }
        });
    });
}

// ==================== 回到頂部功能 ====================
function initScrollToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 切換購物車顯示
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// 切換會員功能
function toggleProfile() {
    console.log('切換會員功能');
    
    // 檢查是否已登入
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    const authModal = document.getElementById('authModal');
    
    if (isLoggedIn && userData.email) {
        // 已登入，顯示會員資料
        console.log('顯示會員資料快顯視窗');
        showUserProfile();
    } else {
        // 未登入，顯示登入模態框
        console.log('顯示登入模態框');
        if (authModal) {
            // 與範例一致的顯示方式
            authModal.style.display = 'flex';
            setTimeout(() => {
                authModal.classList.add('show');
            }, 10);
        }
    }
}

// 右上角按鈕功能
function initTopRightButtons() {
    console.log('初始化右上角按鈕功能');
    
    // 聊天按鈕
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        chatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleChat();
        });
    }
    
    // 追蹤清單按鈕
    const trackBtn = document.getElementById('trackBtn');
    if (trackBtn) {
        trackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showWishlist();
        });
    }
    
    // 購物車按鈕
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
    
    // 會員按鈕
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        console.log('綁定會員按鈕事件');
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('會員按鈕被點擊');
            toggleProfile();
        });

        profileBtn.style.cursor = 'pointer';
        profileBtn.style.position = 'relative';
        profileBtn.style.zIndex = '1002';
    }
}

// 視窗調整大小時重置選單
window.addEventListener('resize', function() {
    const mainNav = document.getElementById('mainNav');
    const hamburger = document.getElementById('hamburger');
    
    if (window.innerWidth > 768) {
        if (mainNav) mainNav.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    }
});

// 初始化完成
console.log('頁面初始化完成');