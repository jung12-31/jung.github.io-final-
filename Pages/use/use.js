// connect.js - 微熱邱林網站功能腳本 (整合會員系統版本)

// ==================== 頁面載入完成後執行 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('頁面初始化中...');
    
    // 初始化所有功能
    initAllFunctions();
});

// ==================== 全局變數 ====================
let cart = JSON.parse(localStorage.getItem('chulinCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('chulinWishlist')) || [];

// ==================== 初始化所有功能 ====================
function initAllFunctions() {
    console.log('開始初始化所有功能...');
    
    // 檢查右上角按鈕元素是否存在
    console.log('檢查右上角按鈕:');
    console.log('- 聊天按鈕:', document.getElementById('chatBtn'));
    console.log('- 追蹤按鈕:', document.getElementById('trackBtn'));
    console.log('- 購物車按鈕:', document.getElementById('cartBtn'));
    console.log('- 會員按鈕:', document.getElementById('profileBtn'));
    
    // 優先初始化右上角按鈕功能
    initTopRightButtons();
    
    // 初始化其他功能
    initNavigation();
    initModals();
    initCart();
    initChat();
    initForms();
    initScrollToTop();
    initDropdowns();
    initContactCards();
    initTrackButton();
    
    // 更新UI狀態
    checkLoginStatus();
    updateWishlistCount();
    updateCartUI();
    
    console.log('所有功能初始化完成');
}

// ==================== 右上角按鈕功能 ====================
function initTopRightButtons() {
    console.log('初始化右上角按鈕功能');
    
    // 1. 聊天按鈕
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        console.log('綁定聊天按鈕事件');
        chatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('聊天按鈕被點擊');
            toggleChat();
        });
        
        chatBtn.style.cursor = 'pointer';
        chatBtn.style.position = 'relative';
        chatBtn.style.zIndex = '1002';
    }
    
    // 2. 追蹤清單按鈕
    const trackBtn = document.getElementById('trackBtn');
    if (trackBtn) {
        console.log('綁定追蹤按鈕事件');
        trackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('追蹤按鈕被點擊');
            showWishlist();
        });
        
        trackBtn.style.cursor = 'pointer';
        trackBtn.style.position = 'relative';
        trackBtn.style.zIndex = '1002';
    }
    
    // 3. 購物車按鈕
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        console.log('綁定購物車按鈕事件');
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('購物車按鈕被點擊');
            toggleCart();
        });
        
        cartBtn.style.cursor = 'pointer';
        cartBtn.style.position = 'relative';
        cartBtn.style.zIndex = '1002';
    }
    
    // 4. 會員按鈕 - 修復這裡！
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        console.log('綁定會員按鈕事件');
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('會員按鈕被點擊 - 開始處理');
            
            // 直接調用 toggleProfile 函數
            toggleProfile();
        });
        
        profileBtn.style.cursor = 'pointer';
        profileBtn.style.position = 'relative';
        profileBtn.style.zIndex = '1002';
    }
}

// ==================== 會員登入/註冊模態框功能 ====================
function initModals() {
    console.log('初始化會員模態框功能');
    
    // 獲取模態框相關元素
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('模態框元素:', {
        authModal: authModal,
        closeModalBtn: closeModalBtn,
        modalTabs: modalTabs.length,
        tabContents: tabContents.length
    });
    
    // 關閉模態框
    if (closeModalBtn && authModal) {
        closeModalBtn.addEventListener('click', function() {
            console.log('關閉模態框按鈕被點擊');
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
                console.log('點擊背景關閉模態框');
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
            console.log('切換到標籤頁:', tabId);
            
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
            console.log('登入表單提交');
            
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
                const authModal = document.getElementById('authModal');
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
            console.log('註冊表單提交');
            
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
    
    console.log('檢查登入狀態:', { isLoggedIn, userData });
    
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
    
    console.log('顯示會員資料，用戶:', userData);
    
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
    console.log('登出');
    
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

// 切換會員功能 
function toggleProfile() {
    console.log('toggleProfile() 函數被調用');
    
    // 檢查是否已登入
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    console.log('登入狀態:', { isLoggedIn, userData });
    
    const authModal = document.getElementById('authModal');
    console.log('找到登入模態框元素:', authModal);
    
    if (isLoggedIn && userData.email) {
        // 已登入，顯示會員資料
        console.log('用戶已登入，顯示會員資料');
        showUserProfile();
    } else {
        // 未登入，顯示登入模態框
        console.log('用戶未登入，顯示登入模態框');
        if (authModal) {
            // 確保模態框可見
            authModal.style.display = 'flex';
            // 添加 show 類以觸發動畫
            setTimeout(() => {
                authModal.classList.add('show');
                console.log('登入模態框已顯示');
            }, 10);
            
            // 阻止背景滾動
            document.body.style.overflow = 'hidden';
            
            // 預設顯示登入標籤頁
            const loginTab = document.querySelector('[data-tab="login"]');
            if (loginTab) {
                loginTab.click();
            }
        } else {
            console.error('找不到登入模態框元素!');
        }
    }
}

// ==================== 購物車功能 ====================
function initCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const continueBtn = document.querySelector('.continue-btn');
    
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
        checkoutBtn.addEventListener('click', function() {
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

// 更新購物車
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

// 更新購物車UI
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

// ==================== 喜好清單功能 ====================
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

// 更新喜好清單數量顯示
function updateWishlistCount() {
    const wishlistBadge = document.querySelector('.icon-badge');
    if (wishlistBadge) {
        const count = wishlist.length;
        wishlistBadge.textContent = count;
        wishlistBadge.style.display = count > 0 ? 'flex' : 'none';
    }
}

// ==================== 工具函數 ====================
function showNotification(message, type = 'success') {
    // 移除現有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;

    // 添加到頁面
    document.body.appendChild(notification);

    // 顯示動畫
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // 關閉按鈕事件
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });

    // 自動關閉
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);

    // 添加樣式（如果不存在）
    ensureNotificationStyles();
}

function ensureNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #06d6a0;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 350px;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification.error {
                background-color: #ff4757;
            }
            .notification.info {
                background-color: #3498db;
            }
            .notification.warning {
                background-color: #ffa502;
            }
            .close-notification {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 15px;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== 線上客服功能 ====================
function initChat() {
    const chatTrigger = document.getElementById('chatTrigger');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    
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
    if (chatWindow.style.display === 'flex' || chatWindow.style.display === '') {
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
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
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
    } else if (lowerMsg.includes('商品') || lowerMsg.includes('甜點') || lowerMsg.includes('推薦')) {
        return '我們最受歡迎的商品有：蘋果派、可麗露、法式葡萄泡芙和經典起司蛋糕。您可以在商品總覽頁面查看所有商品！';
    } else {
        return '感謝您的詢問！關於這個問題，建議您可以直接撥打客服專線 02-2345-6789，或寫信至 service@chulin.com.tw，我們會有專人為您詳細解答。';
    }
}

// ==================== 表單功能 ====================
function initForms() {
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
                authModal.classList.remove('show');
                document.body.style.overflow = '';
            }
            
            loginForm.reset();
        });
    }
    
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

// ==================== 其他初始化功能 ====================
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

// 初始化聯絡卡片
function initContactCards() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // 點擊行動連結
        const actionLink = card.querySelector('.action-link');
        if (actionLink) {
            actionLink.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
}

// 初始化追蹤按鈕
function initTrackButton() {
    const trackBtn = document.getElementById('trackBtn');
    if (trackBtn) {
        trackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('追蹤按鈕被點擊');
            
            // 載入最新的喜好清單資料
            wishlist = JSON.parse(localStorage.getItem('chulinWishlist')) || [];
            
            // 更新追蹤數量顯示
            updateWishlistCount();
            
            // 顯示喜好清單
            showWishlist();
        });
    }
}

// ==================== 輔助功能 ====================
// 切換購物車顯示
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
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

// ==================== 全局導出 ====================
// 讓HTML中的onclick事件可以訪問這些函數
window.showWishlist = showWishlist;
window.closeWishlist = function() {
    const modal = document.getElementById('wishlistModal');
    if (modal) {
        modal.remove();
    }
    document.body.style.overflow = '';
};
window.addAllToCart = function() {
    wishlist.forEach(item => {
        addToCart(item);
    });
    showNotification(`已將 ${wishlist.length} 件商品加入購物車`, 'success');
    const modal = document.getElementById('wishlistModal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
};
window.clearWishlist = function() {
    if (confirm('確定要清空喜好清單嗎？')) {
        wishlist = [];
        localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        showNotification('已清空喜好清單', 'info');
        const modal = document.getElementById('wishlistModal');
        if (modal) modal.remove();
        document.body.style.overflow = '';
    }
};
window.toggleChat = toggleChat;
window.sendMessage = sendMessage;
window.quickReply = quickReply;
window.logout = logout;

// 測試函數：手動添加一些商品到購物車和喜好清單
function testAddItems() {
    const testProduct = {
        id: 999,
        name: "測試商品",
        price: 100,
        image: "./assets/images/default-product.jpg",
        description: "這是一個測試商品"
    };
    
    // 添加測試商品到購物車
    addToCart(testProduct);
    
    // 添加測試商品到喜好清單
    wishlist.push(testProduct);
    localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    console.log('測試商品已添加');
}

// 初始化完成
console.log('頁面初始化完成');