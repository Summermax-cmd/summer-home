/**
 * 图片查看器 - 支持高清放大
 * 提供产品图片的放大查看功能，支持最大5倍放大
 */

class ImageViewer {
    constructor() {
        this.overlay = null;
        this.container = null;
        this.image = null;
        this.currentScale = 1;
        this.minScale = 0.5;
        this.maxScale = 5;  // 支持放大到5倍
        this.createViewer();
    }

    /**
     * 创建查看器HTML结构
     */
    createViewer() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'image-viewer-overlay';
        overlay.innerHTML = `
            <div class="image-viewer-close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </div>
            <div class="image-viewer-scale">100%</div>
            <div class="image-viewer-container">
                <img src="" alt=""/>
            </div>
            <div class="image-viewer-controls">
                <button class="image-viewer-control-btn" id="zoom-out-btn">缩小 (-)</button>
                <button class="image-viewer-control-btn" id="reset-btn">重置</button>
                <button class="image-viewer-control-btn" id="zoom-in-btn">放大 (+)</button>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlay = overlay;
        this.container = overlay.querySelector('.image-viewer-container');
        this.image = overlay.querySelector('.image-viewer-container img');
        this.scaleDisplay = overlay.querySelector('.image-viewer-scale');
        this.closeBtn = overlay.querySelector('.image-viewer-close');

        this.setupEvents();
    }

    /**
     * 设置事件监听
     */
    setupEvents() {
        // 关闭查看器
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.overlay.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                case '_':
                    e.preventDefault();
                    this.zoomOut();
                    break;
                case '0':
                    this.reset();
                    break;
            }
        });

        // 控制按钮
        const zoomInBtn = document.getElementById('zoom-in-btn');
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

        // 鼠标滚轮缩放
        this.overlay.addEventListener('wheel', (e) => {
            if (!this.overlay.classList.contains('active')) return;
            
            e.preventDefault();
            
            if (e.deltaY > 0) {
                this.zoomOut();
            } else {
                this.zoomIn();
            }
        });
    }

    /**
     * 显示图片
     * @param {string} imageSrc - 图片URL
     */
    show(imageSrc) {
        this.image.src = imageSrc;
        this.overlay.classList.add('active');
        this.reset();
        document.body.style.overflow = 'hidden';
    }

    /**
     * 关闭查看器
     */
    close() {
        this.overlay.classList.remove('active');
        this.reset();
        document.body.style.overflow = '';
    }

    /**
     * 放大
     */
    zoomIn() {
        if (this.currentScale < this.maxScale) {
            this.currentScale = Math.min(this.currentScale + 0.5, this.maxScale);
            this.updateScale();
        }
    }

    /**
     * 缩小
     */
    zoomOut() {
        if (this.currentScale > this.minScale) {
            this.currentScale = Math.max(this.currentScale - 0.5, this.minScale);
            this.updateScale();
        }
    }

    /**
     * 重置
     */
    reset() {
        this.currentScale = 1;
        this.updateScale();
    }

    /**
     * 更新缩放比例
     */
    updateScale() {
        this.image.style.transform = `scale(${this.currentScale})`;
        this.scaleDisplay.textContent = `${Math.round(this.currentScale * 100)}%`;
    }
}

// 创建全局实例
const imageViewer = new ImageViewer();

/**
 * 为所有产品图片添加点击放大功能
 */
function initializeImageViewer() {
    // 获取所有产品图片
    const productImages = document.querySelectorAll('.product-image img, .gallery-image img, [data-zoom]');
    
    productImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            imageViewer.show(this.src);
        });
    });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImageViewer);
} else {
    initializeImageViewer();
}

// 导出供全局使用
window.ImageViewer = imageViewer;
