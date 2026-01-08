// 結帳頁面專用 JavaScript - pay.js (完整版，已連結會員系統)
(function() {
    'use strict';
    
    console.log('結帳頁面 JavaScript 載入中...');
    
    // 調試函數：檢查所有必要元素
    function checkElements() {
        const elements = [
            'checkoutForm',
            'submitBtn',
            'successModal',
            'orderNumber',
            'orderCode',
            'modalTotal'
        ];
        
        console.log('=== 檢查結帳頁面元素 ===');
        elements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`${id}:`, element ? '✓ 存在' : '✗ 不存在');
        });
        console.log('========================');
    }
    
    // 主初始化函數
    function initCheckoutPage() {
        console.log('初始化結帳頁面...');
        
        checkElements();
        
        // 從 localStorage 讀取購物車
        const cart = JSON.parse(localStorage.getItem('chulinCart')) || [];
        console.log('購物車內容:', cart);
        
        // DOM 元素
        const emptyCartMsg = document.getElementById('emptyCartMessage');
        const checkoutForm = document.getElementById('checkoutForm');
        const checkoutItems = document.getElementById('checkoutItems');
        const submitBtn = document.getElementById('submitBtn');
        
        // 檢查購物車是否為空
        if (cart.length === 0) {
            console.log('購物車為空');
            if (emptyCartMsg) emptyCartMsg.classList.remove('hidden');
            if (checkoutForm) checkoutForm.classList.add('hidden');
            return;
        }
        
        // 顯示購物車商品
        displayCartItems(cart);
        
        // 計算總金額
        calculateTotal(cart);
        
        // 文字計數器
        const noteTextarea = document.getElementById('note');
        const noteCount = document.getElementById('noteCount');
        if (noteTextarea && noteCount) {
            noteTextarea.addEventListener('input', function() {
                noteCount.textContent = this.value.length;
            });
        }
        
        // 運費計算
        const shippingSelect = document.getElementById('shipping');
        if (shippingSelect) {
            shippingSelect.addEventListener('change', function() {
                calculateTotal(cart);
            });
        }
        
        // 優惠券系統
        initCouponSystem(cart);
        
        // 表單驗證
        initFormValidation();
        
        // 新增：自動填充會員資料（如果已登入）
        autoFillMemberInfo();
        
        // 綁定表單提交事件
        if (checkoutForm && submitBtn) {
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('表單提交觸發');
                submitOrder(cart);
            });
            
            // 也綁定按鈕點擊事件（雙重保障）
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('按鈕點擊觸發');
                submitOrder(cart);
            });
        }
        
        // 處理從購物車頁面的跳轉
        handleCartRedirect();
    }
    
    // 顯示購物車商品
    function displayCartItems(cart) {
        const itemsContainer = document.getElementById('checkoutItems');
        if (!itemsContainer) return;
        
        itemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'summary-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-details">
                        數量: ${item.quantity} × NT$ ${item.price.toLocaleString()}
                    </div>
                </div>
                <div class="item-price">NT$ ${itemTotal.toLocaleString()}</div>
            `;
            
            itemsContainer.appendChild(itemElement);
        });
    }
    
    // 計算總金額
    function calculateTotal(cart) {
        // 計算商品小計
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // 計算運費
        const shippingSelect = document.getElementById('shipping');
        const shippingFee = getShippingFee(shippingSelect ? shippingSelect.value : 'home');
        
        // 計算折扣（如果有）
        const discount = parseFloat(localStorage.getItem('chulinDiscount')) || 0;
        
        // 計算總金額
        const total = subtotal + shippingFee - discount;
        
        // 更新顯示
        const subtotalEl = document.getElementById('subtotal');
        const shippingFeeEl = document.getElementById('shippingFee');
        const discountEl = document.getElementById('discount');
        const checkoutTotalEl = document.getElementById('checkoutTotal');
        
        if (subtotalEl) subtotalEl.textContent = `NT$ ${subtotal.toLocaleString()}`;
        if (shippingFeeEl) shippingFeeEl.textContent = `NT$ ${shippingFee.toLocaleString()}`;
        if (discountEl) discountEl.textContent = `- NT$ ${discount.toLocaleString()}`;
        if (checkoutTotalEl) checkoutTotalEl.textContent = `NT$ ${total.toLocaleString()}`;
        
        // 更新結帳按鈕文字
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.innerHTML = `<i class="fas fa-lock"></i> 確認結帳 (NT$ ${total.toLocaleString()})`;
        }
        
        return total;
    }
    
    // 獲取運費
    function getShippingFee(method) {
        switch(method) {
            case 'home':
                return 80;
            case 'store':
                return 60;
            case 'express':
                return 120;
            default:
                return 80;
        }
    }
    
    // 更新運費函數（用於 HTML 的 onchange 屬性）
    function updateShippingFee() {
        const cart = JSON.parse(localStorage.getItem('chulinCart')) || [];
        if (cart.length > 0) {
            calculateTotal(cart);
        }
    }
    
    // 表單驗證初始化
    function initFormValidation() {
        const formInputs = document.querySelectorAll('#checkoutForm input, #checkoutForm select, #checkoutForm textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
        
        // 電話號碼格式化
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) value = value.slice(0, 10);
                
                // 格式化顯示
                if (value.length >= 4 && value.length <= 6) {
                    value = value.slice(0, 4) + '-' + value.slice(4);
                } else if (value.length >= 7) {
                    value = value.slice(0, 4) + '-' + value.slice(4, 7) + '-' + value.slice(7);
                }
                
                e.target.value = value;
            });
        }
    }
    
    // 驗證單一欄位
    function validateField(field) {
        const errorId = `${field.id}Error`;
        const errorElement = document.getElementById(errorId);
        
        if (!field.checkValidity()) {
            field.classList.add('error');
            
            let errorMessage = '';
            if (field.validity.valueMissing) {
                errorMessage = '此為必填欄位';
            } else if (field.validity.typeMismatch) {
                if (field.type === 'email') {
                    errorMessage = '請輸入有效的 Email 地址';
                }
            } else if (field.validity.patternMismatch) {
                if (field.id === 'phone') {
                    errorMessage = '請輸入有效的電話號碼 (格式: 09XX-XXX-XXX)';
                }
            } else if (field.validity.tooShort) {
                errorMessage = `至少需要 ${field.minLength} 個字元`;
            }
            
            if (errorElement) errorElement.textContent = errorMessage;
            return false;
        }
        
        clearError(field);
        return true;
    }
    
    // 清除錯誤訊息
    function clearError(field) {
        field.classList.remove('error');
        const errorId = `${field.id}Error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    // 優惠券系統初始化
    function initCouponSystem(cart) {
        const applyCouponBtn = document.getElementById('applyCoupon');
        const couponCodeInput = document.getElementById('couponCode');
        
        if (applyCouponBtn && couponCodeInput) {
            applyCouponBtn.addEventListener('click', function() {
                applyCoupon(cart);
            });
            
            couponCodeInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    applyCoupon(cart);
                }
            });
        }
    }
    
    // 套用優惠券
    function applyCoupon(cart) {
        const couponCodeInput = document.getElementById('couponCode');
        const couponMessage = document.getElementById('couponMessage');
        
        if (!couponCodeInput || !couponMessage) return;
        
        const couponCode = couponCodeInput.value.trim().toUpperCase();
        let discount = 0;
        let message = '';
        let messageType = '';
        
        // 模擬優惠券驗證
        if (couponCode === '') {
            message = '請輸入優惠代碼';
            messageType = 'error';
        } else if (couponCode === 'CHULIN50') {
            if (cart.reduce((total, item) => total + (item.price * item.quantity), 0) >= 500) {
                discount = 50;
                message = '優惠券已成功套用！折扣 NT$ 50';
                messageType = 'success';
                localStorage.setItem('chulinDiscount', discount.toString());
            } else {
                message = '此優惠券需消費滿 NT$ 500 才能使用';
                messageType = 'error';
            }
        } else if (couponCode === 'FIRSTORDER') {
            discount = 100;
            message = '首購優惠已成功套用！折扣 NT$ 100';
            messageType = 'success';
            localStorage.setItem('chulinDiscount', discount.toString());
        } else {
            message = '優惠券代碼無效或已過期';
            messageType = 'error';
        }
        
        // 顯示訊息
        couponMessage.textContent = message;
        couponMessage.className = `coupon-message ${messageType}`;
        
        // 重新計算總金額
        calculateTotal(cart);
        
        // 清除輸入框
        if (messageType === 'success') {
            couponCodeInput.value = '';
        }
    }
    
    // 新增：自動填充會員資料
    function autoFillMemberInfo() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
        
        if (isLoggedIn && userData.email) {
            console.log('自動填充會員資料:', userData);
            
            // 填充表單欄位
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            const emailInput = document.getElementById('email');
            const addressInput = document.getElementById('address');
            
            if (nameInput && userData.name) nameInput.value = userData.name;
            if (phoneInput && userData.phone) phoneInput.value = userData.phone;
            if (emailInput && userData.email) emailInput.value = userData.email;
            if (addressInput && userData.address) addressInput.value = userData.address;
            
            // 顯示提示訊息
            showCheckoutNotification('已自動載入您的會員資料', 'success');
        }
    }
    
    // 提交訂單 - 連結會員版本
    function submitOrder(cart) {
        console.log('開始提交訂單處理...');
        
        const submitBtn = document.getElementById('submitBtn');
        const checkoutForm = document.getElementById('checkoutForm');
        
        if (!submitBtn || !checkoutForm) {
            showCheckoutNotification('系統錯誤，請刷新頁面重試', 'error');
            return;
        }
        
        // 驗證所有必填欄位
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showCheckoutNotification('請填寫所有必填欄位', 'error');
            return;
        }
        
        // 防止重複提交
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 處理中...';
        
        // 獲取會員資料
        const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
        const userEmail = userData.email || document.getElementById('email').value;
        
        // 檢查是否有會員登入，如果沒有就創建基本會員資料
        let memberData = userData;
        if (!memberData.name || !memberData.email) {
            memberData = {
                ...memberData,
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value
            };
            localStorage.setItem('chulin_user', JSON.stringify(memberData));
            localStorage.setItem('isLoggedIn', 'true');
        }
        
        // 收集訂單資料 - 加入會員ID關聯
        const orderData = {
            orderNumber: generateOrderNumber(),
            customer: {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value
            },
            // 新增：會員關聯資訊
            memberInfo: {
                userId: userData.id || generateUserId(),
                email: userEmail,
                name: userData.name || document.getElementById('name').value,
                isMember: !!userData.email // 是否是已註冊會員
            },
            order: {
                items: cart,
                subtotal: parseFloat(document.getElementById('subtotal').textContent.replace(/[^0-9.]/g, '')),
                shippingFee: parseFloat(document.getElementById('shippingFee').textContent.replace(/[^0-9.]/g, '')),
                discount: parseFloat(document.getElementById('discount').textContent.replace(/[^0-9.]/g, '')),
                total: parseFloat(document.getElementById('checkoutTotal').textContent.replace(/[^0-9.]/g, ''))
            },
            shipping: {
                method: document.getElementById('shipping').value,
                address: document.getElementById('address').value,
                status: 'pending'
            },
            payment: {
                method: document.getElementById('payment').value,
                status: 'pending'
            },
            note: document.getElementById('note').value,
            timestamp: new Date().toISOString(),
            status: 'processing',
            trackingNumber: generateTrackingNumber(),
            estimatedDelivery: getEstimatedDeliveryDate(),
            orderCode: generateOrderCode()
        };
        
        console.log('訂單資料（含會員關聯）:', orderData);
        
        // 模擬 API 請求
        setTimeout(() => {
            try {
                // 儲存訂單到 localStorage
                saveOrderToLocalStorage(orderData);
                
                // 儲存訂單編號和查詢碼到 sessionStorage
                sessionStorage.setItem('lastOrderNumber', orderData.orderNumber);
                sessionStorage.setItem('lastOrderCode', orderData.orderCode);
                
                // 如果是會員，更新會員的訂單紀錄
                if (memberData.email) {
                    updateMemberOrderHistory(memberData.email, orderData.orderNumber);
                }
                
                // 清空購物車和折扣
                localStorage.removeItem('chulinCart');
                localStorage.removeItem('chulinDiscount');
                
                // 顯示成功訊息
                showSuccessModal(orderData);
                
                // 重置按鈕狀態
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-lock"></i> 確認結帳';
                
                console.log('訂單提交完成，已關聯會員');
                
            } catch (error) {
                console.error('訂單處理錯誤:', error);
                showCheckoutNotification('訂單處理失敗，請稍後再試', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-lock"></i> 確認結帳';
            }
        }, 1500);
    }
    
    // 新增：生成會員ID
    function generateUserId() {
        return 'USER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    // 新增：更新會員訂單紀錄
    function updateMemberOrderHistory(userEmail, orderNumber) {
        try {
            // 取得會員資料
            const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
            
            // 初始化訂單紀錄陣列
            if (!userData.orderHistory) {
                userData.orderHistory = [];
            }
            
            // 添加新訂單
            userData.orderHistory.unshift({
                orderNumber: orderNumber,
                date: new Date().toISOString()
            });
            
            // 只保留最近的20筆訂單
            if (userData.orderHistory.length > 20) {
                userData.orderHistory = userData.orderHistory.slice(0, 20);
            }
            
            // 儲存會員資料
            localStorage.setItem('chulin_user', JSON.stringify(userData));
            console.log('會員訂單紀錄已更新:', userData.orderHistory);
            
        } catch (error) {
            console.error('更新會員訂單紀錄失敗:', error);
        }
    }
    
    // 生成訂單編號
    function generateOrderNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        return `CHU-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
    }
    
    // 生成查詢碼
    function generateOrderCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    
    // 生成追蹤號碼
    function generateTrackingNumber() {
        const prefix = 'TW';
        const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        return `${prefix}${random}TW`;
    }
    
    // 獲取預計送達日期
    function getEstimatedDeliveryDate() {
        const now = new Date();
        const deliveryDays = 3;
        now.setDate(now.getDate() + deliveryDays);
        return now.toISOString().split('T')[0];
    }
    
    // 儲存訂單到 localStorage
    function saveOrderToLocalStorage(orderData) {
        try {
            let existingOrders = [];
            const storedOrders = localStorage.getItem('chulinOrders');
            
            if (storedOrders) {
                try {
                    existingOrders = JSON.parse(storedOrders);
                } catch (e) {
                    console.error('解析訂單資料失敗:', e);
                    existingOrders = [];
                }
            }
            
            if (!Array.isArray(existingOrders)) {
                existingOrders = [];
            }
            
            existingOrders.unshift(orderData);
            
            // 只保留最近的50筆訂單
            if (existingOrders.length > 50) {
                existingOrders = existingOrders.slice(0, 50);
            }
            
            localStorage.setItem('chulinOrders', JSON.stringify(existingOrders));
            console.log('訂單已儲存，目前總數:', existingOrders.length);
            
            return true;
        } catch (error) {
            console.error('儲存訂單失敗:', error);
            throw error;
        }
    }
    
    // 顯示成功模態框 - 增強版
    function showSuccessModal(orderData) {
        console.log('顯示成功訊息，訂單資料:', orderData);
        
        // 1. 填寫 HTML Modal 裡的內容
        const modalOrderNum = document.getElementById('orderNumber');
        const modalOrderCode = document.getElementById('orderCode');
        const modalTotal = document.getElementById('modalTotal');
        const successModal = document.getElementById('successModal');
        
        if (modalOrderNum) modalOrderNum.textContent = orderData.orderNumber;
        if (modalOrderCode) modalOrderCode.textContent = orderData.orderCode;
        if (modalTotal) modalTotal.textContent = `NT$ ${orderData.order.total.toLocaleString()}`;
        
        // 2. 顯示 Modal
        if (successModal) {
            successModal.classList.remove('hidden');
            successModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 防止背景捲動
        } else {
            // 如果找不到 Modal 元素，使用備案 alert
            alert(`訂單已送出！\n訂單編號：${orderData.orderNumber}\n查詢碼：${orderData.orderCode}\n總金額：NT$ ${orderData.order.total.toLocaleString()}`);
        }
        
        // 3. 儲存查詢資訊 - 非常重要！儲存到 sessionStorage
        sessionStorage.setItem('queryOrderNumber', orderData.orderNumber);
        sessionStorage.setItem('queryOrderCode', orderData.orderCode);
        // 儲存完整訂單資料以供訂單查詢頁面使用
        sessionStorage.setItem('latestOrderData', JSON.stringify(orderData));
        
        // 4. 如果是會員，提示可以到會員中心查看
        const isMember = orderData.memberInfo?.isMember;
        if (isMember) {
            // 可以在模態框添加額外提示
            console.log('會員訂單已建立，可在會員中心查看');
            
            // 延遲顯示提示
            setTimeout(() => {
                showCheckoutNotification('訂單已建立，您可以在會員中心的「訂單紀錄」查看此訂單', 'info');
            }, 2000);
        }
        
        console.log('訂單提交完成，等待使用者關閉彈窗');
    }
    
    // 處理從購物車頁面的跳轉
    function handleCartRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        const fromCart = urlParams.get('fromCart');
        
        if (fromCart === 'true') {
            showCheckoutNotification('已從購物車跳轉至結帳頁面', 'success');
            
            // 清除 URL 參數
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }
    
    // 返回購物車
    function goBackToCart() {
        if (confirm('確定要返回購物車嗎？已填寫的資料將會遺失。')) {
            window.location.href = '../overview/overview.html';
        }
    }
    
    // 顯示結帳頁面專用通知
    function showCheckoutNotification(message, type = 'info') {
        // 移除現有的通知
        const existingNotification = document.querySelector('.checkout-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `checkout-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;
        
        // 添加到頁面
        document.body.appendChild(notification);
        
        // 添加樣式（如果不存在）
        if (!document.querySelector('#checkout-notification-style')) {
            const style = document.createElement('style');
            style.id = 'checkout-notification-style';
            style.textContent = `
                .checkout-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(79, 67, 54, 0.2);
                    z-index: 2001;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                    border-left: 4px solid #ddd;
                }
                
                .checkout-notification.show {
                    transform: translateX(0);
                }
                
                .checkout-notification.success {
                    border-left-color: #4CAF50;
                }
                
                .checkout-notification.error {
                    border-left-color: #f44336;
                }
                
                .checkout-notification.info {
                    border-left-color: #4F4336;
                }
                
                .close-notification {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #666;
                    margin-left: 15px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // 顯示通知
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 關閉按鈕事件
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
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
        }, 5000);
    }
    
    // 初始化測試數據（僅供開發測試）
    function initTestData() {
        // 清除現有數據
        localStorage.removeItem('chulinCart');
        localStorage.removeItem('chulinOrders');
        
        // 創建測試購物車
        const testCart = [
            {
                id: 'test-1',
                name: '測試商品 - 法式檸檬塔',
                price: 120,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587'
            },
            {
                id: 'test-2',
                name: '測試商品 - 經典巧克力蛋糕',
                price: 280,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c'
            }
        ];
        
        localStorage.setItem('chulinCart', JSON.stringify(testCart));
        console.log('測試購物車已建立:', testCart);
        
        // 更新顯示
        setTimeout(() => {
            location.reload();
        }, 100);
    }
    
    // 頁面載入完成後初始化
    document.addEventListener('DOMContentLoaded', function() {
        console.log('結帳頁面 DOM 載入完成');
        initCheckoutPage();
        
        // 開發測試：在控制台輸入 initTestData() 來創建測試數據
        window.initTestData = initTestData;
    });
    
    // 暴露必要的函數給全局
    
    // 複製到剪貼簿
    window.copyToClipboard = function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const text = element.textContent || element.innerText;
            navigator.clipboard.writeText(text).then(() => {
                showCheckoutNotification('已複製到剪貼簿', 'success');
            }).catch(err => {
                console.error('複製失敗:', err);
                // 備用方法
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showCheckoutNotification('已複製到剪貼簿', 'success');
            });
        }
    };
    
    // 查詢訂單狀態 - 連接到訂單查詢頁面
    window.checkOrderStatus = function() {
        console.log('查詢訂單狀態...');
        
        // 從模態框獲取訂單編號和查詢碼
        const orderNumber = document.getElementById('orderNumber')?.textContent;
        const orderCode = document.getElementById('orderCode')?.textContent;
        
        if (orderNumber && orderCode) {
            console.log('訂單資訊:', { orderNumber, orderCode });
            
            // 儲存到 sessionStorage（使用多個鍵以確保訂單查詢頁面能找到）
            sessionStorage.setItem('lastOrderNumber', orderNumber);
            sessionStorage.setItem('lastOrderCode', orderCode);
            sessionStorage.setItem('queryOrderNumber', orderNumber);
            sessionStorage.setItem('queryOrderCode', orderCode);
            
            // 關閉模態框
            closeSuccessModal();
            
            // 延遲跳轉，確保 sessionStorage 已儲存
            setTimeout(() => {
                // 跳轉到訂單查詢頁面
                window.location.href = '../order/order.html';
            }, 300);
        } else {
            // 如果模態框中沒有找到，嘗試從 sessionStorage 獲取
            const storedOrderNumber = sessionStorage.getItem('lastOrderNumber') || 
                                       sessionStorage.getItem('queryOrderNumber');
            const storedOrderCode = sessionStorage.getItem('lastOrderCode') || 
                                     sessionStorage.getItem('queryOrderCode');
            
            if (storedOrderNumber && storedOrderCode) {
                console.log('從 sessionStorage 獲取訂單資訊:', { storedOrderNumber, storedOrderCode });
                
                // 確保資料儲存
                sessionStorage.setItem('queryOrderNumber', storedOrderNumber);
                sessionStorage.setItem('queryOrderCode', storedOrderCode);
                
                closeSuccessModal();
                
                setTimeout(() => {
                    window.location.href = '../order/order.html';
                }, 300);
            } else {
                showCheckoutNotification('無法獲取訂單資訊，請稍後再試', 'error');
            }
        }
    };
    
    // 關閉成功模態框
    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('show');
            document.body.style.overflow = ''; // 恢復背景捲動
        }
    };
    
    // 更新運費（暴露給全局）
    window.updateShippingFee = updateShippingFee;
    
    // 返回購物車
    window.goBackToCart = goBackToCart;
    
    console.log('結帳頁面 JavaScript 載入完成');
})();