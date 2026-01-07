// activity.js - 微熱邱林優惠活動頁面 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('微熱邱林 - 優惠活動頁面初始化中...');
    
    // 初始化所有按鈕功能
    initAllButtons();
    
    // 初始化其他功能
    initOtherFunctions();
    
    console.log('頁面初始化完成！');
});

// ==================== 按鈕初始化函數 ====================

/**
 * 初始化所有按鈕功能
 */
function initAllButtons() {
    console.log('開始初始化按鈕功能...');
    
    // 1. 聊天按鈕（右上角）
    initChatButton();
    
    // 2. 追蹤按鈕（喜好清單）
    initTrackButton();
    
    // 3. 購物車按鈕
    initCartButton();
    
    // 4. 會員按鈕
    initProfileButton();
    
    // 5. 右下角聊天觸發按鈕
    initChatTriggerButton();
    
    // 6. 優惠活動中的聊天按鈕
    initPromoChatButtons();
    
    // 7. 關閉按鈕
    initCloseButtons();
    
    // 8. 表單提交按鈕
    initFormButtons();
    
    console.log('所有按鈕初始化完成');
}

/**
 * 初始化右上角聊天按鈕
 */
function initChatButton() {
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        console.log('綁定右上角聊天按鈕');
        // 移除舊事件，避免重複綁定
        const newChatBtn = chatBtn.cloneNode(true);
        chatBtn.parentNode.replaceChild(newChatBtn, chatBtn);
        
        // 綁定點擊事件
        newChatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('右上角聊天按鈕被點擊');
            toggleChatWindow();
        });
        
        // 添加懸停效果
        newChatBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        newChatBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    } else {
        console.warn('找不到右上角聊天按鈕');
    }
}

/**
 * 初始化追蹤按鈕（喜好清單）
 */
function initTrackButton() {
    const trackBtn = document.getElementById('trackBtn');
    if (trackBtn) {
        console.log('綁定追蹤按鈕');
        const newTrackBtn = trackBtn.cloneNode(true);
        trackBtn.parentNode.replaceChild(newTrackBtn, trackBtn);
        
        newTrackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('追蹤按鈕被點擊');
            showWishlist();
        });
        
        // 懸停效果
        newTrackBtn.addEventListener('mouseenter', function() {
            this.querySelector('i').style.color = '#ff4757';
        });
        
        newTrackBtn.addEventListener('mouseleave', function() {
            this.querySelector('i').style.color = '';
        });
    } else {
        console.warn('找不到追蹤按鈕');
    }
}

/**
 * 初始化購物車按鈕
 */
function initCartButton() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        console.log('綁定購物車按鈕');
        const newCartBtn = cartBtn.cloneNode(true);
        cartBtn.parentNode.replaceChild(newCartBtn, cartBtn);
        
        newCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('購物車按鈕被點擊');
            toggleCartSidebar();
        });
        
        // 更新購物車數量顯示
        updateCartCount();
    } else {
        console.warn('找不到購物車按鈕');
    }
}

/**
 * 初始化會員按鈕
 */
function initProfileButton() {
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        console.log('綁定會員按鈕');
        const newProfileBtn = profileBtn.cloneNode(true);
        profileBtn.parentNode.replaceChild(newProfileBtn, profileBtn);
        
        newProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('會員按鈕被點擊');
            toggleProfileModal();
        });
        
        // 檢查登入狀態並更新UI
        updateProfileButton();
    } else {
        console.warn('找不到會員按鈕');
    }
}

/**
 * 初始化右下角聊天觸發按鈕
 */
function initChatTriggerButton() {
    const chatTrigger = document.getElementById('chatTrigger');
    if (chatTrigger) {
        console.log('綁定右下角聊天觸發按鈕');
        const newChatTrigger = chatTrigger.cloneNode(true);
        chatTrigger.parentNode.replaceChild(newChatTrigger, chatTrigger);
        
        newChatTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('右下角聊天按鈕被點擊');
            toggleChatWindow();
        });
        
        // 浮動動畫效果
        newChatTrigger.style.animation = 'float 3s ease-in-out infinite';
        
        // 添加CSS動畫
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * 初始化優惠活動中的聊天按鈕
 */
function initPromoChatButtons() {
    const chatButtons = document.querySelectorAll('.chat-btn');
    if (chatButtons.length > 0) {
        console.log(`找到 ${chatButtons.length} 個優惠活動聊天按鈕`);
        
        chatButtons.forEach((btn, index) => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`優惠活動聊天按鈕 ${index + 1} 被點擊`);
                
                // 延遲開啟聊天視窗
                setTimeout(() => {
                    toggleChatWindow();
                    
                    // 自動發送歡迎訊息
                    setTimeout(() => {
                        const welcomeMsg = index === 0 ? 
                            '您好，我想詢問法式塔派與蛋糕的隱藏優惠！' : 
                            '您好，我想詢問大宗訂購的報價！';
                        
                        addMessage(welcomeMsg, 'user');
                        
                        // 自動回覆
                        setTimeout(() => {
                            const replyMsg = index === 0 ?
                                '您好！感謝您的詢問。購買2個以上法式塔派或蛋糕可享9折優惠，詳情請提供您想購買的商品清單。' :
                                '您好！大宗訂購請提供以下資訊：1. 商品清單 2. 數量 3. 配送日期 4. 配送地址，我們將有專人為您報價。';
                            
                            addMessage(replyMsg, 'sys');
                        }, 1000);
                    }, 500);
                }, 300);
            });
            
            // 懸停效果
            newBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#4F4336';
                this.style.color = 'white';
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 6px 12px rgba(79, 67, 54, 0.2)';
            });
            
            newBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
                this.style.color = '#4F4336';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }
}

/**
 * 初始化關閉按鈕
 */
function initCloseButtons() {
    // 關閉聊天視窗
    const closeChat = document.getElementById('closeChat');
    if (closeChat) {
        closeChat.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('關閉聊天視窗按鈕被點擊');
            toggleChatWindow();
        });
    }
    
    // 關閉購物車
    const closeCart = document.querySelector('.close-cart');
    if (closeCart) {
        closeCart.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('關閉購物車按鈕被點擊');
            toggleCartSidebar();
        });
    }
    
    // 關閉登入模態框
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('關閉登入模態框按鈕被點擊');
            closeAuthModal();
        });
    }
}

/**
 * 初始化表單提交按鈕
 */
function initFormButtons() {
    // 登入表單
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('登入表單提交');
            handleLogin();
        });
    }
    
    // 註冊表單
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('註冊表單提交');
            handleRegister();
        });
    }
    
    // 聊天發送按鈕
    const sendBtn = document.querySelector('.send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('聊天發送按鈕被點擊');
            sendChatMessage();
        });
    }
}

// ==================== 核心功能函數 ====================

/**
 * 切換聊天視窗
 */
function toggleChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) {
        console.error('找不到聊天視窗元素');
        return;
    }
    
    const isActive = chatWindow.classList.contains('active');
    
    if (isActive) {
        // 關閉聊天視窗
        chatWindow.classList.remove('active');
        console.log('聊天視窗已關閉');
    } else {
        // 開啟聊天視窗
        chatWindow.classList.add('active');
        console.log('聊天視窗已開啟');
        
        // 滾動到底部
        setTimeout(() => {
            const chatBody = document.getElementById('chatBody');
            if (chatBody) {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }, 100);
    }
}

/**
 * 顯示追蹤清單
 */
function showWishlist() {
    console.log('顯示追蹤清單功能');
    
    // 從 localStorage 讀取追蹤清單
    const wishlist = JSON.parse(localStorage.getItem('chulin_wishlist')) || [];
    
    if (wishlist.length === 0) {
        // 空清單
        showNotification('您的追蹤清單是空的，快來添加喜歡的商品吧！', 'info');
        
        // 示範數據
        const demoWishlist = [
            { name: '法式檸檬塔', price: 180 },
            { name: '手工巧克力餅乾', price: 120 },
            { name: '經典提拉米蘇', price: 220 },
            { name: '藍莓乳酪蛋糕', price: 280 },
            { name: '可麗露 (6入)', price: 350 }
        ];
        
        // 顯示示範清單
        setTimeout(() => {
            let message = '✨ 示範追蹤清單：\n\n';
            demoWishlist.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - NT$ ${item.price}\n`;
            });
            message += '\n實際功能開發中...';
            alert(message);
        }, 300);
    } else {
        // 顯示實際清單
        let message = '❤️ 我的追蹤清單：\n\n';
        wishlist.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - NT$ ${item.price}\n`;
        });
        message += `\n共 ${wishlist.length} 件商品`;
        alert(message);
    }
}

/**
 * 切換購物車側邊欄
 */
function toggleCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (!cartSidebar) {
        console.error('找不到購物車側邊欄元素');
        return;
    }
    
    const isActive = cartSidebar.classList.contains('active');
    
    if (isActive) {
        // 關閉購物車
        cartSidebar.classList.remove('active');
        document.body.style.overflow = '';
        console.log('購物車已關閉');
    } else {
        // 開啟購物車
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('購物車已開啟');
        
        // 更新購物車內容
        loadCartItems();
    }
}

/**
 * 載入購物車項目
 */
function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    // 示範購物車數據
    const demoCartItems = [
        { id: 1, name: '法式蘋果派', price: 200, quantity: 1, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { id: 2, name: '手工餅乾禮盒', price: 350, quantity: 1, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
        { id: 3, name: '經典可頌', price: 150, quantity: 2, image: 'https://images.unsplash.com/photo-1555507036-ab794f27d2e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
    ];
    
    // 清空現有內容
    cartItemsContainer.innerHTML = '';
    
    let totalPrice = 0;
    
    // 添加購物車項目
    demoCartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
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
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // 更新總金額
    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `NT$ ${totalPrice.toLocaleString()}`;
    }
    
    // 綁定購物車項目事件
    initCartItemEvents();
}

/**
 * 初始化購物車項目事件
 */
function initCartItemEvents() {
    // 數量加減按鈕
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const cartItem = this.closest('.cart-item');
            const quantityElement = cartItem.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (this.classList.contains('plus')) {
                quantity++;
            } else if (this.classList.contains('minus') && quantity > 1) {
                quantity--;
            }
            
            quantityElement.textContent = quantity;
            
            // 更新總金額
            updateCartTotal();
            updateCartCount();
        });
    });
    
    // 移除項目按鈕
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const cartItem = this.closest('.cart-item');
            const itemName = cartItem.querySelector('.cart-item-name').textContent;
            
            if (confirm(`確定要移除 ${itemName} 嗎？`)) {
                cartItem.style.animation = 'fadeOut 0.3s ease';
                
                setTimeout(() => {
                    cartItem.remove();
                    updateCartTotal();
                    updateCartCount();
                    showNotification(`${itemName} 已從購物車移除`, 'info');
                    
                    // 如果購物車空了，顯示空購物車訊息
                    if (document.querySelectorAll('.cart-item').length === 0) {
                        showEmptyCartMessage();
                    }
                }, 300);
            }
        });
    });
    
    // 結帳按鈕
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const itemCount = document.querySelectorAll('.cart-item').length;
            if (itemCount === 0) {
                showNotification('購物車是空的，請先添加商品', 'error');
                return;
            }
            
            showNotification(`準備前往結帳 (${itemCount} 件商品)`, 'success');
            
            // 模擬結帳過程
            setTimeout(() => {
                toggleCartSidebar();
                alert('感謝您的購買！\n\n結帳功能開發中，請稍候...');
            }, 1000);
        });
    }
    
    // 繼續購物按鈕
    const continueBtn = document.querySelector('.continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCartSidebar();
        });
    }
}

/**
 * 更新購物車總金額
 */
function updateCartTotal() {
    let totalPrice = 0;
    
    document.querySelectorAll('.cart-item').forEach(item => {
        const price = parseInt(item.querySelector('.cart-item-price').textContent.replace('NT$ ', '').replace(',', ''));
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        totalPrice += price * quantity;
    });
    
    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `NT$ ${totalPrice.toLocaleString()}`;
    }
}

/**
 * 顯示空購物車訊息
 */
function showEmptyCartMessage() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart" style="text-align: center; padding: 60px 20px; color: #9C8F82;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">您的購物車是空的</p>
                <p style="font-size: 0.9rem;">快來選購美味的甜點吧！</p>
            </div>
        `;
    }
}

/**
 * 更新購物車數量顯示
 */
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        let totalQuantity = 0;
        
        document.querySelectorAll('.cart-item').forEach(item => {
            const quantity = parseInt(item.querySelector('.quantity').textContent);
            totalQuantity += quantity;
        });
        
        cartCount.textContent = totalQuantity;
        cartCount.style.display = totalQuantity > 0 ? 'flex' : 'none';
    }
}

/**
 * 切換會員功能
 */
function toggleProfileModal() {
    // 檢查登入狀態
    const isLoggedIn = localStorage.getItem('chulin_loggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    const authModal = document.getElementById('authModal');
    
    if (isLoggedIn && userData.email) {
        // 已登入，顯示會員資訊
        showUserProfile(userData);
    } else {
        // 未登入，顯示登入模態框
        if (authModal) {
            authModal.style.display = 'flex';
            setTimeout(() => {
                authModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 10);
            console.log('顯示登入模態框');
        }
    }
}

/**
 * 顯示會員資料
 */
function showUserProfile(userData) {
    const userName = userData.name || userData.email.split('@')[0] || '尊貴會員';
    
    // 創建會員資料彈窗
    const existingPopup = document.querySelector('.user-profile-popup');
    if (existingPopup) existingPopup.remove();
    
    const profilePopup = document.createElement('div');
    profilePopup.className = 'user-profile-popup';
    profilePopup.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        width: 280px;
        z-index: 5000;
        overflow: hidden;
        animation: fadeIn 0.3s ease;
    `;
    
    profilePopup.innerHTML = `
        <div class="profile-header" style="background: linear-gradient(135deg, #E6D8C9 0%, #DDCDBB 100%); padding: 20px; color: #4F4336;">
            <div style="display: flex; align-items: center;">
                <div style="font-size: 2.5rem; margin-right: 15px;">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div>
                    <h4 style="margin: 0; font-size: 1.1rem;">${userName}</h4>
                    <p style="margin: 5px 0 0 0; font-size: 0.85rem; opacity: 0.8;">${userData.email}</p>
                </div>
            </div>
            <button class="close-profile" style="background: none; border: none; color: #4F4336; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div class="profile-links" style="padding: 15px 0;">
            <a href="../safe/safe.html" class="profile-link" style="display: flex; align-items: center; padding: 12px 20px; color: #333; text-decoration: none; transition: background 0.2s;">
                <i class="fas fa-user-circle" style="width: 24px; margin-right: 12px; color: #667eea;"></i> 帳戶管理
            </a>
            <a href="../record/record.html" class="profile-link" style="display: flex; align-items: center; padding: 12px 20px; color: #333; text-decoration: none; transition: background 0.2s;">
                <i class="fas fa-history" style="width: 24px; margin-right: 12px; color: #4CAF50;"></i> 登入紀錄
            </a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 10px 20px;">
            <button class="logout-btn" onclick="logoutUser()" style="width: calc(100% - 40px); margin: 0 20px; padding: 12px 20px; background: none; border: none; text-align: left; color: #ff4757; cursor: pointer; display: flex; align-items: center; transition: background 0.2s; border-radius: 6px;">
                <i class="fas fa-sign-out-alt" style="color: #ff4757; margin-right: 12px;"></i> 登出
            </button>
        </div>
    `;
    
    document.body.appendChild(profilePopup);
    
    // 綁定關閉事件
    const closeBtn = profilePopup.querySelector('.close-profile');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            profilePopup.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                profilePopup.remove();
            }, 300);
        });
    }
    
    // 點擊背景關閉
    document.addEventListener('click', function closePopup(e) {
        if (!profilePopup.contains(e.target) && !document.getElementById('profileBtn').contains(e.target)) {
            profilePopup.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                profilePopup.remove();
            }, 300);
            document.removeEventListener('click', closePopup);
        }
    });
}

/**
 * 更新會員按鈕狀態
 */
function updateProfileButton() {
    const profileBtn = document.getElementById('profileBtn');
    if (!profileBtn) return;
    
    const isLoggedIn = localStorage.getItem('chulin_loggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    if (isLoggedIn && userData.email) {
        // 已登入狀態
        const userName = userData.name || userData.email.split('@')[0];
        profileBtn.title = `${userName} 的個人資料`;
        profileBtn.classList.add('logged-in');
        
        // 添加登入標記
        const existingBadge = profileBtn.querySelector('.login-badge');
        if (!existingBadge) {
            const badge = document.createElement('span');
            badge.className = 'login-badge';
            badge.style.cssText = `
                position: absolute;
                top: -2px;
                right: -2px;
                width: 8px;
                height: 8px;
                background: #4CAF50;
                border-radius: 50%;
                border: 2px solid white;
            `;
            profileBtn.appendChild(badge);
        }
    } else {
        // 未登入狀態
        profileBtn.title = '會員登入';
        profileBtn.classList.remove('logged-in');
        
        // 移除登入標記
        const existingBadge = profileBtn.querySelector('.login-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
    }
}

// ==================== 登入/註冊功能 ====================

/**
 * 處理登入
 */
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // 驗證
    if (!email || !password) {
        showNotification('請填寫所有欄位', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('請輸入有效的電子郵件地址', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('密碼至少需要6個字元', 'error');
        return;
    }
    
    // 顯示載入狀態
    const loginBtn = document.querySelector('#loginForm .submit-btn');
    const originalText = loginBtn.textContent;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登入中...';
    loginBtn.disabled = true;
    
    // 模擬API呼叫
    setTimeout(() => {
        // 儲存登入狀態
        const userData = {
            email: email,
            name: email.split('@')[0],
            loginTime: new Date().toISOString(),
            id: 'user_' + Date.now()
        };
        
        localStorage.setItem('chulin_user', JSON.stringify(userData));
        localStorage.setItem('chulin_loggedIn', 'true');
        
        // 關閉模態框
        closeAuthModal();
        
        // 更新UI
        updateProfileButton();
        
        // 顯示歡迎訊息
        showNotification(`歡迎回來，${userData.name}！`, 'success');
        
        // 重置表單
        document.getElementById('loginForm').reset();
        
        // 恢復按鈕狀態
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }, 1500);
}

/**
 * 處理註冊
 */
function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // 驗證
    if (!name || !email || !password || !confirmPassword) {
        showNotification('請填寫所有欄位', 'error');
        return;
    }
    
    if (name.length < 2) {
        showNotification('姓名至少需要2個字元', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('請輸入有效的電子郵件地址', 'error');
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
    
    // 檢查是否已註冊
    const existingUsers = JSON.parse(localStorage.getItem('chulin_users')) || [];
    if (existingUsers.some(user => user.email === email)) {
        showNotification('此電子郵件已註冊，請直接登入', 'error');
        return;
    }
    
    // 顯示載入狀態
    const registerBtn = document.querySelector('#registerForm .submit-btn');
    const originalText = registerBtn.textContent;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 註冊中...';
    registerBtn.disabled = true;
    
    // 模擬API呼叫
    setTimeout(() => {
        // 儲存用戶資料
        const userData = {
            email: email,
            name: name,
            registerTime: new Date().toISOString(),
            id: 'user_' + Date.now()
        };
        
        // 保存到用戶列表
        existingUsers.push(userData);
        localStorage.setItem('chulin_users', JSON.stringify(existingUsers));
        
        // 自動登入
        localStorage.setItem('chulin_user', JSON.stringify(userData));
        localStorage.setItem('chulin_loggedIn', 'true');
        
        // 切換到登入標籤
        document.querySelector('[data-tab="login"]').click();
        
        // 自動填充登入表單
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginPassword').value = password;
        
        // 顯示成功訊息
        showNotification(`註冊成功！歡迎 ${name} 加入微熱邱林`, 'success');
        
        // 重置表單
        document.getElementById('registerForm').reset();
        
        // 恢復按鈕狀態
        registerBtn.innerHTML = originalText;
        registerBtn.disabled = false;
        
        // 延遲關閉模態框
        setTimeout(() => {
            closeAuthModal();
            updateProfileButton();
        }, 1000);
    }, 2000);
}

/**
 * 關閉登入模態框
 */
function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('active');
        setTimeout(() => {
            authModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

/**
 * 登出用戶
 */
function logoutUser() {
    // 清除登入狀態
    localStorage.removeItem('chulin_loggedIn');
    
    // 顯示通知
    showNotification('已成功登出', 'info');
    
    // 更新UI
    updateProfileButton();
    
    // 關閉所有彈窗
    document.querySelectorAll('.user-profile-popup').forEach(popup => {
        popup.remove();
    });
}

/**
 * 驗證電子郵件格式
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== 聊天功能 ====================

/**
 * 發送聊天訊息
 */
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) {
        showNotification('請輸入訊息內容', 'error');
        return;
    }
    
    if (message.length > 200) {
        showNotification('訊息內容不能超過200字', 'error');
        return;
    }
    
    // 添加用戶訊息
    addMessage(message, 'user');
    
    // 清空輸入框
    chatInput.value = '';
    
    // 模擬回覆
    setTimeout(() => {
        const response = generateChatResponse(message);
        addMessage(response, 'sys');
    }, 800);
}

/**
 * 添加訊息到聊天視窗
 */
function addMessage(text, sender) {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender}`;
    
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    msgDiv.innerHTML = `
        <div class="msg-content">${text}</div>
        <div class="msg-time">${timeString}</div>
    `;
    
    chatBody.appendChild(msgDiv);
    
    // 滾動到底部
    setTimeout(() => {
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 50);
}

/**
 * 生成聊天回覆
 */
function generateChatResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    // 關鍵字回應
    if (lowerMsg.includes('運費') || lowerMsg.includes('免運')) {
        return '消費滿 $1,500 即可享免運費優惠，未滿額運費為 $150。外島地區運費另計。';
    } else if (lowerMsg.includes('保存') || lowerMsg.includes('期限') || lowerMsg.includes('冷藏')) {
        return '冷藏甜點建議 3 天內食用完畢，冷凍甜點可保存 7 天。食用前請參考包裝上的保存說明。';
    } else if (lowerMsg.includes('訂單') || lowerMsg.includes('查詢')) {
        return '請提供您的訂單編號，或到「會員中心 > 查詢訂單」查看訂單狀態。';
    } else if (lowerMsg.includes('營業時間') || lowerMsg.includes('時間')) {
        return '實體門市營業時間：週一至週日 10:00-21:00\n線上客服時間：週一至週五 09:00-18:00';
    } else if (lowerMsg.includes('電話') || lowerMsg.includes('聯絡')) {
        return '客服專線：02-2345-6789（週一至週五 09:00-18:00）\n客服信箱：service@chulin.com.tw';
    } else if (lowerMsg.includes('謝謝') || lowerMsg.includes('感謝') || lowerMsg.includes('thank')) {
        return '不客氣！如有其他問題，隨時歡迎詢問。祝您有個美好的一天！';
    } else if (lowerMsg.includes('優惠') || lowerMsg.includes('折扣') || lowerMsg.includes('活動')) {
        return '目前有試營運慶典活動，凡購買任一商品即贈 $50 抵用券！詳情請查看優惠活動頁面。';
    } else if (lowerMsg.includes('推薦') || lowerMsg.includes('熱銷') || lowerMsg.includes('好吃')) {
        return '我們的熱銷商品有：法式檸檬塔、可麗露、手工餅乾禮盒和經典提拉米蘇！您可以在熱銷排行頁面查看詳細資訊。';
    } else if (lowerMsg.includes('素食') || lowerMsg.includes('過敏') || lowerMsg.includes('成分')) {
        return '我們的商品使用天然食材，部分商品含有蛋、奶、堅果等過敏原。如有特殊飲食需求，請聯繫客服確認。';
    } else {
        const genericResponses = [
            '感謝您的詢問！關於這個問題，建議您可以查看常見問題頁面，或直接聯繫客服專線。',
            '這個問題可能需要更詳細的資訊，建議您撥打客服專線 02-2345-6789，我們會有專人為您解答。',
            '我理解您的問題了，讓我為您轉接相關資訊...（實際客服功能開發中）',
            '感謝您的提問！微熱邱林致力於提供最好的服務，如有需要請隨時聯繫我們。'
        ];
        return genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
}

/**
 * 快速回覆功能
 */
function quickReply(topic) {
    const responses = {
        '運送問題': '全館消費滿 $1,500 享免運費，未滿額運費 $150。冷藏商品使用專用保冷箱配送。',
        '商品諮詢': '我們的甜點都是當日新鮮製作，使用天然食材，不含人工添加物。保存期限請參考商品說明。',
        '訂單查詢': '請提供訂單編號，我可以為您查詢訂單狀態。您也可以到「會員中心 > 查詢訂單」查看。',
        '轉接人工': '正在為您轉接人工客服，請稍候...（客服時間：週一至週五 09:00-18:00）'
    };
    
    // 添加到聊天
    addMessage(topic, 'user');
    
    // 自動回覆
    setTimeout(() => {
        const response = responses[topic] || '我可以為您提供更多資訊！';
        addMessage(response, 'sys');
    }, 500);
}

// ==================== 其他功能初始化 ====================

/**
 * 初始化其他功能
 */
function initOtherFunctions() {
    console.log('初始化其他功能...');
    
    // 1. 漢堡選單
    initHamburgerMenu();
    
    // 2. 下拉選單
    initDropdowns();
    
    // 3. 聊天快速回覆按鈕
    initQuickReplyButtons();
    
    // 4. 回到頂部按鈕
    initBackToTop();
    
    // 5. 模態框標籤切換
    initModalTabs();
    
    // 6. 添加CSS動畫
    addAnimations();
    
    // 7. 窗口大小調整處理
    initWindowResize();
    
    console.log('其他功能初始化完成');
}

/**
 * 初始化漢堡選單
 */
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // 切換漢堡圖標動畫
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // 點擊外部關閉選單
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !mainNav.contains(e.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

/**
 * 初始化下拉選單
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-item');
    
    dropdowns.forEach(item => {
        // 桌面版：hover 觸發
        if (window.innerWidth > 768) {
            item.addEventListener('mouseenter', function() {
                const dropdown = this.querySelector('.dropdown-menu');
                if (dropdown) {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateY(0)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const dropdown = this.querySelector('.dropdown-menu');
                if (dropdown) {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.transform = 'translateY(10px)';
                }
            });
        } else {
            // 行動版：點擊觸發
            const link = item.querySelector('.nav-link');
            if (link && item.querySelector('.dropdown-menu')) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 關閉其他開啟的選單
                    document.querySelectorAll('.nav-item.active').forEach(activeItem => {
                        if (activeItem !== item) {
                            activeItem.classList.remove('active');
                        }
                    });
                    
                    // 切換當前選單
                    item.classList.toggle('active');
                });
            }
        }
    });
    
    // 點擊頁面其他地方關閉所有下拉選單
    document.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.nav-item.active').forEach(item => {
                item.classList.remove('active');
            });
        }
    });
}

/**
 * 初始化快速回覆按鈕
 */
function initQuickReplyButtons() {
    const quickBtns = document.querySelectorAll('.quick-btns button');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const topic = this.textContent;
            quickReply(topic);
        });
    });
}

/**
 * 初始化回到頂部按鈕
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // 滾動事件
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0';
                setTimeout(() => {
                    if (window.pageYOffset <= 300) {
                        backToTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // 點擊事件
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 懸停效果
        backToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 20px rgba(79, 67, 54, 0.2)';
        });
        
        backToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(79, 67, 54, 0.15)';
        });
    }
}

/**
 * 初始化模態框標籤切換
 */
function initModalTabs() {
    const modalTabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    modalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有active狀態
            modalTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 添加當前active狀態
            this.classList.add('active');
            document.getElementById(tabId + 'Tab').classList.add('active');
        });
    });
}

/**
 * 添加CSS動畫
 */
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * 初始化窗口大小調整處理
 */
function initWindowResize() {
    window.addEventListener('resize', function() {
        const mainNav = document.getElementById('mainNav');
        const hamburger = document.getElementById('hamburger');
        
        // 寬螢幕時關閉漢堡選單
        if (window.innerWidth > 768) {
            if (mainNav) mainNav.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    });
}

// ==================== 通知系統 ====================

let notificationQueue = [];
let isShowingNotification = false;

/**
 * 顯示通知
 */
function showNotification(message, type = 'info') {
    notificationQueue.push({ message, type });
    processNotificationQueue();
}

/**
 * 處理通知隊列
 */
function processNotificationQueue() {
    if (isShowingNotification || notificationQueue.length === 0) return;
    
    isShowingNotification = true;
    const { message, type } = notificationQueue.shift();
    
    // 移除現有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 創建新通知
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 設定樣式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: fadeIn 0.3s ease;
    `;
    
    // 根據類型設定背景色
    const bgColors = {
        'success': '#4CAF50',
        'error': '#f44336',
        'info': '#2196F3',
        'warning': '#ff9800'
    };
    
    notification.style.backgroundColor = bgColors[type] || '#2196F3';
    
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: 10px;">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // 綁定關閉事件
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', function() {
        removeNotification(notification);
    });
    
    // 自動關閉
    setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, 3000);
}

/**
 * 移除通知
 */
function removeNotification(notification) {
    notification.style.animation = 'fadeOut 0.3s ease';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
        isShowingNotification = false;
        processNotificationQueue();
    }, 300);
}

// ==================== 頁面載入完成處理 ====================

// 頁面載入動畫
window.addEventListener('load', function() {
    console.log('頁面完全載入完成');
    
    // 移除載入動畫（如果有的話）
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    }
});

// ==================== 全域函數 ====================

// 確保所有函數都可以在HTML中調用
window.toggleChatWindow = toggleChatWindow;
window.showWishlist = showWishlist;
window.toggleCartSidebar = toggleCartSidebar;
window.toggleProfileModal = toggleProfileModal;
window.sendChatMessage = sendChatMessage;
window.quickReply = quickReply;
window.logoutUser = logoutUser;
window.closeAuthModal = closeAuthModal;

// 聊天輸入框Enter鍵支持
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
});

console.log('activity.js 載入完成！');