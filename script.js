/**
 * 个人作品集网站 JavaScript 交互功能
 * 包含导航、表单提交、动画效果等功能
 */

// DOM 元素
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const contactForm = document.getElementById('contact-form');
const submitText = document.getElementById('submit-text');
const submitLoading = document.getElementById('submit-loading');
const formMessage = document.getElementById('form-message');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

/**
 * 初始化所有功能
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeFormSubmission();
    initializeAnimations();
    initializeLightEffects();
    initializeLiquidGlass();
    initializeCardHoverEffects();
    initializeCursorEffects();
    initializeAllCardClicks(); // 初始化所有卡片点击功能
    initializeProductTitleClick(); // 初始化产品标题点击功能
});

/**
 * 导航功能初始化
 */
function initializeNavigation() {
    // 移动端菜单切换
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // 切换图标
            const icon = mobileMenuBtn.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });
    }
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 关闭移动端菜单
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('svg');
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
                }
            }
        });
    });
}

/**
 * 滚动效果初始化
 */
function initializeScrollEffects() {
    // 导航栏背景透明度变化
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('bg-dark-bg');
            nav.classList.remove('bg-dark-bg/80');
        } else {
            nav.classList.add('bg-dark-bg/80');
            nav.classList.remove('bg-dark-bg');
        }
    });
    
    // 滚动时显示元素动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.animate-slide-up').forEach(el => {
        observer.observe(el);
    });
}

/**
 * 表单提交功能初始化
 */
function initializeFormSubmission() {
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // 显示加载状态
            showLoadingState();
            
            try {
                // 发送数据到后端 API
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    showSuccessMessage();
                    contactForm.reset();
                } else {
                    showErrorMessage(result.message || '发送失败，请稍后重试');
                }
            } catch (error) {
                console.error('表单提交错误:', error);
                showErrorMessage('网络错误，请检查连接后重试');
            } finally {
                hideLoadingState();
            }
        });
    }
}

/**
 * 显示加载状态
 */
function showLoadingState() {
    submitText.classList.add('hidden');
    submitLoading.classList.remove('hidden');
    formMessage.classList.add('hidden');
}

/**
 * 隐藏加载状态
 */
function hideLoadingState() {
    submitText.classList.remove('hidden');
    submitLoading.classList.add('hidden');
}

/**
 * 显示成功消息
 */
function showSuccessMessage() {
    formMessage.classList.remove('hidden');
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    
    // 3秒后自动隐藏
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 3000);
}

/**
 * 显示错误消息
 */
function showErrorMessage(message) {
    formMessage.classList.remove('hidden');
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
    
    // 更新错误消息内容
    const errorText = errorMessage.querySelector('div');
    if (errorText) {
        errorText.innerHTML = `
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        `;
    }
    
    // 5秒后自动隐藏
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

/**
 * 动画效果初始化
 */
function initializeAnimations() {
    // 鼠标悬停效果 - 修复选择器
    document.querySelectorAll('.hover\\:scale-105, [class*="hover:scale"]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // 项目卡片悬停效果 - 修复选择器
    document.querySelectorAll('.group, [class*="group"]').forEach(card => {
        card.addEventListener('mouseenter', function() {
            // 查找图标元素 - 支持多种选择器
            const icon = this.querySelector('.group-hover\\:rotate-6, .group-hover\\:rotate-12, [class*="group-hover:rotate"]');
            if (icon) {
                icon.style.transform = 'rotate(12deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.group-hover\\:rotate-6, .group-hover\\:rotate-12, [class*="group-hover:rotate"]');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
    
    // 透明玻璃卡片悬停效果
    document.querySelectorAll('[class*="bg-white/10"], [class*="backdrop-blur"]').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            this.style.transition = 'all 0.5s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
    });
    
    // 技能标签悬停效果
    document.querySelectorAll('[class*="hover:animate-liquid-glass"]').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.color = '#3b82f6';
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.color = '#6b7280';
            this.style.transform = 'scale(1)';
        });
    });
    
    // 打字机效果（可选）
    initializeTypewriterEffect();
}

/**
 * 打字机效果初始化
 */
function initializeTypewriterEffect() {
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const text = typewriterElement.textContent;
        typewriterElement.textContent = '';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 100);
    }
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：节流
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 卡片悬停效果初始化
 * 专门处理透明玻璃卡片的悬停效果
 */
function initializeCardHoverEffects() {
    // 为所有透明玻璃卡片添加悬停效果
    const glassCards = document.querySelectorAll('[class*="bg-white/10"], [class*="backdrop-blur-xl"]');
    
    glassCards.forEach(card => {
        // 确保卡片有正确的初始状态
        card.style.transition = 'all 0.5s ease';
        
        card.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // 为技能标签添加特殊悬停效果
    const skillTags = document.querySelectorAll('[class*="hover:animate-liquid-glass"]');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.color = '#3b82f6';
            this.style.transform = 'scale(1.05)';
            this.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            this.style.borderColor = 'rgba(59, 130, 246, 0.3)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.color = '#6b7280';
            this.style.transform = 'scale(1)';
            this.style.backgroundColor = '';
            this.style.borderColor = '';
        });
    });
}

/**
 * 页面加载完成后的额外初始化
 */
window.addEventListener('load', function() {
    // 隐藏加载动画（如果有的话）
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // 添加页面加载完成的类
    document.body.classList.add('loaded');
});

/**
 * 错误处理
 */
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

/**
 * 动态光效初始化
 * 实现光效跟随鼠标移动的效果
 */
function initializeLightEffects() {
    const lightBeam = document.getElementById('light-beam');
    const aiLightfield = document.getElementById('ai-lightfield');
    
    if (!lightBeam || !aiLightfield) return;
    
    // 鼠标移动事件 - 直接更新，无延迟
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        // 直接更新光效位置，无延迟
        lightBeam.style.left = x + 'px';
        lightBeam.style.top = y + 'px';
        lightBeam.style.opacity = '1';
        lightBeam.style.transform = 'translate(-50%, -50%) scale(1.5)';
        
        // 清除之前的定时器
        clearTimeout(lightBeam.timeoutId);
        
        // 极短延迟隐藏光效
        lightBeam.timeoutId = setTimeout(() => {
            lightBeam.style.opacity = '0.3';
            lightBeam.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 20);
    });
    
    // 鼠标离开页面时隐藏光效
    document.addEventListener('mouseleave', function() {
        lightBeam.style.opacity = '0';
    });
    
    // 鼠标进入页面时显示光效
    document.addEventListener('mouseenter', function() {
        lightBeam.style.opacity = '0.3';
    });
}

/**
 * 液态玻璃效果初始化
 * 实现悬停时的液态玻璃效果
 */
function initializeLiquidGlass() {
    const liquidGlassOverlay = document.getElementById('liquid-glass-overlay');
    const interactiveElements = document.querySelectorAll('.hover\\:animate-liquid-glass, .group, button, a, [class*="hover:animate-liquid-glass"], [class*="group"], [class*="bg-white/10"], [class*="backdrop-blur"]');
    
    if (!liquidGlassOverlay) return;
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // 更新液态玻璃效果位置
            liquidGlassOverlay.style.left = x + 'px';
            liquidGlassOverlay.style.top = y + 'px';
            liquidGlassOverlay.style.transform = 'translate(-50%, -50%) scale(2)';
            liquidGlassOverlay.style.opacity = '0.3';
            
            // 添加液态玻璃动画
            liquidGlassOverlay.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        element.addEventListener('mouseleave', function() {
            liquidGlassOverlay.style.opacity = '0';
            liquidGlassOverlay.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    // 为整个页面添加全局液态玻璃效果 - 更流畅的跟随
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        // 直接更新液态玻璃位置，无延迟
        liquidGlassOverlay.style.left = x + 'px';
        liquidGlassOverlay.style.top = y + 'px';
        liquidGlassOverlay.style.transform = 'translate(-50%, -50%) scale(2)';
        liquidGlassOverlay.style.opacity = '0.3';
    });
}

/**
 * AI名人头像交互效果
 * 为AI名人头像添加特殊的交互效果
 */
function initializeAICharacterInteraction() {
    const aiCharacters = document.querySelectorAll('[class*="animate-sparkle"]');
    
    aiCharacters.forEach((character, index) => {
        character.addEventListener('mouseenter', function() {
            // 增强光效
            this.style.filter = 'brightness(1.5) drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))';
            this.style.transform = 'scale(1.2) rotate(5deg)';
            
            // 添加脉冲效果
            this.style.animation = 'sparkle 0.5s ease-in-out infinite';
        });
        
        character.addEventListener('mouseleave', function() {
            // 恢复原始状态
            this.style.filter = 'brightness(1)';
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.animation = `sparkle 1.5s ease-in-out infinite`;
        });
        
        // 点击效果
        character.addEventListener('click', function() {
            // 创建爆炸效果
            this.style.transform = 'scale(1.5) rotate(360deg)';
            this.style.filter = 'brightness(2) drop-shadow(0 0 30px rgba(59, 130, 246, 0.8))';
            
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.filter = 'brightness(1)';
            }, 300);
        });
    });
}

/**
 * 头像光场交互效果
 * 为头像添加特殊的AI光场交互效果
 */
function initializeAvatarLightField() {
    const avatarContainer = document.querySelector('.w-80.h-80, .w-96.h-96');
    const avatarImage = document.querySelector('img[alt="Summer 个人头像"]');
    const lightField = document.getElementById('ai-lightfield');
    
    if (!avatarContainer || !avatarImage || !lightField) return;
    
    // 头像悬停效果
    avatarContainer.addEventListener('mouseenter', function() {
        // 增强头像光场效果
        this.style.filter = 'brightness(1.1) drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))';
        this.style.transform = 'scale(1.02)';
        
        // 增强背景光场
        lightField.style.filter = 'brightness(1.1)';
        
        // 添加环绕粒子动画
        const particles = this.parentElement.querySelectorAll('[class*="animate-particle-float"]');
        particles.forEach(particle => {
            particle.style.animationDuration = '2s';
            particle.style.opacity = '0.8';
        });
    });
    
    avatarContainer.addEventListener('mouseleave', function() {
        // 恢复原始状态
        this.style.filter = 'brightness(1)';
        this.style.transform = 'scale(1)';
        
        // 恢复背景光场
        lightField.style.filter = 'brightness(1)';
        
        // 恢复粒子动画
        const particles = this.parentElement.querySelectorAll('[class*="animate-particle-float"]');
        particles.forEach(particle => {
            particle.style.animationDuration = '8s';
            particle.style.opacity = '';
        });
    });
    
    // 头像点击效果
    avatarImage.addEventListener('click', function() {
        // 创建光场爆炸效果
        this.style.filter = 'brightness(1.3) drop-shadow(0 0 40px rgba(59, 130, 246, 0.6))';
        this.style.transform = 'scale(1.05)';
        
        // 增强背景光场
        lightField.style.filter = 'brightness(1.2)';
        
        // 创建粒子爆发效果
        const particles = this.closest('.relative').querySelectorAll('[class*="animate-particle-float"]');
        particles.forEach(particle => {
            particle.style.animationDuration = '0.5s';
            particle.style.transform = 'scale(1.5)';
        });
        
        setTimeout(() => {
            this.style.filter = 'brightness(1)';
            this.style.transform = 'scale(1)';
            lightField.style.filter = 'brightness(1)';
            
            particles.forEach(particle => {
                particle.style.animationDuration = '8s';
                particle.style.transform = 'scale(1)';
            });
        }, 500);
    });
}

/**
 * 页面加载完成后初始化AI角色交互
 */
window.addEventListener('load', function() {
    initializeAICharacterInteraction();
    initializeAvatarLightField();
});

/**
 * 初始化光标跟随和悬停效果
 */
function initializeCursorEffects() {
    console.log('初始化光标效果...');
    
    const cursorFollow = document.getElementById('cursor-follow');
    const cursorHover = document.getElementById('cursor-hover');
    
    console.log('光标元素:', cursorFollow, cursorHover);
    
    if (!cursorFollow || !cursorHover) {
        console.log('光标元素未找到');
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let followX = 0;
    let followY = 0;
    
    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 更新跟随光标位置
        followX += (mouseX - followX) * 0.15;
        followY += (mouseY - followY) * 0.15;
        
        cursorFollow.style.left = followX - 16 + 'px';
        cursorFollow.style.top = followY - 16 + 'px';
        cursorFollow.style.display = 'block';
    });
    
    // 悬停效果
    const hoverElements = document.querySelectorAll('a, button, .cute-card-hover, .cute-hand-cursor');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            cursorHover.style.opacity = '1';
            cursorHover.style.left = e.clientX - 32 + 'px';
            cursorHover.style.top = e.clientY - 32 + 'px';
        });
        
        element.addEventListener('mousemove', (e) => {
            cursorHover.style.left = e.clientX - 32 + 'px';
            cursorHover.style.top = e.clientY - 32 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorHover.style.opacity = '0';
        });
    });
    
    // 鼠标离开页面时隐藏效果
    document.addEventListener('mouseleave', () => {
        cursorFollow.style.opacity = '0';
        cursorHover.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorFollow.style.opacity = '0.6';
    });
    
    console.log('光标效果初始化完成');
}

/**
 * 导航到各个详情页面的通用函数
 */
function navigateToPage(cardId, pageUrl) {
    // 添加点击动画效果
    const card = document.getElementById(cardId);
    if (card) {
        card.style.transform = 'scale(0.95)';
        card.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            // 跳转到指定页面
            window.location.href = pageUrl;
        }, 200);
    }
}

/**
 * 导航到玩转 THU 详情页面
 */
function navigateToTHU() {
    navigateToPage('thu-card', 'thu-detail.html');
}

/**
 * 导航到 Giscard 详情页面
 */
function navigateToGiscard() {
    navigateToPage('giscard-card', 'giscard-detail.html');
}

/**
 * 导航到斑马 AI & 瓜瓜龙详情页面
 */
function navigateToZebra() {
    navigateToPage('zebra-card', 'zebra-detail.html');
}

/**
 * 导航到抖音相机详情页面
 */
function navigateToDouyin() {
    navigateToPage('douyin-card', 'douyin-detail.html');
}

/**
 * 导航到布丁 AI 详情页面
 */
function navigateToPudding() {
    navigateToPage('pudding-card', 'pudding-detail.html');
}

/**
 * 为所有卡片添加点击事件监听器
 */
function initializeAllCardClicks() {
    // 玩转 THU 卡片
    const thuCard = document.getElementById('thu-card');
    if (thuCard) {
        thuCard.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToTHU();
        });
        thuCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToTHU();
            }
        });
        thuCard.setAttribute('tabindex', '0');
        thuCard.setAttribute('role', 'button');
        thuCard.setAttribute('aria-label', '查看玩转 THU 详细信息');
    }

    // Giscard 卡片
    const giscardCard = document.getElementById('giscard-card');
    if (giscardCard) {
        giscardCard.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToGiscard();
        });
        giscardCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToGiscard();
            }
        });
        giscardCard.setAttribute('tabindex', '0');
        giscardCard.setAttribute('role', 'button');
        giscardCard.setAttribute('aria-label', '查看 Giscard 详细信息');
    }

    // 斑马 AI & 瓜瓜龙卡片
    const zebraCard = document.getElementById('zebra-card');
    if (zebraCard) {
        zebraCard.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToZebra();
        });
        zebraCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToZebra();
            }
        });
        zebraCard.setAttribute('tabindex', '0');
        zebraCard.setAttribute('role', 'button');
        zebraCard.setAttribute('aria-label', '查看斑马 AI & 瓜瓜龙详细信息');
    }

    // 抖音相机卡片
    const douyinCard = document.getElementById('douyin-card');
    if (douyinCard) {
        douyinCard.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToDouyin();
        });
        douyinCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToDouyin();
            }
        });
        douyinCard.setAttribute('tabindex', '0');
        douyinCard.setAttribute('role', 'button');
        douyinCard.setAttribute('aria-label', '查看抖音相机详细信息');
    }

    // 布丁 AI 卡片
    const puddingCard = document.getElementById('pudding-card');
    if (puddingCard) {
        puddingCard.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPudding();
        });
        puddingCard.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToPudding();
            }
        });
        puddingCard.setAttribute('tabindex', '0');
        puddingCard.setAttribute('role', 'button');
        puddingCard.setAttribute('aria-label', '查看布丁 AI 详细信息');
    }
}

/**
 * 初始化产品标题点击功能
 */
function initializeProductTitleClick() {
    const productTitle = document.getElementById('product-title');
    if (productTitle) {
        productTitle.addEventListener('click', function(e) {
            e.preventDefault();
            // 平滑滚动到产品思想模块
            const philosophySection = document.getElementById('product-philosophy');
            if (philosophySection) {
                const offsetTop = philosophySection.offsetTop - 80; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
        
        // 添加键盘支持
        productTitle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const philosophySection = document.getElementById('product-philosophy');
                if (philosophySection) {
                    const offsetTop = philosophySection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
        
        // 设置无障碍属性
        productTitle.setAttribute('tabindex', '0');
        productTitle.setAttribute('role', 'button');
        productTitle.setAttribute('aria-label', '点击查看产品思想演进');
    }
}

/**
 * 导出函数供外部使用（如果需要）
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSuccessMessage,
        showErrorMessage,
        debounce,
        throttle,
        initializeLightEffects,
        initializeLiquidGlass,
        initializeAICharacterInteraction,
        initializeCursorEffects,
        navigateToTHU,
        navigateToGiscard,
        navigateToZebra,
        navigateToDouyin,
        navigateToPudding,
        initializeAllCardClicks,
        initializeProductTitleClick,
        openVideo: function(url) {
            window.open(url, '_blank');
        },
        playVideo: function(videoId, youtubeId, startTime = 0) {
            const thumbnail = document.getElementById(videoId + '-thumbnail');
            const player = document.getElementById(videoId + '-player');
            
            if (thumbnail && player) {
                // 隐藏缩略图
                thumbnail.style.display = 'none';
                
                // 显示播放器并设置视频源
                player.style.display = 'block';
                player.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&start=${startTime}&rel=0&modestbranding=1`;
                
                // 添加关闭按钮
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '✕';
                closeButton.className = 'absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/90 transition-colors z-10';
                closeButton.onclick = function(e) {
                    e.stopPropagation();
                    stopVideo(videoId);
                };
                
                // 将关闭按钮添加到播放器容器
                const playerContainer = player.parentElement;
                if (!playerContainer.querySelector('.close-button')) {
                    closeButton.classList.add('close-button');
                    playerContainer.appendChild(closeButton);
                }
            }
        },
        stopVideo: function(videoId) {
            const thumbnail = document.getElementById(videoId + '-thumbnail');
            const player = document.getElementById(videoId + '-player');
            const closeButton = document.querySelector(`#${videoId}-player`).parentElement.querySelector('.close-button');
            
            if (thumbnail && player) {
                // 显示缩略图
                thumbnail.style.display = 'block';
                
                // 隐藏播放器并停止视频
                player.style.display = 'none';
                player.src = '';
                
                // 移除关闭按钮
                if (closeButton) {
                    closeButton.remove();
                }
            }
        }
    };
}

