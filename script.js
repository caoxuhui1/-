// 购物车功能
let cart = [];

// 添加商品到购物车
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        const productName = this.getAttribute('data-name');
        const productPrice = parseFloat(this.getAttribute('data-price'));
        const productImage = this.getAttribute('data-image');
        
        // 检查是否已在购物车中
        const existingItem = cart.find(item => item.id === productId);
        
        if(existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage
            });
        }
        
        updateCart();
        
        // 显示添加成功的提示
        showToast(`"${productName}" 已添加到购物车`);
    });
});

// 更新购物车显示
function updateCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartCountEl = document.getElementById('cartCount');
    const cartTotalEl = document.getElementById('cartTotal');
    
    // 更新购物车数量
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    
    // 计算总价
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `¥${totalPrice.toFixed(2)}`;
    
    // 清空购物车显示
    cartItemsEl.innerHTML = '';
    
    if(cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-3">购物车是空的</p>
            </div>
        `;
        return;
    }
    
    // 添加购物车商品
    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item d-flex align-items-center';
        itemEl.innerHTML = `
            <div class="flex-shrink-0">
                <img src="${item.image}" 
                     class="rounded" width="60" height="60" style="object-fit: cover;">
            </div>
            <div class="flex-grow-1 ms-3">
                <div class="d-flex justify-content-between">
                    <h6 class="mb-1">${item.name}</h6>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="text-muted small">单价: ¥${item.price.toFixed(2)}</span>
                        <div class="input-group input-group-sm mt-1" style="width: 120px;">
                            <button class="btn btn-outline-secondary decrease-item" data-id="${item.id}">-</button>
                            <input type="text" class="form-control text-center quantity-input" 
                                   value="${item.quantity}" data-id="${item.id}">
                            <button class="btn btn-outline-secondary increase-item" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <span class="fw-bold">¥${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `;
        cartItemsEl.appendChild(itemEl);
    });
    
    // 添加移除商品事件
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            cart = cart.filter(item => item.id !== productId);
            updateCart();
            showToast(`"${item.name}" 已从购物车移除`);
        });
    });
    
    // 添加减少数量事件
    document.querySelectorAll('.decrease-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            if(item.quantity > 1) {
                item.quantity -= 1;
                updateCart();
            }
        });
    });
    
    // 添加增加数量事件
    document.querySelectorAll('.increase-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            item.quantity += 1;
            updateCart();
        });
    });
    
    // 添加输入数量变化事件
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.getAttribute('data-id');
            const item = cart.find(item => item.id === productId);
            const newQuantity = parseInt(this.value) || 1;
            item.quantity = newQuantity > 0 ? newQuantity : 1;
            updateCart();
        });
    });
}

// 显示提示消息
function showToast(message) {
    const toastHtml = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto"><i class="bi bi-check-circle me-2"></i> 操作成功</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body bg-light">
                    ${message}
                </div>
            </div>
        </div>
    `;
    
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = toastHtml;
    document.body.appendChild(toastContainer);
    
    // 3秒后移除提示
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // 更新导航栏激活状态
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// 滚动显示动画
function scrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }
    });
}

// 导航栏滚动效果
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// 模拟登录功能
document.getElementById('loginModal').addEventListener('shown.bs.modal', function() {
    document.getElementById('loginEmail').focus();
});

// 模拟注册功能
document.getElementById('registerModal').addEventListener('shown.bs.modal', function() {
    document.getElementById('registerName').focus();
});

// 表单提交处理
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 显示加载状态
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>处理中...';
        submitBtn.disabled = true;
        
        // 模拟API请求
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // 根据表单ID执行不同操作
            if(this.id === 'loginForm') {
                showToast('登录成功！');
            } else if(this.id === 'registerForm') {
                showToast('注册成功！欢迎加入阿哲科技小店');
            } else if(this.id === 'contactForm') {
                showToast('消息已发送！我们将尽快回复您');
            }
            
            const modal = bootstrap.Modal.getInstance(this.closest('.modal'));
            if(modal) modal.hide();
        }, 1500);
    });
});

// 结算按钮事件
document.getElementById('checkoutBtn').addEventListener('click', function() {
    if(cart.length === 0) {
        showToast('购物车为空，请先添加商品');
        return;
    }
    
    // 显示加载状态
    const originalText = this.innerHTML;
    this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>处理中...';
    this.disabled = true;
    
    // 模拟结算过程
    setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
        
        // 显示成功消息
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showToast(`订单提交成功！总金额: ¥${totalPrice.toFixed(2)}`);
        
        // 清空购物车
        cart = [];
        updateCart();
        
        // 关闭购物车模态框
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        cartModal.hide();
    }, 2000);
});

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 初始化滚动事件
    window.addEventListener('scroll', scrollReveal);
    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('load', scrollReveal);
    
    // 设置当前年份
    const yearSpan = document.createElement('span');
    yearSpan.textContent = new Date().getFullYear();
    document.querySelector('footer small').innerHTML = `&copy; ${yearSpan.textContent} 阿哲科技小店 版权所有`;
    
    // 初始化页面滚动位置
    handleNavbarScroll();
});
