// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    console.log('頁面初始化中...');
    
    // 初始化所有功能
    initAllFunctions();
});

// 初始化所有功能
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
    
    // 初始化商品按鈕（重要！先初始化才能確保按鈕有功能）
    initProductButtons();
    
    // 初始化其他功能
    initNavigation();
    initModals();
    initCart();
    initChat();
    initForms();
    initScrollToTop();
    initDropdowns();
    
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
        
        // 確保按鈕樣式正確
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
    
    // 4. 會員按鈕
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        console.log('綁定會員按鈕事件');
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('會員按鈕被點擊');
            toggleProfile();
        });
        
        profileBtn.style.cursor = 'pointer';
        profileBtn.style.position = 'relative';
        profileBtn.style.zIndex = '1002';
    }
}

// ==================== 商品按鈕功能 ====================
function initProductButtons() {
    console.log('初始化商品按鈕功能');
    
    // 1. 載入喜好清單數據
    loadWishlist();
    
    // 2. 為所有追蹤按鈕添加事件監聽器
    document.querySelectorAll('.btn-track').forEach((button, index) => {
        // 清除舊的事件監聽器（避免重複綁定）
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // 重新綁定追蹤按鈕事件
    document.querySelectorAll('.btn-track').forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('追蹤按鈕被點擊，索引:', index);
            
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseInt(this.dataset.price) || 0;
            const productImage = this.dataset.image;
            
            console.log('追蹤產品資訊:', { productId, productName, productPrice, productImage });
            
            // 創建產品物件
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            // 切換追蹤狀態
            toggleWishlistItem(product, this);
        });
        
        // 確保按鈕可點擊
        button.style.cursor = 'pointer';
        button.style.pointerEvents = 'auto';
        button.style.position = 'relative';
    });
    
    // 3. 為所有加入購物車按鈕添加事件監聽器
    document.querySelectorAll('.btn-add-to-cart').forEach((button, index) => {
        // 清除舊的事件監聽器
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // 重新綁定購物車按鈕事件
    document.querySelectorAll('.btn-add-to-cart').forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('加入購物車按鈕被點擊，索引:', index);
            
            const productId = this.dataset.id;
            const productName = this.dataset.name;
            const productPrice = parseInt(this.dataset.price) || 0;
            const productImage = this.dataset.image;
            
            console.log('添加到購物車的產品:', { productId, productName, productPrice });
            
            // 創建產品物件
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            // 添加到購物車
            addToCart(product);
        });
        
        // 確保按鈕可點擊
        button.style.cursor = 'pointer';
        button.style.pointerEvents = 'auto';
        button.style.position = 'relative';
    });
    
    // 4. 檢查每個商品是否已在追蹤清單中，更新按鈕狀態
    checkWishlistStatus();
    
    console.log('商品按鈕初始化完成:');
    console.log('- 追蹤按鈕:', document.querySelectorAll('.btn-track').length, '個');
    console.log('- 購物車按鈕:', document.querySelectorAll('.btn-add-to-cart').length, '個');
}

// ==================== 追蹤/喜好清單功能 ====================
let wishlist = [];

// 載入喜好清單
function loadWishlist() {
    const savedWishlist = localStorage.getItem('chulinWishlist');
    wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    console.log('載入喜好清單:', wishlist.length, '個項目');
    updateWishlistCount();
}

// 切換追蹤狀態
function toggleWishlistItem(product, button) {
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
        // 已追蹤，移除
        wishlist.splice(existingIndex, 1);
        localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
        
        // 更新按鈕狀態
        if (button) {
            button.innerHTML = '<i class="fas fa-heart"></i> 追蹤';
            button.classList.remove('followed');
            button.style.color = '#4F4336';
            button.style.borderColor = 'rgba(79, 67, 54, 0.2)';
        }
        
        showNotification(`已取消追蹤 ${product.name}`, 'info');
        console.log('取消追蹤:', product.name);
    } else {
        // 未追蹤，添加
        wishlist.push(product);
        localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
        
        // 更新按鈕狀態
        if (button) {
            button.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i> 已追蹤';
            button.classList.add('followed');
            button.style.color = '#ff4757';
            button.style.borderColor = '#ff4757';
        }
        
        showNotification(`已追蹤 ${product.name}`, 'success');
        console.log('追蹤:', product.name);
    }
    
    // 更新右上角追蹤數量
    updateWishlistCount();
}

// 檢查追蹤狀態並更新按鈕
function checkWishlistStatus() {
    document.querySelectorAll('.btn-track').forEach(button => {
        const productId = button.dataset.id;
        const isInWishlist = wishlist.some(item => item.id === productId);
        
        if (isInWishlist) {
            button.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i> 已追蹤';
            button.classList.add('followed');
            button.style.color = '#ff4757';
            button.style.borderColor = '#ff4757';
        } else {
            button.innerHTML = '<i class="fas fa-heart"></i> 追蹤';
            button.classList.remove('followed');
            button.style.color = '#4F4336';
            button.style.borderColor = 'rgba(79, 67, 54, 0.2)';
        }
    });
}

// 更新追蹤商品數量
function updateWishlistCount() {
    const trackBadge = document.querySelector('.icon-badge');
    if (trackBadge) {
        trackBadge.textContent = wishlist.length;
        trackBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
        console.log('更新追蹤數量:', wishlist.length);
    }
}

// 顯示喜好清單
function showWishlist() {
    console.log('顯示喜好清單，項目數:', wishlist.length);
    
    // 移除現有的模態框（避免重複）
    const existingModal = document.getElementById('wishlistModal');
    if (existingModal) {
        existingModal.remove();
        document.body.style.overflow = '';
    }
    
    // 創建喜好清單模態框
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'wishlistModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // 延遲顯示以觸發動畫
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    let wishlistContent = '';
    
    if (wishlist.length === 0) {
        wishlistContent = `
            <div class="empty-wishlist" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-heart" style="font-size: 4rem; color: #eee; margin-bottom: 20px;"></i>
                <h3 style="color: #666; margin-bottom: 10px;">您的喜好清單是空的</h3>
                <p style="color: #999;">快來追蹤您喜歡的商品吧！</p>
            </div>
        `;
    } else {
        wishlistContent = `
            <div class="wishlist-container" style="max-height: 500px; overflow-y: auto; padding: 10px;">
                <div class="wishlist-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                    ${wishlist.map(item => `
                        <div class="wishlist-item" data-id="${item.id}" style="border: 1px solid #eee; border-radius: 10px; overflow: hidden; background: white; transition: transform 0.3s ease;">
                            <div class="wishlist-img" style="height: 180px; background-image: url('${item.image}'); background-size: cover; background-position: center; background-color: #f8f9fa;"></div>
                            <div class="wishlist-info" style="padding: 15px;">
                                <h4 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #333;">${item.name}</h4>
                                <p style="margin: 0 0 15px 0; font-size: 1.2rem; color: #e63946; font-weight: bold;">NT$ ${item.price.toLocaleString()}</p>
                                <div class="wishlist-actions" style="display: flex; gap: 10px;">
                                    <button class="wishlist-add-to-cart" data-id="${item.id}" style="flex: 1; padding: 10px; background: #2a9d8f; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9rem;">
                                        <i class="fas fa-shopping-cart"></i> 加入購物車
                                    </button>
                                    <button class="wishlist-remove" data-id="${item.id}" style="width: 40px; padding: 10px; background: #ff4757; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                        <i class="fas fa-trash-alt"></i>
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
        <div class="modal-content" style="background: white; border-radius: 15px; padding: 25px; max-width: 900px; width: 90%; max-height: 80vh; overflow: hidden; transform: translateY(20px); transition: transform 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
                <h2 style="margin: 0; color: #333; font-size: 1.5rem;">
                    <i class="fas fa-heart" style="color: #ff4757; margin-right: 10px;"></i> 
                    我的喜好清單
                    <span style="font-size: 0.8rem; background: #ff4757; color: white; padding: 2px 8px; border-radius: 10px; margin-left: 10px; font-weight: normal;">
                        ${wishlist.length} 件商品
                    </span>
                </h2>
                <button class="close-wishlist-modal" style="background: none; border: none; font-size: 1.8rem; color: #666; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.3s;">
                    &times;
                </button>
            </div>
            
            ${wishlist.length > 0 ? `
                <div style="color: #666; margin-bottom: 20px; font-size: 0.9rem; background: #f8f9fa; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #2a9d8f;">
                    <i class="fas fa-info-circle" style="color: #2a9d8f; margin-right: 8px;"></i> 
                    追蹤的商品會在此顯示，方便您快速查看與購買
                </div>
            ` : ''}
            
            ${wishlistContent}
            
            ${wishlist.length > 0 ? `
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; gap: 12px;">
                        <button class="wishlist-add-all" style="padding: 12px 24px; background: #2a9d8f; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; display: flex; align-items: center;">
                            <i class="fas fa-cart-plus" style="margin-right: 8px;"></i> 全部加入購物車
                        </button>
                        <button class="wishlist-clear" style="padding: 12px 24px; background: #ff4757; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; display: flex; align-items: center;">
                            <i class="fas fa-trash" style="margin-right: 8px;"></i> 清空清單
                        </button>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 延遲添加動畫效果
    setTimeout(() => {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'translateY(0)';
        }
    }, 20);
    
    // 綁定模態框事件
    initWishlistModalEvents();
}

// 初始化喜好清單模態框事件
function initWishlistModalEvents() {
    const modal = document.getElementById('wishlistModal');
    if (!modal) return;
    
    // 關閉按鈕
    const closeBtn = modal.querySelector('.close-wishlist-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.opacity = '0';
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(20px)';
            }
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        });
        
        // 添加 hover 效果
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = '#f5f5f5';
        });
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = 'none';
        });
    }
    
    // 點擊背景關閉
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            modal.style.opacity = '0';
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(20px)';
            }
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    });
    
    // 全部加入購物車按鈕
    const addAllBtn = modal.querySelector('.wishlist-add-all');
    if (addAllBtn) {
        addAllBtn.addEventListener('click', function() {
            if (wishlist.length === 0) {
                showNotification('喜好清單是空的', 'error');
                return;
            }
            
            wishlist.forEach(product => {
                addToCart(product);
            });
            showNotification(`已將 ${wishlist.length} 件商品加入購物車`, 'success');
        });
    }
    
    // 清空清單按鈕
    const clearBtn = modal.querySelector('.wishlist-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (wishlist.length === 0) {
                showNotification('喜好清單已經是空的', 'info');
                return;
            }
            
            if (confirm(`確定要清空喜好清單嗎？將會移除 ${wishlist.length} 件商品`)) {
                wishlist = [];
                localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
                updateWishlistCount();
                checkWishlistStatus();
                showNotification('已清空喜好清單', 'info');
                
                // 關閉模態框
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }
    
    // 加入購物車按鈕
    modal.querySelectorAll('.wishlist-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            const product = wishlist.find(item => item.id === productId);
            
            if (product) {
                addToCart(product);
                showNotification(`已將 ${product.name} 加入購物車`, 'success');
            }
        });
    });
    
    // 移除按鈕
    modal.querySelectorAll('.wishlist-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            const productIndex = wishlist.findIndex(item => item.id === productId);
            
            if (productIndex !== -1) {
                const productName = wishlist[productIndex].name;
                wishlist.splice(productIndex, 1);
                localStorage.setItem('chulinWishlist', JSON.stringify(wishlist));
                updateWishlistCount();
                checkWishlistStatus();
                showNotification(`已從喜好清單移除 ${productName}`, 'info');
                
                // 重新整理喜好清單顯示
                modal.remove();
                setTimeout(() => {
                    showWishlist();
                }, 100);
            }
        });
    });
}

// ==================== 購物車功能 ====================
let cart = JSON.parse(localStorage.getItem('chulinCart')) || [];

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
        console.log('增加商品數量:', product.name, '新數量:', cart[existingItemIndex].quantity);
    } else {
        // 新商品，添加到購物車
        cart.push({
            ...product,
            quantity: 1
        });
        console.log('新增商品到購物車:', product.name);
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

// 切換購物車顯示
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// ==================== 以下保持原有的其他函數不變 ====================

// 切換會員功能
function toggleProfile() {
    console.log('切換會員功能');
    
    // 檢查是否已登入
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    const authModal = document.getElementById('authModal');
    
    if (isLoggedIn && userData.email) {
        // 已登入，顯示會員資料
        showUserProfile();
    } else {
        // 未登入，顯示登入模態框
        if (authModal) {
            authModal.style.display = 'flex';
            setTimeout(() => {
                authModal.classList.add('show');
            }, 10);
        }
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
    
    // 檢查登入狀態
    checkLoginStatus();
    
    // 關閉模態框
    if (closeModalBtn && authModal) {
        closeModalBtn.addEventListener('click', function() {
            authModal.classList.remove('show');
            setTimeout(() => {
                authModal.style.display = 'none';
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
                // 儲存會員資料
                const userData = {
                    email: email,
                    name: email.split('@')[0] || '使用者',
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('chulin_user', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');
                
                // 關閉模態框
                if (authModal) {
                    authModal.classList.remove('show');
                    setTimeout(() => {
                        authModal.style.display = 'none';
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
    
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.querySelector('.logout-btn');
    
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
    const chatBody = document.getElementById('chatBody');
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
        return '冷藏甜點建議3天內食用完畢，冷凍甜點可保存7天。食用前請參考包裝上的保存說明。';
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
                authModal.classList.remove('active');
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

// ==================== 其他初始化功能 ====================
function initNavigation() {
    // 漢堡選單功能
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

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

// ==================== 通知功能 ====================
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
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