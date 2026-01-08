// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    console.log('帳戶安全管理頁面初始化中...');
    
    // 初始化所有功能
    initAccountPage();
    initNavigation();
    initModals(); // 修正：確保會員模態框正確初始化
    initCart();
    initChat();
    toggleChat()
    initForms();
    initScrollToTop();
    initDropdowns();
    
    // 初始化商品按鈕（包含喜好清單功能）
    initProductButtons();
    
    console.log('所有功能初始化完成');
});

// ==================== 會員登入/註冊模態框功能 ====================
function initModals() {
    console.log('初始化會員模態框功能');
    
    // 獲取模態框相關元素
    const authModal = document.getElementById('authModal');
    const profileBtn = document.getElementById('profileBtn');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalTabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 檢查登入狀態
    checkLoginStatus();
    
    // 會員頭像按鈕點擊事件
    if (profileBtn && authModal) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('會員頭像按鈕被點擊');
            
            // 檢查是否已登入
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
            
            if (isLoggedIn && userData.email) {
                // 已登入，直接顯示會員資料
                showUserProfile();
            } else {
                // 未登入，顯示登入模態框
                authModal.style.display = 'flex';
                setTimeout(() => {
                    authModal.classList.add('show');
                }, 10);
            }
        });
    }
    
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
                
                // 重新載入訂單紀錄
                setTimeout(() => {
                    loadMemberOrders();
                }, 500);
                
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
            // 已登入狀態 - 保持原來的圖標，只改變樣式
            const displayName = userData.name || userData.email.split('@')[0] || '會員';
            profileBtn.innerHTML = '<i class="fas fa-user-circle"></i>'; // 只保留圖標
            profileBtn.title = `${displayName} 的個人資料`;
            
            // 添加已登入樣式
            profileBtn.classList.add('logged-in');
        } else {
            // 未登入狀態
            profileBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
            profileBtn.title = '會員登入';
            profileBtn.classList.remove('logged-in');
        }
    }
    
    // 更新登出按鈕顯示
    if (logoutBtn) {
        if (isLoggedIn) {
            logoutBtn.style.display = 'block';
        } else {
            logoutBtn.style.display = 'none';
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
            <a href="safe.html" class="profile-link">
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
    
    // 保留會員資料（可選擇性清除）
    // localStorage.removeItem('chulin_user');
    
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
    
    // 重新載入訂單紀錄（顯示空狀態）
    setTimeout(() => {
        loadMemberOrders();
    }, 500);
}

// ==================== 帳戶頁面核心功能 ====================
function initAccountPage() {
    console.log('初始化帳戶頁面功能');
    
    // 先隱藏所有內容區塊
    document.querySelectorAll('.content-box').forEach(box => {
        box.style.display = 'none';
    });
    
    // 預設顯示個人資料區塊
    const profileSection = document.getElementById('profile');
    if (profileSection) {
        profileSection.style.display = 'block';
    }
    
    // 只有在明確要求時才顯示評論區塊
    const urlParams = new URLSearchParams(window.location.search);
    const showReviews = urlParams.get('reviews') || urlParams.get('showReviews');
    
    if (showReviews === 'true' || window.location.hash === '#reviews') {
        console.log('根據URL參數顯示評論區塊');
        showReviewsSection();
    }
    
    // 設置側邊欄選單切換
    setupSidebarMenu();
    
    // 設置檔案上傳
    setupFileUploads();
    
    // 設置表單驗證
    setupFormValidation();
    
    // 設置按鈕事件
    setupButtonEvents();
    
    // 設置切換開關事件
    setupSwitchEvents();
    
    // 載入會員訂單紀錄
    loadMemberOrders();
    
    // 載入個人資料到表單
    loadProfileData();
    
    // 更新安全設定顯示
    updateSecuritySettingsDisplay();
}

// 載入個人資料到表單
function loadProfileData() {
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    // 填充表單欄位
    const form = document.querySelector('#profile');
    if (form) {
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');
        const birthdayInput = form.querySelector('input[type="date"]');
        
        if (nameInput && userData.name) nameInput.value = userData.name;
        if (emailInput && userData.email) emailInput.value = userData.email;
        if (phoneInput && userData.phone) phoneInput.value = userData.phone;
        if (birthdayInput && userData.birthday) birthdayInput.value = userData.birthday;
    }
}

// ==================== 雙重驗證功能 ====================
function showTwoFactorSetup() {
    const modalHTML = `
        <div class="modal-overlay" id="twoFactorModal">
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <div class="modal-header">
                    <h3><i class="fas fa-shield-alt"></i> 設定雙重驗證</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="two-factor-steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>下載驗證器應用程式</h4>
                                <p>請先在您的手機安裝 Google Authenticator、Microsoft Authenticator 或任何支援 TOTP 的驗證器應用程式</p>
                                <div class="app-buttons">
                                    <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" class="app-btn">
                                        <i class="fab fa-google-play"></i> Google Play
                                    </a>
                                    <a href="https://apps.apple.com/app/google-authenticator/id388497605" target="_blank" class="app-btn">
                                        <i class="fab fa-app-store"></i> App Store
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>掃描 QR Code</h4>
                                <p>請使用驗證器應用程式掃描下方 QR Code</p>
                                <div class="qr-code-container">
                                    <div class="qr-code-placeholder">
                                        <!-- 這裡可以放置實際的 QR Code -->
                                        <div class="qr-code-demo">
                                            <div class="qr-patterns">
                                                <div class="qr-corner tl"></div>
                                                <div class="qr-corner tr"></div>
                                                <div class="qr-corner bl"></div>
                                            </div>
                                            <div class="qr-text">微熱邱林:${localStorage.getItem('chulin_user')?.email || 'user@example.com'}</div>
                                        </div>
                                    </div>
                                    <p class="qr-hint">或手動輸入密鑰: <code>JBSWY3DPEHPK3PXP</code></p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>輸入驗證碼</h4>
                                <p>請輸入驗證器應用程式顯示的 6 位數驗證碼</p>
                                <div class="form-group">
                                    <label>驗證碼</label>
                                    <input type="text" id="twoFactorCode" 
                                           maxlength="6" 
                                           placeholder="000000" 
                                           style="text-align:center; font-size:1.5rem; letter-spacing:5px;"
                                           oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions" style="margin-top: 20px;">
                        <button type="button" class="outline-btn cancel-btn">取消</button>
                        <button type="button" class="save-btn" onclick="verifyTwoFactor()">確認啟動雙重驗證</button>
                    </div>
                    
                    <div class="two-factor-info">
                        <i class="fas fa-info-circle"></i>
                        <p>開啟雙重驗證後，每次登入都需要輸入密碼和驗證碼，提升帳戶安全性</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML, 'twoFactorModal');
}

function verifyTwoFactor() {
    const codeInput = document.getElementById('twoFactorCode');
    const code = codeInput.value.trim();
    
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
        showNotification('請輸入正確的 6 位數驗證碼', 'error');
        codeInput.focus();
        return;
    }
    
    // 模擬驗證過程
    showNotification('驗證中...', 'info');
    
    // 這裡應該是實際的後端驗證邏輯
    // 模擬成功
    setTimeout(() => {
        // 儲存雙重驗證狀態到 localStorage
        const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
        userData.twoFactorEnabled = true;
        userData.twoFactorEnabledDate = new Date().toISOString();
        localStorage.setItem('chulin_user', JSON.stringify(userData));
        
        // 更新頁面上的開關狀態
        const checkbox = document.querySelector('#security .switch input');
        if (checkbox) {
            checkbox.checked = true;
            checkbox.disabled = false;
        }
        
        showNotification('雙重驗證已成功開啟！', 'success');
        
        // 關閉模態框
        const modal = document.getElementById('twoFactorModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
        
        // 更新安全設定顯示
        updateSecuritySettingsDisplay();
        
    }, 1500);
}

// ==================== 裝置管理功能 ====================
function showDeviceManager() {
    // 從 localStorage 獲取裝置資料，如果沒有則使用預設資料
    let devices = JSON.parse(localStorage.getItem('chulin_devices')) || [
        { 
            id: 1, 
            name: "Chrome / Windows 11", 
            type: "desktop",
            browser: "Chrome",
            os: "Windows 11",
            ip: "118.163.xx.xx", 
            lastActive: new Date().toISOString(),
            location: "台北市",
            current: true 
        },
        { 
            id: 2, 
            name: "Safari / iPhone 14", 
            type: "mobile",
            browser: "Safari",
            os: "iOS 16",
            ip: "210.61.xx.xx", 
            lastActive: "2023-12-28T10:30:00.000Z",
            location: "新北市",
            current: false 
        },
        { 
            id: 3, 
            name: "Edge / macOS", 
            type: "desktop",
            browser: "Edge",
            os: "macOS Ventura",
            ip: "61.220.xx.xx", 
            lastActive: "2023-12-20T14:45:00.000Z",
            location: "台中市",
            current: false 
        }
    ];
    
    // 格式化日期
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return '剛剛';
        if (diffMins < 60) return `${diffMins} 分鐘前`;
        if (diffHours < 24) return `${diffHours} 小時前`;
        if (diffDays === 1) return '昨天';
        if (diffDays < 7) return `${diffDays} 天前`;
        return date.toLocaleDateString('zh-TW');
    };
    
    // 獲取裝置圖標
    const getDeviceIcon = (device) => {
        if (device.type === 'mobile') return 'fas fa-mobile-alt';
        if (device.type === 'tablet') return 'fas fa-tablet-alt';
        return 'fas fa-laptop';
    };
    
    const deviceListHTML = devices.map(dev => `
        <div class="device-item ${dev.current ? 'current-device' : ''}" data-id="${dev.id}">
            <div class="device-icon">
                <i class="${getDeviceIcon(dev)}"></i>
            </div>
            <div class="device-info">
                <div class="device-header">
                    <h4>${dev.name} ${dev.current ? '<span class="current-badge">(此裝置)</span>' : ''}</h4>
                    <span class="device-status ${dev.current ? 'active' : 'inactive'}">
                        ${dev.current ? '使用中' : '已登出'}
                    </span>
                </div>
                <div class="device-details">
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-globe"></i> IP位址</span>
                        <span class="detail-value">${dev.ip}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-map-marker-alt"></i> 位置</span>
                        <span class="detail-value">${dev.location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="far fa-clock"></i> 最後活動</span>
                        <span class="detail-value">${formatDate(dev.lastActive)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-info-circle"></i> 系統資訊</span>
                        <span class="detail-value">${dev.browser} / ${dev.os}</span>
                    </div>
                </div>
            </div>
            <div class="device-actions">
                ${!dev.current ? `
                    <button class="outline-btn small" onclick="logoutDevice(${dev.id})">
                        <i class="fas fa-sign-out-alt"></i> 登出此裝置
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');

    const modalHTML = `
        <div class="modal-overlay" id="deviceModal">
            <div class="modal-content" style="max-width: 600px; max-height: 80vh;">
                <div class="modal-header">
                    <h3><i class="fas fa-laptop"></i> 登入裝置管理</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="device-manager-header">
                        <p><i class="fas fa-info-circle"></i> 以下是目前登入您帳號的裝置：</p>
                        <div class="device-stats">
                            <span class="stat-item">
                                <i class="fas fa-laptop"></i> ${devices.filter(d => d.type === 'desktop').length} 台電腦
                            </span>
                            <span class="stat-item">
                                <i class="fas fa-mobile-alt"></i> ${devices.filter(d => d.type === 'mobile').length} 台行動裝置
                            </span>
                            <span class="stat-item">
                                <i class="fas fa-check-circle"></i> ${devices.filter(d => d.current).length} 台使用中
                            </span>
                        </div>
                    </div>
                    
                    <div class="device-list">
                        ${deviceListHTML}
                    </div>
                    
                    <div class="device-manager-actions">
                        <button type="button" class="outline-btn" onclick="logoutAllDevices()">
                            <i class="fas fa-sign-out-alt"></i> 登出所有其他裝置
                        </button>
                        <button type="button" class="save-btn cancel-btn" style="margin-left: auto;">
                            <i class="fas fa-times"></i> 關閉
                        </button>
                    </div>
                    
                    <div class="device-safety-tips">
                        <h4><i class="fas fa-shield-alt"></i> 安全提示：</h4>
                        <ul>
                            <li>定期檢查登入裝置，移除不認識的裝置</li>
                            <li>如果您在公用電腦登入，請記得登出</li>
                            <li>發現可疑活動時，立即變更密碼</li>
                            <li>建議開啟雙重驗證以增強安全性</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML, 'deviceModal');
}

// 登出單一裝置
function logoutDevice(deviceId) {
    if (!confirm('確定要登出此裝置嗎？')) {
        return;
    }
    
    let devices = JSON.parse(localStorage.getItem('chulin_devices')) || [];
    const deviceIndex = devices.findIndex(d => d.id === deviceId);
    
    if (deviceIndex !== -1) {
        const deviceName = devices[deviceIndex].name;
        devices.splice(deviceIndex, 1);
        localStorage.setItem('chulin_devices', JSON.stringify(devices));
        
        showNotification(`已成功登出 ${deviceName}`);
        
        // 從 UI 移除裝置項目
        const deviceItem = document.querySelector(`.device-item[data-id="${deviceId}"]`);
        if (deviceItem) {
            deviceItem.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                deviceItem.remove();
                updateDeviceStats();
            }, 300);
        }
    }
}

// 登出所有其他裝置
function logoutAllDevices() {
    if (!confirm('確定要登出所有其他裝置嗎？這會讓您在其他裝置上需要重新登入。')) {
        return;
    }
    
    let devices = JSON.parse(localStorage.getItem('chulin_devices')) || [];
    const currentDevice = devices.find(d => d.current);
    
    // 只保留當前裝置
    if (currentDevice) {
        devices = [currentDevice];
        localStorage.setItem('chulin_devices', JSON.stringify(devices));
        
        showNotification('已成功登出所有其他裝置');
        
        // 重新載入裝置列表
        const deviceList = document.querySelector('.device-list');
        if (deviceList) {
            // 移除非當前裝置的項目
            document.querySelectorAll('.device-item:not(.current-device)').forEach(item => {
                item.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => item.remove(), 300);
            });
            updateDeviceStats();
        }
    }
}

// 更新裝置統計
function updateDeviceStats() {
    const devices = JSON.parse(localStorage.getItem('chulin_devices')) || [];
    const stats = document.querySelector('.device-stats');
    
    if (stats) {
        stats.innerHTML = `
            <span class="stat-item">
                <i class="fas fa-laptop"></i> ${devices.filter(d => d.type === 'desktop').length} 台電腦
            </span>
            <span class="stat-item">
                <i class="fas fa-mobile-alt"></i> ${devices.filter(d => d.type === 'mobile').length} 台行動裝置
            </span>
            <span class="stat-item">
                <i class="fas fa-check-circle"></i> ${devices.filter(d => d.current).length} 台使用中
            </span>
        `;
    }
}

// ==================== 更新安全設定顯示 ====================
function updateSecuritySettingsDisplay() {
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    const twoFactorEnabled = userData.twoFactorEnabled || false;
    
    // 更新雙重驗證區域的顯示
    const twoFactorRow = document.querySelector('.security-row:nth-child(2)');
    if (twoFactorRow) {
        const description = twoFactorRow.querySelector('p');
        const toggleSwitch = twoFactorRow.querySelector('.switch input');
        const setupButton = twoFactorRow.querySelector('.outline-btn');
        
        if (twoFactorEnabled) {
            if (description) {
                description.textContent = '雙重驗證已啟用，登入時需要密碼和驗證碼。';
                description.style.color = '#4CAF50';
            }
            if (toggleSwitch) {
                toggleSwitch.checked = true;
            }
            if (setupButton) {
                setupButton.textContent = '管理設定';
                setupButton.onclick = function() {
                    showTwoFactorManagement();
                };
            }
        }
    }
}

// 雙重驗證管理
function showTwoFactorManagement() {
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    const enabledDate = userData.twoFactorEnabledDate ? 
        new Date(userData.twoFactorEnabledDate).toLocaleDateString('zh-TW') : '未知';
    
    const modalHTML = `
        <div class="modal-overlay" id="twoFactorManageModal">
            <div class="modal-content" style="max-width: 450px;">
                <div class="modal-header">
                    <h3><i class="fas fa-shield-alt"></i> 雙重驗證管理</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="two-factor-status">
                        <div class="status-icon success">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="status-content">
                            <h4>雙重驗證已啟用</h4>
                            <p>啟用時間：${enabledDate}</p>
                        </div>
                    </div>
                    
                    <div class="two-factor-backup">
                        <h4><i class="fas fa-key"></i> 備份驗證碼</h4>
                        <p>請將以下備用碼保存在安全的地方。如果您無法使用驗證器應用程式，可以使用這些備用碼登入。</p>
                        <div class="backup-codes">
                            <code>ABCD-EFGH-IJKL</code>
                            <code>MNOP-QRST-UVWX</code>
                            <code>YZ12-3456-7890</code>
                        </div>
                        <button class="outline-btn small" style="margin-top: 10px;">
                            <i class="fas fa-redo"></i> 重新產生備用碼
                        </button>
                    </div>
                    
                    <div class="modal-actions" style="margin-top: 20px;">
                        <button type="button" class="outline-btn" onclick="disableTwoFactor()" style="color: #ff4757; border-color: #ff4757;">
                            <i class="fas fa-times-circle"></i> 關閉雙重驗證
                        </button>
                        <button type="button" class="save-btn cancel-btn">
                            <i class="fas fa-times"></i> 關閉
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML, 'twoFactorManageModal');
}

// 關閉雙重驗證
function disableTwoFactor() {
    if (!confirm('確定要關閉雙重驗證嗎？這會降低您的帳戶安全性。')) {
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    userData.twoFactorEnabled = false;
    localStorage.setItem('chulin_user', JSON.stringify(userData));
    
    showNotification('雙重驗證已關閉', 'info');
    
    // 更新頁面顯示
    updateSecuritySettingsDisplay();
    
    // 關閉模態框
    const modal = document.getElementById('twoFactorManageModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// ==================== 訂單紀錄功能 ====================
function loadMemberOrders() {
    const ordersSection = document.getElementById('orders');
    if (!ordersSection) return;
    
    // 取得會員 email
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    const userEmail = userData.email;
    
    if (!userEmail) {
        // 沒有會員資料，顯示提示
        ordersSection.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-lock" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                <h3>請先登入會員</h3>
                <p>請先登入會員以查看訂單紀錄</p>
                <button onclick="openLoginModal()" class="cta-btn" style="margin-top: 20px;">
                    <i class="fas fa-sign-in-alt"></i> 立即登入
                </button>
            </div>
        `;
        return;
    }
    
    console.log('載入會員訂單，會員 Email:', userEmail);
    
    // 取得所有訂單
    const allOrders = JSON.parse(localStorage.getItem('chulinOrders')) || [];
    console.log('所有訂單資料:', allOrders);
    
    // 過濾出屬於該會員的訂單
    const memberOrders = allOrders.filter(order => {
        if (!order) return false;
        
        // 檢查幾個可能的位置來匹配 email
        const orderEmail = 
            order.customer?.email ||           // 顧客 email
            order.memberInfo?.email ||         // 會員資訊 email (結帳頁面新增)
            order.order?.customer?.email ||    // 訂單內的顧客 email
            order.email;                       // 直接儲存的 email
        
        console.log(`訂單 ${order.orderNumber}: ${orderEmail} vs ${userEmail}`, orderEmail === userEmail);
        
        return orderEmail === userEmail;
    });
    
    console.log('過濾後的會員訂單:', memberOrders);
    
    // 排序（最新的在前）
    memberOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // 顯示訂單
    displayMemberOrders(memberOrders);
}

// 顯示會員訂單
function displayMemberOrders(orders) {
    const ordersSection = document.getElementById('orders');
    if (!ordersSection) return;
    
    if (orders.length === 0) {
        ordersSection.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                <h3>尚無訂單紀錄</h3>
                <p>您還沒有下過任何訂單</p>
                <a href="../pie/pie.html" class="cta-btn" style="margin-top: 20px; text-decoration: none;">
                    <i class="fas fa-shopping-cart"></i> 立即購物
                </a>
                <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                    <p>小提示：請確保您下單時使用的 Email 與會員中心的 Email 一致</p>
                    <button onclick="reloadOrders()" class="outline-btn" style="margin-top: 10px; padding: 5px 15px;">
                        <i class="fas fa-sync-alt"></i> 重新整理訂單
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    let ordersHTML = `
        <div class="orders-list">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>您的訂單紀錄 (${orders.length} 筆)</h3>
                <button onclick="reloadOrders()" class="outline-btn" style="padding: 8px 15px;">
                    <i class="fas fa-sync-alt"></i> 重新整理
                </button>
            </div>
    `;
    
    orders.forEach(order => {
        const orderDate = new Date(order.timestamp || Date.now());
        const formattedDate = orderDate.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const statusText = {
            'pending': '待處理',
            'processing': '處理中',
            'shipped': '已出貨',
            'delivered': '已送達',
            'cancelled': '已取消',
            'completed': '已完成'
        }[order.status] || '處理中';
        
        const statusColor = {
            'pending': '#ff9500',
            'processing': '#007aff',
            'shipped': '#5856d6',
            'delivered': '#34c759',
            'cancelled': '#ff3b30',
            'completed': '#4CAF50'
        }[order.status] || '#007aff';
        
        // 獲取商品資訊
        const items = order.order?.items || order.items || [];
        const totalAmount = order.order?.total || order.total || 0;
        const subtotal = order.order?.subtotal || totalAmount;
        const shippingFee = order.order?.shippingFee || order.shippingFee || 0;
        const discount = order.order?.discount || order.discount || 0;
        const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // 生成商品項目 HTML
        let itemsHTML = '';
        if (items.length > 0) {
            itemsHTML = `
                <div class="order-items-list">
                    <div class="items-header">商品項目 (${itemCount} 件):</div>
                    ${items.map((item, index) => `
                        <div class="order-item-detail">
                            <div class="item-image" style="background-image: url('${item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}')"></div>
                            <div class="item-info">
                                <div class="item-name">${item.name || '商品'}</div>
                                <div class="item-quantity-price">
                                    <span>數量: ${item.quantity || 1}</span>
                                    <span>單價: NT$ ${(item.price || 0).toLocaleString()}</span>
                                </div>
                            </div>
                            <div class="item-total">
                                NT$ ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        ordersHTML += `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <h4>訂單編號: ${order.orderNumber || 'ORD' + Date.now().toString().slice(-8)}</h4>
                        <p class="order-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
                    </div>
                    <div class="order-status" style="color: ${statusColor}; background-color: ${statusColor}15; padding: 4px 12px; border-radius: 20px; font-weight: 500;">
                        ${statusText}
                    </div>
                </div>
                
                ${itemsHTML}
                
                <div class="order-summary">
                    <div class="summary-row">
                        <span>商品小計:</span>
                        <span>NT$ ${subtotal.toLocaleString()}</span>
                    </div>
                    <div class="summary-row">
                        <span>運費:</span>
                        <span>NT$ ${shippingFee.toLocaleString()}</span>
                    </div>
                    ${discount > 0 ? `
                    <div class="summary-row">
                        <span>折扣:</span>
                        <span style="color: #4CAF50;">- NT$ ${discount.toLocaleString()}</span>
                    </div>
                    ` : ''}
                    <div class="summary-row total">
                        <span>訂單總額:</span>
                        <span style="font-weight: 600; color: var(--dark-color);">NT$ ${totalAmount.toLocaleString()}</span>
                    </div>
                </div>
                
                <div class="order-actions">
                    <button class="outline-btn" onclick="showOrderDetails('${order.orderNumber}')">
                        <i class="fas fa-search"></i> 查看詳情
                    </button>
                    <button class="cta-btn" onclick="reorder('${order.orderNumber}')">
                        <i class="fas fa-redo"></i> 再次購買
                    </button>
                </div>
            </div>
        `;
    });
    
    ordersHTML += `</div>`;
    ordersSection.innerHTML = ordersHTML;
    
    // 添加訂單詳情樣式
    addOrderDetailsStyles();
}

// 查看訂單詳細資料
function showOrderDetails(orderNumber) {
    console.log('查看訂單詳情:', orderNumber);
    
    const allOrders = JSON.parse(localStorage.getItem('chulinOrders')) || [];
    const order = allOrders.find(o => o.orderNumber === orderNumber);
    
    if (!order) {
        showNotification('找不到訂單資料', 'error');
        return;
    }
    
    // 顯示訂單詳情模態框
    const modalHTML = `
        <div class="modal-overlay" id="orderDetailsModal">
            <div class="modal-content" style="max-width: 800px; max-height: 85vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3><i class="fas fa-file-invoice"></i> 訂單詳細資料</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="order-details-container">
                        <!-- 訂單詳情內容 -->
                        <div class="order-info-header">
                            <div>
                                <h4>訂單編號: ${order.orderNumber || 'N/A'}</h4>
                                <p class="order-date">下單時間: ${new Date(order.timestamp).toLocaleString('zh-TW')}</p>
                            </div>
                            <div class="order-status-large">
                                ${order.status === 'delivered' ? '✓ 已送達' : 
                                  order.status === 'shipped' ? '🚚 已出貨' : 
                                  order.status === 'processing' ? '🔄 處理中' : '⏳ 待處理'}
                            </div>
                        </div>
                        
                        <div class="order-info-section">
                            <h5><i class="fas fa-user"></i> 顧客資訊</h5>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">姓名</span>
                                    <span class="info-value">${order.customer?.name || order.memberInfo?.name || '未提供'}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Email</span>
                                    <span class="info-value">${order.customer?.email || order.memberInfo?.email || '未提供'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="order-info-section">
                            <h5><i class="fas fa-box"></i> 商品項目</h5>
                            <div class="order-items-details">
                                ${order.order?.items ? order.order.items.map((item, index) => `
                                    <div class="order-item-detail">
                                        <div class="item-index">${index + 1}.</div>
                                        <div class="item-image" style="background-image: url('${item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}')"></div>
                                        <div class="item-details">
                                            <div class="item-name">${item.name || '商品'}</div>
                                            <div class="item-specs">
                                                <span>單價: NT$ ${(item.price || 0).toLocaleString()}</span>
                                                <span>數量: ${item.quantity || 1}</span>
                                            </div>
                                        </div>
                                        <div class="item-total-detail">
                                            NT$ ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                        </div>
                                    </div>
                                `).join('') : '<div class="empty-items">無商品資料</div>'}
                            </div>
                        </div>
                        
                        <div class="order-info-section">
                            <h5><i class="fas fa-receipt"></i> 訂單摘要</h5>
                            <div class="order-summary-details">
                                <div class="summary-row">
                                    <span>商品小計:</span>
                                    <span>NT$ ${(order.order?.subtotal || order.total || 0).toLocaleString()}</span>
                                </div>
                                <div class="summary-row">
                                    <span>運費:</span>
                                    <span>NT$ ${(order.order?.shippingFee || 0).toLocaleString()}</span>
                                </div>
                                ${order.order?.discount ? `
                                <div class="summary-row">
                                    <span>折扣:</span>
                                    <span style="color: #4CAF50;">- NT$ ${order.order.discount.toLocaleString()}</span>
                                </div>
                                ` : ''}
                                <div class="summary-row total">
                                    <span>訂單總額:</span>
                                    <span>NT$ ${(order.order?.total || order.total || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions" style="padding: 20px; border-top: 1px solid #eee;">
                    <button class="cta-btn" onclick="closeOrderModal()" style="flex: 1;">
                        <i class="fas fa-times"></i> 關閉視窗
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML, 'orderDetailsModal');
}

// 關閉訂單詳情模態框
function closeOrderModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// 打開登入模態框
function openLoginModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'flex';
        setTimeout(() => {
            authModal.classList.add('show');
        }, 10);
    }
}

// 重新載入訂單資料
function reloadOrders() {
    loadMemberOrders();
    showNotification('訂單紀錄已重新整理');
}

// ==================== 設置側邊欄選單 ====================
function setupSidebarMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有按鈕的 active 狀態
            menuItems.forEach(btn => btn.classList.remove('active'));
            
            // 添加當前按鈕的 active 狀態
            this.classList.add('active');
            
            // 獲取要顯示的區塊 ID
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/showSection\('(.+?)'\)/);
                if (match) {
                    const sectionId = match[1];
                    showSection(sectionId);
                } else if (onclickAttr.includes('showReviewsSection')) {
                    // 特別處理評論區塊
                    showReviewsSection();
                }
            }
            
            // 處理 data-section 屬性
            const dataSection = this.getAttribute('data-section');
            if (dataSection === 'reviews') {
                showReviewsSection();
            }
        });
    });
}

// ==================== 其他函數保持不變 ====================
// 設置檔案上傳
function setupFileUploads() {
    // 頭像上傳功能
    const changeAvatarBtn = document.querySelector('.change-avatar');
    if (changeAvatarBtn) {
        // 創建隱藏的檔案輸入框
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'avatar-upload';
        document.body.appendChild(fileInput);
        
        changeAvatarBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // 檢查檔案類型
                if (!file.type.match('image.*')) {
                    showNotification('請選擇圖片檔案！', 'error');
                    return;
                }
                
                // 檢查檔案大小 (限制5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('圖片大小不能超過5MB！', 'error');
                    return;
                }
                
                // 顯示上傳進度
                showNotification('正在上傳頭像...', 'info');
                
                // 預覽圖片
                const reader = new FileReader();
                reader.onload = function(e) {
                    const avatarImg = document.querySelector('.avatar img');
                    if (avatarImg) {
                        // 添加淡出效果
                        avatarImg.style.opacity = '0.5';
                        setTimeout(() => {
                            avatarImg.src = e.target.result;
                            avatarImg.style.opacity = '1';
                            showNotification('頭像已更新成功！');
                            
                            // 儲存頭像到會員資料
                            const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
                            userData.avatar = e.target.result;
                            localStorage.setItem('chulin_user', JSON.stringify(userData));
                        }, 300);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// 設置表單驗證
function setupFormValidation() {
    // 個人資料表單驗證
    const profileForm = document.querySelector('#profile');
    if (profileForm) {
        const saveBtn = profileForm.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 收集表單資料
                const inputs = profileForm.querySelectorAll('input');
                const formData = {};
                inputs.forEach(input => {
                    if (input.type !== 'button') {
                        formData[input.type] = input.value;
                    }
                });
                
                // 驗證手機號碼格式
                const phoneInput = profileForm.querySelector('input[type="tel"]');
                if (phoneInput && phoneInput.value) {
                    const phoneRegex = /^09\d{2}-?\d{3}-?\d{3}$/;
                    if (!phoneRegex.test(phoneInput.value)) {
                        showNotification('手機號碼格式不正確，請使用 09XX-XXX-XXX 格式', 'error');
                        return;
                    }
                }
                
                // 驗證Email格式
                const emailInput = profileForm.querySelector('input[type="email"]');
                if (emailInput && emailInput.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(emailInput.value)) {
                        showNotification('Email格式不正確', 'error');
                        return;
                    }
                }
                
                // 驗證生日日期
                const birthdayInput = profileForm.querySelector('input[type="date"]');
                if (birthdayInput && birthdayInput.value) {
                    const birthDate = new Date(birthdayInput.value);
                    const today = new Date();
                    if (birthDate > today) {
                        showNotification('生日日期不能是未來日期', 'error');
                        return;
                    }
                    
                    // 檢查年齡是否合理（至少12歲）
                    const age = today.getFullYear() - birthDate.getFullYear();
                    if (age < 12) {
                        showNotification('使用者年齡必須至少12歲', 'error');
                        return;
                    }
                }
                
                // 模擬儲存過程
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 儲存中...';
                
                setTimeout(() => {
                    // 儲存會員資料
                    const existingUserData = JSON.parse(localStorage.getItem('chulin_user')) || {};
                    const updatedUserData = { ...existingUserData, ...formData };
                    
                    localStorage.setItem('chulin_user', JSON.stringify(updatedUserData));
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-save"></i> 儲存變更';
                    showNotification('個人資料已更新成功！');
                    
                    // 重新載入訂單紀錄
                    setTimeout(() => {
                        loadMemberOrders();
                    }, 500);
                    
                }, 1500);
            });
        }
    }
}

// 設置按鈕事件
function setupButtonEvents() {
    // 安全設定的按鈕
    document.querySelectorAll('.outline-btn').forEach(btn => {
        if (!btn.classList.contains('event-bound')) {
            btn.classList.add('event-bound');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const buttonText = this.textContent.trim();
                const parentSection = this.closest('.content-box')?.querySelector('h2')?.textContent || '';
                
                if (buttonText.includes('修改密碼')) {
                    showPasswordChangeModal();
                } 
                else if (buttonText.includes('立即設定') || buttonText.includes('管理設定')) {
                    // 檢查是否已啟用雙重驗證
                    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
                    if (userData.twoFactorEnabled) {
                        showTwoFactorManagement();
                    } else {
                        showTwoFactorSetup();
                    }
                }
                else if (buttonText.includes('檢視裝置')) {
                    showDeviceManager();
                }
                else if (buttonText.includes('編輯')) {
                    const addressItem = this.closest('.address-item');
                    showEditAddressModal(addressItem);
                }
                else if (buttonText.includes('刪除')) {
                    if (confirm('確定要刪除嗎？')) {
                        const item = this.closest('.address-item, .payment-method');
                        if (item) {
                            item.style.animation = 'fadeOut 0.3s forwards';
                            setTimeout(() => {
                                item.remove();
                                showNotification('已成功刪除');
                            }, 300);
                        }
                    }
                }
                else if (buttonText.includes('新增')) {
                    if (parentSection.includes('地址')) {
                        showAddAddressModal();
                    } else if (parentSection.includes('付款方式')) {
                        showAddPaymentMethodModal();
                    }
                }
            });
        }
    });
    
    // 儲存按鈕（不在表單內的）
    document.querySelectorAll('.save-btn:not([type="submit"])').forEach(btn => {
        if (!btn.classList.contains('event-bound')) {
            btn.classList.add('event-bound');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const section = this.closest('.content-box');
                const sectionName = section?.querySelector('h2')?.textContent || '設定';
                
                // 模擬儲存過程
                this.disabled = true;
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 儲存中...';
                
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = originalText;
                    showNotification(`${sectionName} 已成功儲存！`);
                }, 1000);
            });
        }
    });
}

// 設置切換開關事件
function setupSwitchEvents() {
    document.querySelectorAll('.switch input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const settingName = this.closest('.notification-setting')?.querySelector('h4')?.textContent || 
                               this.closest('.security-row')?.querySelector('h3')?.textContent || 
                               '設定';
            const status = this.checked ? '開啟' : '關閉';
            showNotification(`${settingName} 已${status}`);
        });
    });
}

// ==================== 模態框功能 ====================
function showPasswordChangeModal() {
    const modalHTML = `
        <div class="modal-overlay" id="passwordModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-key"></i> 修改密碼</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="changePasswordForm">
                        <div class="form-group">
                            <label>目前密碼</label>
                            <input type="password" placeholder="請輸入目前密碼" required>
                        </div>
                        <div class="form-group">
                            <label>新密碼</label>
                            <input type="password" placeholder="請輸入新密碼" required minlength="6">
                            <small class="hint">至少6個字元</small>
                        </div>
                        <div class="form-group">
                            <label>確認新密碼</label>
                            <input type="password" placeholder="請再次輸入新密碼" required>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="outline-btn cancel-btn">取消</button>
                            <button type="submit" class="save-btn">確認修改</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML, 'passwordModal', function(form) {
        const inputs = form.querySelectorAll('input[type="password"]');
        const [current, newPass, confirmPass] = Array.from(inputs).map(i => i.value);
        
        if (newPass.length < 6) {
            showNotification('新密碼至少需要6個字元', 'error');
            return false;
        }
        
        if (newPass !== confirmPass) {
            showNotification('新密碼與確認密碼不一致', 'error');
            return false;
        }
        
        showNotification('密碼修改成功！請重新登入');
        return true;
    });
}

function showEditAddressModal(addressItem) {
    const name = addressItem.querySelector('p:nth-child(2)')?.textContent || '邱林使用者';
    const phone = addressItem.querySelector('p:nth-child(3)')?.textContent || '0912-345-678';
    const address = addressItem.querySelector('p:nth-child(4)')?.textContent || '台北市大安區忠孝東路四段 123 號 5F';
    const isDefault = addressItem.classList.contains('default');
    
    const modalHTML = `
        <div class="modal-overlay" id="editAddressModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> 編輯地址</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editAddressForm">
                        <div class="form-group">
                            <label>收件人姓名</label>
                            <input type="text" placeholder="請輸入收件人姓名" value="${name}" required>
                        </div>
                        <div class="form-group">
                            <label>手機號碼</label>
                            <input type="tel" placeholder="09XX-XXX-XXX" value="${phone}" required>
                        </div>
                        <div class="form-group">
                            <label>地址</label>
                            <textarea rows="3" placeholder="請輸入完整地址" required>${address}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" ${isDefault ? 'checked' : ''}>
                                <span>設為預設地址</span>
                            </label>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="outline-btn cancel-btn">取消</button>
                            <button type="submit" class="save-btn">儲存變更</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML, 'editAddressModal');
}

function showAddAddressModal() {
    const modalHTML = `
        <div class="modal-overlay" id="addAddressModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> 新增地址</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addAddressForm">
                        <div class="form-group">
                            <label>收件人姓名</label>
                            <input type="text" placeholder="請輸入收件人姓名" required>
                        </div>
                        <div class="form-group">
                            <label>手機號碼</label>
                            <input type="tel" placeholder="09XX-XXX-XXX" required>
                        </div>
                        <div class="form-group">
                            <label>地址</label>
                            <textarea rows="3" placeholder="請輸入完整地址" required></textarea>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox">
                                <span>設為預設地址</span>
                            </label>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="outline-btn cancel-btn">取消</button>
                            <button type="submit" class="save-btn">新增地址</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML, 'addAddressModal');
}

function showAddPaymentMethodModal() {
    const modalHTML = `
        <div class="modal-overlay" id="addPaymentModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-credit-card"></i> 新增付款方式</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addPaymentForm">
                        <div class="form-group">
                            <label>信用卡號碼</label>
                            <input type="text" placeholder="1234 5678 9012 3456" required>
                        </div>
                        <div class="form-group">
                            <label>有效期限</label>
                            <input type="text" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label>安全碼 (CVV)</label>
                            <input type="text" placeholder="123" required>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="outline-btn cancel-btn">取消</button>
                            <button type="submit" class="save-btn">新增付款方式</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHTML, 'addPaymentModal');
}

// 通用模態框顯示函數
function showModal(html, modalId, onSubmitCallback) {
    // 移除現有的模態框
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();
    
    // 添加新的模態框
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = document.getElementById(modalId);
    
    // 顯示模態框
    setTimeout(() => modal.classList.add('show'), 10);
    
    // 關閉事件
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.cancel-btn')?.addEventListener('click', closeModal);
    
    // 點擊背景關閉
    modal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    // 表單提交
    const form = modal.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let shouldClose = true;
            if (onSubmitCallback) {
                shouldClose = onSubmitCallback(this);
            }
            
            if (shouldClose !== false) {
                showNotification('設定已成功儲存！');
                closeModal();
            }
        });
    }
    
    // 添加模態框樣式（如果不存在）
    addModalStyles();
}

// ==================== 共用功能 ====================
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
    
    // 下拉選單功能
    const dropdownTriggers = document.querySelectorAll('.nav-item > .nav-link');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}

// ==================== 購物車功能 ====================
let cart = JSON.parse(localStorage.getItem('chulinCart')) || [];

function initCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.querySelector('.close-cart');
    const continueBtn = document.querySelector('.continue-btn');
    
    console.log('初始化購物車功能', { cartBtn, cartSidebar, closeCart, continueBtn });
    
    // 購物車按鈕點擊
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('購物車按鈕被點擊');
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // 關閉購物車
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('關閉購物車');
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // 繼續購物按鈕
    if (continueBtn && cartSidebar) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('繼續購物');
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
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (cart.length === 0) {
                showNotification('購物車是空的，請先添加商品', 'error');
                return;
            }

            // 儲存最新購物車資料
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
        cartItem.dataset.id = item.id || `item_${index}`;
        
        cartItem.innerHTML = `
            <div class="cart-item-img" style="background-image: url('${item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}')"></div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name || '商品名稱'}</h4>
                <p class="cart-item-price">NT$ ${(item.price || 0).toLocaleString()}</p>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" type="button">-</button>
                    <span class="quantity">${item.quantity || 1}</span>
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
        cart[existingItemIndex].quantity += 1;
    } else {
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
        totalQuantity += item.quantity || 1;
        totalAmount += (item.price || 0) * (item.quantity || 1);
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
    // 追蹤商品按鈕事件
    const trackBtn = document.getElementById('trackBtn');
    if (trackBtn) {
        trackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('追蹤商品按鈕被點擊');
            showWishlist();
        });
    }
    
    // 初始化追蹤按鈕狀態
    updateFollowButtons();
}

// ==================== 喜好清單功能 ====================
let wishlist = JSON.parse(localStorage.getItem('chulinWishlist')) || [];

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
    modal.style.display = 'flex';
    
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
                    ${wishlist.map((item, index) => `
                        <div class="wishlist-item" data-id="${item.id || `wish_${index}`}">
                            <div class="wishlist-img" style="background-image: url('${item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}')"></div>
                            <div class="wishlist-info">
                                <h4>${item.name || '商品名稱'}</h4>
                                <p>NT$ ${(item.price || 0).toLocaleString()}</p>
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
        <div class="modal-content" style="max-width: 900px; max-height: 80vh; overflow-y: auto;">
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
                    點擊商品卡片可查看更多資訊，使用滑鼠滾輪或拖動捲軸瀏覽所有商品
                </div>
            ` : ''}
            
            ${wishlistHTML}
            
            ${wishlist.length > 0 ? `
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <button class="cta-btn" style="margin-right: 10px; padding: 8px 20px;">
                            <i class="fas fa-cart-plus"></i> 全部加入購物車
                        </button>
                        <button class="btn-remove-wishlist" style="padding: 8px 20px;">
                            <i class="fas fa-trash"></i> 清空清單
                        </button>
                    </div>
                </div>
            ` : ''}
            
            <div style="margin-top: 25px; text-align: center;">
                <button class="cta-btn close-wishlist-btn" style="padding: 10px 40px;">
                    <i class="fas fa-times"></i> 關閉視窗
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // 綁定關閉事件
    const closeBtn = modal.querySelector('.close-modal');
    const closeWishlistBtn = modal.querySelector('.close-wishlist-btn');
    
    const closeWishlist = function() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeWishlist);
    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlist);
    
    // 點擊背景關閉
    modal.addEventListener('click', function(e) {
        if (e.target === this) closeWishlist();
    });
    
    // 綁定喜好清單事件
    initWishlistEvents();
}

// 更新追蹤商品數量
function updateWishlistCount() {
    const trackBadge = document.querySelector('.icon-badge');
    if (trackBadge) {
        trackBadge.textContent = wishlist.length;
        trackBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
}

// 初始化喜好清單事件
function initWishlistEvents() {
    // 加入購物車按鈕
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.id;
            const product = wishlist.find(item => item.id === productId);
            
            if (product) {
                addToCart(product);
            }
        });
    });
    
    // 移除按鈕
    document.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
        if (!btn.closest('.modal-actions')) {
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
                    
                    // 更新喜好清單顯示
                    showWishlist();
                }
            });
        }
    });
}

// 更新追蹤按鈕狀態
function updateFollowButtons() {
    const followBtns = document.querySelectorAll('.btn-follow');
    followBtns.forEach(btn => {
        const card = btn.closest('.product-card');
        if (!card) return;
        
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

// ==================== 線上客服功能 ====================
function initChat() {
    const chatTrigger = document.getElementById('chatTrigger');
    const chatBtn = document.getElementById('chatBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    
    console.log('初始化聊天功能', { chatTrigger, chatBtn, chatWindow, closeChat });
    
    function toggleChat() {
        console.log('切換聊天視窗');
        chatWindow.classList.toggle('active');
        if (chatTrigger) chatTrigger.classList.toggle('active');
        
        if (chatWindow.classList.contains('active')) {
            setTimeout(() => {
                const chatBody = document.getElementById('chatBody');
                if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
                
                const chatInput = document.getElementById('chatInput');
                if (chatInput) chatInput.focus();
            }, 100);
        }
    }
    
    if (chatBtn) {
        chatBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('聊聊按鈕被點擊');
            toggleChat();
        });
    }
    
    if (chatTrigger) {
        chatTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('右下角聊聊按鈕被點擊');
            toggleChat();
        });
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('關閉聊天視窗');
            toggleChat();
        });
    }
    
    // 快速回覆按鈕
    document.querySelectorAll('.quick-btns button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const topic = this.textContent.trim();
            quickReply(topic);
        });
    });
    
    // Enter 發送訊息
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    chatInput.value = '';
    
    setTimeout(() => {
        addMessage(getChatResponse(message), 'sys');
    }, 800);
}

function quickReply(topic) {
    const responses = {
        '運送問題': '我們的商品約 1–3 個工作天出貨，冷藏宅配約 2–4 天送達。',
        '商品諮詢': '商品皆為當日新鮮製作，冷藏保存 3 天，冷凍 7 天。',
        '訂單查詢': '請提供訂單編號，或至「會員中心 > 訂單查詢」。',
        '轉接人工': '正在為您轉接人工客服，服務時間為週一至週五 09:00–18:00。'
    };
    
    addMessage(topic, 'user');
    
    setTimeout(() => {
        addMessage(responses[topic] || '請描述您的問題，我會協助您 😊', 'sys');
    }, 600);
}

function addMessage(text, sender) {
    const chatBody = document.getElementById('chatBody');
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    
    const time = new Date().toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    msg.innerHTML = `
        <div class="msg-content">${text}</div>
        <div class="msg-time">${time}</div>
    `;
    
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getChatResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('運送') || msg.includes('運費')) {
        return '滿 $1500 免運，未滿運費 $150。';
    }
    if (msg.includes('保存') || msg.includes('期限')) {
        return '冷藏 3 天、冷凍 7 天，請依包裝標示為主。';
    }
    if (msg.includes('訂單') || msg.includes('order')) {
        return '您可至會員中心查詢，或直接提供訂單編號。';
    }
    if (msg.includes('地址') || msg.includes('送貨')) {
        return '我們提供全台宅配服務，偏遠地區可能需額外運費。';
    }
    if (msg.includes('折扣') || msg.includes('優惠')) {
        return '每月 15 號為會員日，全館 9 折優惠！';
    }
    if (msg.includes('謝謝') || msg.includes('感謝')) {
        return '不客氣！很高興能幫助您 😊';
    }
    return '感謝您的詢問，客服人員會盡快回覆您。如需立即協助，請撥打客服專線：0800-123-456。';
}

function initForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('表單已提交！');
        });
    });
}

function initScrollToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initDropdowns() {
    // 下拉選單懸停效果
    const dropdowns = document.querySelectorAll('.nav-item');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.classList.add('active');
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.classList.remove('active');
            }
        });
    });
}

// 添加模態框樣式
function addModalStyles() {
    if (document.querySelector('#modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 4000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .modal-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }
        
        .modal-overlay.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 1.2rem;
        }
        
        .modal-header h3 i {
            margin-right: 10px;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-body .form-group {
            margin-bottom: 20px;
        }
        
        .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 30px;
        }
        
        .modal-actions button {
            flex: 1;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 添加訂單詳情樣式
function addOrderDetailsStyles() {
    if (document.querySelector('#order-details-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'order-details-styles';
    style.textContent = `
        .order-items-list {
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .order-items-list .items-header {
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
            font-size: 0.95rem;
        }
        
        .order-item-detail {
            display: flex;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: white;
            border-radius: 6px;
            border: 1px solid #eee;
        }
        
        .item-image {
            width: 60px;
            height: 60px;
            background-size: cover;
            background-position: center;
            border-radius: 4px;
            margin-right: 15px;
        }
        
        .item-info {
            flex: 1;
        }
        
        .item-name {
            font-weight: 500;
            margin-bottom: 5px;
        }
        
        .item-quantity-price {
            display: flex;
            gap: 15px;
            color: #666;
            font-size: 0.9rem;
        }
        
        .item-total {
            font-weight: 600;
            color: var(--dark-color);
        }
        
        /* 訂單詳情樣式 */
        .order-details-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .order-info-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .order-info-header h4 {
            margin: 0;
        }
        
        .order-info-header .order-date {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .order-status-large {
            font-weight: 600;
            padding: 5px 15px;
            border-radius: 20px;
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .order-info-section {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
        }
        
        .order-info-section h5 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            padding: 8px 0;
        }
        
        .info-item.full-width {
            grid-column: 1 / -1;
        }
        
        .info-label {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 3px;
        }
        
        .info-value {
            font-weight: 500;
        }
        
        .order-items-details {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .item-details {
            flex: 1;
        }
        
        .item-specs {
            display: flex;
            gap: 15px;
            margin-top: 5px;
            font-size: 0.9rem;
            color: #666;
        }
        
        .item-index {
            width: 25px;
            text-align: center;
            font-weight: bold;
            color: #666;
        }
        
        .item-total-detail {
            font-weight: 600;
            font-size: 1.1rem;
            color: var(--dark-color);
            min-width: 100px;
            text-align: right;
        }
        
        .order-summary-details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .summary-row.total {
            font-weight: bold;
            font-size: 1.1rem;
            border-bottom: none;
            color: var(--dark-color);
        }
        
        .status-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
        }
        
        .status-item {
            padding: 8px;
            background: #f8f9fa;
            border-radius: 6px;
        }
        
        .status-label {
            font-size: 0.85rem;
            color: #666;
            display: block;
            margin-bottom: 3px;
        }
        
        .status-value {
            font-weight: 500;
            display: block;
        }
        
        .empty-items {
            text-align: center;
            padding: 30px;
            color: #999;
            font-style: italic;
        }
        
        .order-notes {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            font-style: italic;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

// 顯示通知
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
    
    // 添加通知樣式
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 5000;
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
            .close-notification {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 15px;
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== 切換內容區塊函數（核心功能）====================
function showSection(sectionId) {
    console.log('切換到區塊:', sectionId);
    
    document.querySelectorAll('.content-box').forEach(box => {
        box.style.display = 'none';
    });
    
    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
        
        // 如果是評論頁面，載入評論資料
        if (sectionId === 'reviews') {
            if (typeof loadUserReviews === 'function') {
                loadUserReviews();
            }
            if (typeof initReviewFilters === 'function') {
                initReviewFilters();
            }
        }
        // 如果是訂單頁面，重新載入訂單資料
        else if (sectionId === 'orders') {
            setTimeout(() => {
                loadMemberOrders();
            }, 100);
        }
    }
    
    // 更新選單按鈕狀態
    document.querySelectorAll('.menu-item').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 找到對應的按鈕並設置active
    document.querySelectorAll('.menu-item').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`showSection('${sectionId}')`)) {
            btn.classList.add('active');
        }
    });
}

// ==================== 再次購買功能 ====================
function reorder(orderNumber) {
    const allOrders = JSON.parse(localStorage.getItem('chulinOrders')) || [];
    const order = allOrders.find(o => o.orderNumber === orderNumber);
    
    if (!order) {
        showNotification('找不到訂單資料', 'error');
        return;
    }
    
    // 取得當前購物車
    let cart = JSON.parse(localStorage.getItem('chulinCart')) || [];
    
    // 添加商品到購物車
    const items = order.order?.items || order.items || [];
    if (items.length > 0) {
        items.forEach(item => {
            const existingItem = cart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity || 1;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity || 1
                });
            }
        });
        
        // 儲存購物車
        localStorage.setItem('chulinCart', JSON.stringify(cart));
        
        // 顯示成功訊息
        showNotification(`已將 ${items.length} 件商品加入購物車`, 'success');
        
        // 更新購物車UI
        updateCartUI();
    } else {
        showNotification('此訂單沒有商品資料', 'error');
    }
}

// ==================== 會員中心評論系統 ====================

// 獲取星星HTML
function getStarsHTML(rating) {
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

// 顯示評論紀錄區塊
function showReviewsSection() {
    console.log('顯示評論區塊');
    
    // 先隱藏所有區塊
    document.querySelectorAll('.content-box').forEach(section => {
        section.style.display = 'none';
    });
    
    // 顯示評論區塊
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
        reviewsSection.style.display = 'block';
        
        // 更新選單狀態
        updateMenuActive('reviews');
        
        // 載入評論紀錄
        loadUserReviews();
        
        // 初始化篩選功能
        initReviewFilters();
    }
}

// 載入使用者評論紀錄
function loadUserReviews() {
    console.log('開始載入用戶評論...');
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    console.log('用戶資料:', userData);
    console.log('是否已登入:', isLoggedIn);
    
    if (!isLoggedIn) {
        showMessage('請先登入會員才能查看評論紀錄', 'error');
        document.getElementById('reviewsList').innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-user-lock"></i>
                <p>請先登入會員</p>
                <button class="save-btn" onclick="window.location.href='../index.html?login=true'">
                    <i class="fas fa-sign-in-alt"></i> 前往登入
                </button>
            </div>
        `;
        document.getElementById('reviewsStats').innerHTML = '';
        return;
    }
    
    const reviewsData = JSON.parse(localStorage.getItem('chulinReviews')) || {};
    const reviewsList = document.getElementById('reviewsList');
    const reviewsStats = document.getElementById('reviewsStats');
    
    console.log('所有評論資料:', reviewsData);
    
    // 收集所有使用者的評論
    let userReviews = [];
    let totalReviews = 0;
    let averageRating = 0;
    let ratingDistribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
    
    // 取得用戶識別資訊
    const userEmail = userData.email;
    const userName = userData.name;
    const userEmailPrefix = userEmail ? userEmail.split('@')[0] : '';
    
    console.log('用戶識別: email=', userEmail, 'name=', userName, 'emailPrefix=', userEmailPrefix);
    
    // 遍歷所有商品
    Object.keys(reviewsData).forEach(productName => {
        const productReviews = reviewsData[productName].reviews || [];
        
        productReviews.forEach(review => {
            // 檢查是否為當前使用者的評論
            const isUserReview = (
                // 比對用戶email
                (userEmail && review.userEmail === userEmail) ||
                // 比對用戶名稱
                (userName && (review.userName === userName || review.name === userName)) ||
                // 比對顯示名稱（email前綴）
                (userEmailPrefix && (review.userName === userEmailPrefix || review.name === userEmailPrefix))
            );
            
            if (isUserReview) {
                console.log('找到匹配的評論:', review);
                
                userReviews.push({
                    productName: productName,
                    userName: review.userName || review.name || '會員',
                    rating: review.rating,
                    text: review.text,
                    date: review.date || '未指定日期',
                    productRating: reviewsData[productName].rating,
                    isMember: review.isMember || true,
                    originalReview: review
                });
                
                totalReviews++;
                averageRating += review.rating;
                
                // 計算評分分佈
                const rating = Math.round(review.rating);
                if (rating >= 1 && rating <= 5) {
                    ratingDistribution[rating]++;
                }
            }
        });
    });
    
    console.log('總評論數:', totalReviews);
    console.log('用戶評論列表:', userReviews);
    
    // ==================== 新增：預設排序邏輯 ====================
    // 預設按日期排序（最新的在前面）
    userReviews.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
    });
    
    // 預設設定篩選器為"最新"
    const filterSelect = document.getElementById('reviewFilter');
    if (filterSelect) {
        filterSelect.value = 'newest';
    }
    // ==================== 新增結束 ====================
    
    // 更新統計資訊
    updateReviewsStats(userReviews, totalReviews, averageRating, ratingDistribution);
    
    // 顯示評論列表
    displayUserReviews(userReviews);
}

// 更新評論統計資訊 - 精美的統計表格
function updateReviewsStats(reviews, total, average, distribution) {
    const reviewsStats = document.getElementById('reviewsStats');
    
    if (total === 0) {
        reviewsStats.innerHTML = `
            <div class="stats-card">
                <h3><i class="fas fa-chart-bar"></i> 評論統計</h3>
                <div class="no-stats">
                    <i class="fas fa-comment-slash"></i>
                    <p>還沒有評論紀錄</p>
                    <p class="hint">發表您的第一則評論吧！</p>
                </div>
            </div>
        `;
        return;
    }
    
    const avgRating = (average / total).toFixed(1);
    const mostCommonRating = Object.entries(distribution).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const recentReview = reviews.length > 0 ? reviews[0].date : '無';
    
    // 計算星級百分比
    const starPercentages = {};
    for (let i = 1; i <= 5; i++) {
        starPercentages[i] = distribution[i] ? Math.round((distribution[i] / total) * 100) : 0;
    }
    
    // 創建星星評分條
    const createStarBar = (stars, count, percentage) => {
        return `
            <div class="star-bar-row">
                <span class="star-label">${stars} 星</span>
                <div class="star-bar-container">
                    <div class="star-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="star-count">${count} (${percentage}%)</span>
            </div>
        `;
    };
    
    reviewsStats.innerHTML = `
        <div class="stats-card">
            <h3><i class="fas fa-chart-bar"></i> 評論統計</h3>
            
            <div class="stats-summary">
                <div class="stat-item-large">
                    <div class="stat-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${total}</div>
                        <div class="stat-label">總評論數</div>
                    </div>
                </div>
                
                <div class="stat-item-large">
                    <div class="stat-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${avgRating} <span class="stat-stars">${getStarsHTML(parseFloat(avgRating))}</span></div>
                        <div class="stat-label">平均評分</div>
                    </div>
                </div>
                
                <div class="stat-item-large">
                    <div class="stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${mostCommonRating} 星</div>
                        <div class="stat-label">最常評分</div>
                    </div>
                </div>
                
                <div class="stat-item-large">
                    <div class="stat-icon">
                        <i class="far fa-calendar"></i>
                    </div>
                    <div class="stat-info">
                        <div class="stat-value">${recentReview}</div>
                        <div class="stat-label">最新評論</div>
                    </div>
                </div>
            </div>
            
            <div class="stats-details">
                <div class="detail-section">
                    <h4><i class="fas fa-star-half-alt"></i> 評分分佈</h4>
                    <div class="star-bars">
                        ${[5, 4, 3, 2, 1].map(stars => 
                            createStarBar(stars, distribution[stars] || 0, starPercentages[stars])
                        ).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-chart-pie"></i> 統計摘要</h4>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="summary-label">5星評論</span>
                            <span class="summary-value">${distribution[5] || 0}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">4星評論</span>
                            <span class="summary-value">${distribution[4] || 0}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">3星評論</span>
                            <span class="summary-value">${distribution[3] || 0}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">2星評論</span>
                            <span class="summary-value">${distribution[2] || 0}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">1星評論</span>
                            <span class="summary-value">${distribution[1] || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 顯示使用者評論列表
function displayUserReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-comment-slash"></i>
                <p>您還沒有任何評論紀錄</p>
                <p class="hint">前往商品頁面分享您的使用體驗吧！</p>
                <button class="save-btn" onclick="goToProducts()">
                    <i class="fas fa-shopping-bag"></i> 前往商品頁面
                </button>
            </div>
        `;
        return;
    }
    
    // 先按日期排序（最新的在前面）
    reviews.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
    });
    
    reviewsList.innerHTML = reviews.map((review, index) => `
        <div class="review-record ${review.isMember ? 'member-review' : ''}">
            <div class="review-header">
                <div class="review-product">
                    <div class="product-name-row">
                        <h3>${review.productName}</h3>
                        <span class="review-index">#${index + 1}</span>
                    </div>
                    <div class="review-meta">
                        <div class="review-stars">
                            ${getStarsHTML(review.rating)}
                            <span class="review-score">${review.rating.toFixed(1)}</span>
                        </div>
                        <span class="review-date">
                            <i class="far fa-calendar-alt"></i> ${review.date}
                        </span>
                        ${review.isMember ? '<span class="member-badge"><i class="fas fa-crown"></i> 會員評論</span>' : ''}
                    </div>
                </div>
                <div class="review-actions">
                    <button class="outline-btn small edit-btn" onclick="editUserReview('${review.productName}', ${review.rating}, '${escapeHtml(review.text)}')">
                        <i class="fas fa-edit"></i> 編輯
                    </button>
                    <button class="outline-btn small delete-btn" onclick="deleteUserReview('${review.productName}', '${escapeHtml(review.text)}')">
                        <i class="fas fa-trash"></i> 刪除
                    </button>
                </div>
            </div>
            
            <div class="review-content">
                <p>${review.text}</p>
            </div>
            
            <div class="review-footer">
                <div class="footer-left">
                    <span class="product-rating">
                        <i class="fas fa-chart-line"></i> 商品平均評分：${review.productRating.toFixed(1)} 
                        <i class="fas fa-star" style="color: #ffc107; font-size: 0.9em;"></i>
                    </span>
                </div>
                <div class="footer-right">
                    <span class="review-length">
                        <i class="fas fa-file-alt"></i> ${review.text.length} 字元
                    </span>
                    <span class="review-time">
                        ${formatReviewTime(review.date)}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// HTML 跳脫函數
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 格式化評論時間
function formatReviewTime(dateString) {
    try {
        const reviewDate = new Date(dateString);
        if (isNaN(reviewDate.getTime())) return dateString;
        
        const now = new Date();
        const diffTime = Math.abs(now - reviewDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return '今天';
        if (diffDays === 1) return '昨天';
        if (diffDays < 7) return `${diffDays} 天前`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} 週前`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} 個月前`;
        return `${Math.floor(diffDays / 365)} 年前`;
    } catch (error) {
        return dateString;
    }
}

// 篩選評論
function filterReviews() {
    console.log('篩選評論...');
    
    const searchInput = document.getElementById('reviewSearch');
    const filterSelect = document.getElementById('reviewFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filterType = filterSelect ? filterSelect.value : 'newest';
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    if (!isLoggedIn) {
        showMessage('請先登入會員', 'error');
        return;
    }
    
    const reviewsData = JSON.parse(localStorage.getItem('chulinReviews')) || {};
    let userReviews = [];
    
    // 收集使用者評論
    Object.keys(reviewsData).forEach(productName => {
        const productReviews = reviewsData[productName].reviews || [];
        
        productReviews.forEach(review => {
            const isUserReview = (
                (review.userEmail && userData.email && review.userEmail === userData.email) ||
                (review.userName && userData.name && review.userName === userData.name) ||
                (review.userName && userData.email && review.userName === userData.email.split('@')[0]) ||
                (review.name && userData.email && review.name === userData.email.split('@')[0])
            );
            
            if (isUserReview) {
                userReviews.push({
                    productName: productName,
                    userName: review.userName || review.name || '會員',
                    rating: review.rating,
                    text: review.text,
                    date: review.date || '未指定日期',
                    productRating: reviewsData[productName].rating,
                    isMember: review.isMember || true
                });
            }
        });
    });
    
    // 搜尋篩選
    if (searchTerm) {
        userReviews = userReviews.filter(review => 
            review.productName.toLowerCase().includes(searchTerm) ||
            review.text.toLowerCase().includes(searchTerm)
        );
    }
    
    // 排序篩選
    switch(filterType) {
        case 'newest':
            userReviews.sort((a, b) => {
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                return dateB - dateA;
            });
            break;
        case 'oldest':
            userReviews.sort((a, b) => {
                const dateA = a.date ? new Date(a.date) : new Date(0);
                const dateB = b.date ? new Date(b.date) : new Date(0);
                return dateA - dateB;
            });
            break;
        case 'highest':
            userReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            userReviews.sort((a, b) => a.rating - b.rating);
            break;
        case 'product':
            userReviews.sort((a, b) => a.productName.localeCompare(b.productName));
            break;
        case 'rating':
            userReviews.sort((a, b) => b.productRating - a.productRating);
            break;
    }
    
    // 顯示篩選後的評論
    displayUserReviews(userReviews);
    
    // 更新篩選結果統計
    if (userReviews.length > 0) {
        const total = userReviews.length;
        const average = userReviews.reduce((sum, review) => sum + review.rating, 0);
        const distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
        
        userReviews.forEach(review => {
            const rating = Math.round(review.rating);
            if (rating >= 1 && rating <= 5) {
                distribution[rating]++;
            }
        });
        
        updateReviewsStats(userReviews, total, average, distribution);
    }
}

// 初始化評論篩選功能
function initReviewFilters() {
    console.log('初始化評論篩選功能...');
    
    const searchInput = document.getElementById('reviewSearch');
    const filterSelect = document.getElementById('reviewFilter');
    
    // 預設載入所有評論（清空搜尋框）
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 預設設定排序為"最新"
    if (filterSelect) {
        filterSelect.value = 'newest';
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterReviews);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterReviews);
    }
    
    // 如果有搜尋框，添加清除按鈕
    if (searchInput) {
        // 創建清除按鈕
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'clear-search-btn';
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.title = '清除搜尋';
        clearBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 1rem;
            display: none;
        `;
        
        // 添加到搜尋框容器
        const searchContainer = searchInput.parentElement;
        if (searchContainer) {
            searchContainer.style.position = 'relative';
            searchContainer.appendChild(clearBtn);
            
            // 清除按鈕點擊事件
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                searchInput.focus();
                filterReviews();
                this.style.display = 'none';
            });
            
            // 搜尋框輸入事件
            searchInput.addEventListener('input', function() {
                clearBtn.style.display = this.value ? 'block' : 'none';
            });
        }
    }
}

// 其他功能函數（簡化版）
function editUserReview(productName, rating, text) {
    localStorage.setItem('editingReview', JSON.stringify({
        productName: productName,
        rating: rating,
        text: text,
        timestamp: new Date().getTime()
    }));
    
    showMessage(`即將編輯 ${productName} 的評論`, 'info');
    
    setTimeout(() => {
        window.location.href = `../pie/pie.html?editReview=true&product=${encodeURIComponent(productName)}`;
    }, 1500);
}

function deleteUserReview(productName, reviewText) {
    if (!confirm(`確定要刪除您在「${productName}」的評論嗎？\n\n此操作無法復原！`)) {
        return;
    }
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userData = JSON.parse(localStorage.getItem('chulin_user')) || {};
    
    if (!isLoggedIn) {
        showMessage('請先登入會員', 'error');
        return;
    }
    
    try {
        const reviewsData = JSON.parse(localStorage.getItem('chulinReviews')) || {};
        
        if (!reviewsData[productName]) {
            showMessage('找不到該商品的評論資料', 'error');
            return;
        }
        
        const productReviews = reviewsData[productName].reviews || [];
        const decodedText = reviewText.replace(/&amp;/g, '&')
                                     .replace(/&lt;/g, '<')
                                     .replace(/&gt;/g, '>')
                                     .replace(/&quot;/g, '"')
                                     .replace(/&#039;/g, "'");
        
        // 找到並刪除使用者的評論
        const updatedReviews = productReviews.filter(review => {
            const isUserReview = (
                (review.userEmail && userData.email && review.userEmail === userData.email) ||
                (review.userName && userData.name && review.userName === userData.name) ||
                (review.userName && userData.email && review.userName === userData.email.split('@')[0]) ||
                (review.name && userData.email && review.name === userData.email.split('@')[0])
            );
            
            // 如果評論屬於該用戶，檢查內容是否匹配
            if (isUserReview) {
                return review.text !== decodedText;
            }
            return true;
        });
        
        // 更新評論資料
        reviewsData[productName].reviews = updatedReviews;
        
        // 重新計算平均評分
        if (updatedReviews.length > 0) {
            const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
            reviewsData[productName].rating = totalRating / updatedReviews.length;
        } else {
            reviewsData[productName].rating = 0;
        }
        
        // 儲存到 localStorage
        localStorage.setItem('chulinReviews', JSON.stringify(reviewsData));
        
        showMessage('評論已成功刪除', 'success');
        
        // 重新載入評論紀錄
        setTimeout(() => {
            loadUserReviews();
        }, 500);
        
    } catch (error) {
        console.error('刪除評論時發生錯誤:', error);
        showMessage('刪除評論時發生錯誤，請稍後再試', 'error');
    }
}

// 立即顯示評論區塊（如果URL參數指定）
function showReviewsImmediately() {
    // 檢查URL是否有參數要求顯示評論
    const urlParams = new URLSearchParams(window.location.search);
    const showReviews = urlParams.get('showReviews');
    
    // 或者檢查是否在會員中心頁面
    const currentPage = window.location.pathname;
    const isMemberCenter = currentPage.includes('member') || currentPage.includes('user');
    
    if (showReviews === 'true' || isMemberCenter) {
        // 延遲一小段時間確保DOM載入完成
        setTimeout(() => {
            showReviewsSection();
        }, 100);
    }
}

// 頁面載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    console.log('帳戶安全管理頁面初始化中...');
    
    // 檢查是否直接訪問評論區塊
    const pathname = window.location.pathname;
    const isMemberPage = pathname.includes('safe.html') || 
                         pathname.includes('member.html') || 
                         pathname.includes('user.html') || 
                         pathname.includes('center.html');
    
    // 檢查URL參數或hash
    const urlParams = new URLSearchParams(window.location.search);
    const showReviewsParam = urlParams.get('reviews') || urlParams.get('showReviews');
    const hasReviewsHash = window.location.hash === '#reviews';
    
    // 初始化所有功能
    initAccountPage();
    initNavigation();
    initModals(); // 修正：確保會員模態框正確初始化
    initCart();
    initChat();
    initForms();
    initScrollToTop();
    initDropdowns();
    
    // 初始化商品按鈕（包含喜好清單功能）
    initProductButtons();
    
    // ==================== 新增：自動顯示評論區塊 ====================
    // 如果有評論相關參數，等待一小段時間確保DOM完全載入後顯示評論
    if (showReviewsParam === 'true' || hasReviewsHash) {
        setTimeout(() => {
            console.log('自動顯示評論區塊（根據URL參數）');
            showReviewsSection();
        }, 300);
    }
    
    console.log('所有功能初始化完成');
});

function goToProducts() {
    window.location.href = '../pie/pie.html';
}

// 確保函數在全局可用
window.getStarsHTML = getStarsHTML;
window.showReviewsSection = showReviewsSection;
window.loadUserReviews = loadUserReviews;
window.filterReviews = filterReviews;
window.editUserReview = editUserReview;
window.deleteUserReview = deleteUserReview;
window.goToProducts = goToProducts;
window.initReviewFilters = initReviewFilters;