/**
 * Color Picker Pro - Main Application
 */

class ColorPickerApp {
    constructor() {
        this.colorUtils = new ColorUtils();
        this.imageHandler = new ImageHandler();
        this.colorHistory = [];
        this.maxHistorySize = 10;
        this.currentColor = null;
        
        // Elements
        this.elements = {};
        
        // State
        this.isDragging = false;
        this.lastPanPoint = null;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.initElements();
        this.initEventListeners();
        this.loadColorHistory();
        this.imageHandler.init('imageCanvas');
        
        // Load color data
        this.colorUtils.loadColorData();
        
        console.log('Color Picker Pro initialized');
    }

    /**
     * Initialize DOM elements
     */
    initElements() {
        this.elements = {
            // Upload
            uploadSection: document.getElementById('uploadSection'),
            uploadArea: document.getElementById('uploadArea'),
            fileInput: document.getElementById('fileInput'),
            uploadProgress: document.getElementById('uploadProgress'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            
            // Canvas
            canvasSection: document.getElementById('canvasSection'),
            imageCanvas: document.getElementById('imageCanvas'),
            imageInfo: document.getElementById('imageInfo'),
            mouseCoords: document.getElementById('mouseCoords'),
            crosshair: document.getElementById('crosshair'),
            
            // Controls
            zoomInBtn: document.getElementById('zoomInBtn'),
            zoomOutBtn: document.getElementById('zoomOutBtn'),
            resetViewBtn: document.getElementById('resetViewBtn'),
            newImageBtn: document.getElementById('newImageBtn'),
            
            // Results
            resultsSection: document.getElementById('resultsSection'),
            colorPreview: document.getElementById('colorPreview'),
            colorFormats: document.getElementById('colorFormats'),
            
            // Color values
            redSlider: document.getElementById('redSlider'),
            greenSlider: document.getElementById('greenSlider'),
            blueSlider: document.getElementById('blueSlider'),
            redValue: document.getElementById('redValue'),
            greenValue: document.getElementById('greenValue'),
            blueValue: document.getElementById('blueValue'),
            hexValue: document.getElementById('hexValue'),
            hslValue: document.getElementById('hslValue'),
            namedColor: document.getElementById('namedColor'),
            confidenceBadge: document.getElementById('confidenceBadge'),
            
            // Analysis
            brightnessValue: document.getElementById('brightnessValue'),
            luminanceValue: document.getElementById('luminanceValue'),
            temperatureValue: document.getElementById('temperatureValue'),
            
            // History
            historySection: document.getElementById('historySection'),
            historyGrid: document.getElementById('historyGrid'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),
            savePaletteBtn: document.getElementById('savePaletteBtn'),
            
            // Modal
            helpModal: document.getElementById('helpModal'),
            helpBtn: document.getElementById('helpBtn'),
            closeHelpBtn: document.getElementById('closeHelpBtn'),
            
            // Toast
            toastContainer: document.getElementById('toastContainer')
        };
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // File upload
        this.elements.uploadArea.addEventListener('click', () => {
            this.elements.fileInput.click();
        });

        this.elements.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });

        // Drag and drop
        this.elements.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.elements.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.elements.uploadArea.addEventListener('drop', this.handleDrop.bind(this));

        // Canvas interactions
        this.elements.imageCanvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.elements.imageCanvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
        this.elements.imageCanvas.addEventListener('mouseleave', this.handleCanvasMouseLeave.bind(this));
        
        // Touch events for mobile
        this.elements.imageCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.elements.imageCanvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.elements.imageCanvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Canvas controls
        this.elements.zoomInBtn.addEventListener('click', () => this.imageHandler.zoom(1.2));
        this.elements.zoomOutBtn.addEventListener('click', () => this.imageHandler.zoom(0.8));
        this.elements.resetViewBtn.addEventListener('click', () => this.imageHandler.resetView());
        this.elements.newImageBtn.addEventListener('click', this.showUploadSection.bind(this));

        // RGB sliders
        this.elements.redSlider.addEventListener('input', this.handleRGBSliderChange.bind(this));
        this.elements.greenSlider.addEventListener('input', this.handleRGBSliderChange.bind(this));
        this.elements.blueSlider.addEventListener('input', this.handleRGBSliderChange.bind(this));

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', this.handleCopyClick.bind(this));
        });

        // History actions
        this.elements.clearHistoryBtn.addEventListener('click', this.clearColorHistory.bind(this));
        this.elements.savePaletteBtn.addEventListener('click', this.savePalette.bind(this));

        // Modal
        this.elements.helpBtn.addEventListener('click', this.showHelpModal.bind(this));
        this.elements.closeHelpBtn.addEventListener('click', this.hideHelpModal.bind(this));
        this.elements.helpModal.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal) {
                this.hideHelpModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Window resize
        window.addEventListener('resize', () => {
            if (this.imageHandler.hasImage()) {
                this.imageHandler.updateCanvasDisplay();
            }
        });
    }

    /**
     * Handle file upload
     */
    async handleFileUpload(file) {
        try {
            this.showProgress(0);
            
            const result = await this.imageHandler.loadImage(file, (progress) => {
                this.showProgress(progress);
            });
            
            this.hideProgress();
            this.showCanvasSection();
            this.updateImageInfo(result);
            this.showToast('Image loaded successfully!', 'success');
            
        } catch (error) {
            this.hideProgress();
            this.showToast(error.message, 'error');
        }
    }

    /**
     * Handle drag over
     */
    handleDragOver(e) {
        e.preventDefault();
        this.elements.uploadArea.classList.add('drag-over');
    }

    /**
     * Handle drag leave
     */
    handleDragLeave(e) {
        e.preventDefault();
        this.elements.uploadArea.classList.remove('drag-over');
    }

    /**
     * Handle drop
     */
    handleDrop(e) {
        e.preventDefault();
        this.elements.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFileUpload(files[0]);
        }
    }

    /**
     * Handle canvas click
     */
    handleCanvasClick(e) {
        try {
            const coords = this.imageHandler.getCanvasCoordinates(e);
            const pixelColor = this.imageHandler.getPixelColor(coords.x, coords.y);
            
            this.updateColorInfo(pixelColor.r, pixelColor.g, pixelColor.b);
            this.addToColorHistory(pixelColor.r, pixelColor.g, pixelColor.b);
            
        } catch (error) {
            this.showToast('Error detecting color: ' + error.message, 'error');
        }
    }

    /**
     * Handle canvas mouse move
     */
    handleCanvasMouseMove(e) {
        try {
            const coords = this.imageHandler.getCanvasCoordinates(e);
            const rect = this.elements.imageCanvas.getBoundingClientRect();
            
            // Update coordinates display
            this.elements.mouseCoords.textContent = `x: ${Math.floor(coords.x)}, y: ${Math.floor(coords.y)}`;
            
            // Show crosshair
            this.elements.crosshair.style.left = `${coords.x + rect.left - 10}px`;
            this.elements.crosshair.style.top = `${coords.y + rect.top - 10}px`;
            this.elements.crosshair.style.opacity = '1';
            
            // Show preview color on hover (optional - can be resource intensive)
            if (e.shiftKey) {
                const pixelColor = this.imageHandler.getPixelColor(coords.x, coords.y);
                this.updatePreviewColor(pixelColor.r, pixelColor.g, pixelColor.b);
            }
            
        } catch (error) {
            // Ignore errors during mouse move
        }
    }

    /**
     * Handle canvas mouse leave
     */
    handleCanvasMouseLeave() {
        this.elements.crosshair.style.opacity = '0';
        this.elements.mouseCoords.textContent = 'x: 0, y: 0';
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        
        // Simulate mouse move for crosshair
        this.handleCanvasMouseMove(touch);
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        
        // Update crosshair position
        this.handleCanvasMouseMove(touch);
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        e.preventDefault();
        
        if (e.changedTouches.length > 0) {
            // Simulate click
            this.handleCanvasClick(e.changedTouches[0]);
        }
        
        // Hide crosshair
        this.handleCanvasMouseLeave();
    }

    /**
     * Handle RGB slider changes
     */
    handleRGBSliderChange() {
        const r = parseInt(this.elements.redSlider.value);
        const g = parseInt(this.elements.greenSlider.value);
        const b = parseInt(this.elements.blueSlider.value);
        
        this.updateColorInfo(r, g, b, false); // Don't add to history for slider changes
    }

    /**
     * Handle copy button clicks
     */
    handleCopyClick(e) {
        const copyType = e.currentTarget.dataset.copyType;
        let textToCopy = '';
        
        switch (copyType) {
            case 'rgb':
                textToCopy = `rgb(${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b})`;
                break;
            case 'hex':
                textToCopy = this.elements.hexValue.textContent;
                break;
            case 'hsl':
                textToCopy = this.elements.hslValue.textContent;
                break;
        }
        
        this.copyToClipboard(textToCopy);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyDown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return; // Don't handle shortcuts when typing
        }
        
        switch (e.key.toLowerCase()) {
            case '+':
            case '=':
                e.preventDefault();
                this.imageHandler.zoom(1.2);
                break;
            case '-':
                e.preventDefault();
                this.imageHandler.zoom(0.8);
                break;
            case 'r':
                e.preventDefault();
                this.imageHandler.resetView();
                break;
            case 'c':
                if (this.currentColor) {
                    e.preventDefault();
                    const hex = this.colorUtils.rgbToHex(this.currentColor.r, this.currentColor.g, this.currentColor.b);
                    this.copyToClipboard(hex);
                }
                break;
            case 'escape':
                this.hideHelpModal();
                break;
        }
    }

    /**
     * Update color information display
     */
    updateColorInfo(r, g, b, addToHistory = true) {
        this.currentColor = { r, g, b };
        
        const colorInfo = this.colorUtils.getColorInfo(r, g, b);
        const formatted = this.colorUtils.formatColorValues(colorInfo);
        
        // Update preview swatch
        const swatch = this.elements.colorPreview.querySelector('.preview-swatch');
        swatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        
        // Update preview text
        const previewText = this.elements.colorPreview.querySelector('.preview-text');
        previewText.textContent = formatted.hex;
        
        // Update RGB sliders and values
        this.elements.redSlider.value = r;
        this.elements.greenSlider.value = g;
        this.elements.blueSlider.value = b;
        this.elements.redValue.textContent = r;
        this.elements.greenValue.textContent = g;
        this.elements.blueValue.textContent = b;
        
        // Update color format displays
        this.elements.hexValue.textContent = formatted.hex;
        this.elements.hslValue.textContent = formatted.hsl;
        this.elements.namedColor.textContent = formatted.namedColor;
        
        // Update confidence badge
        this.elements.confidenceBadge.textContent = `${formatted.confidence}% match`;
        this.updateConfidenceBadgeColor(formatted.confidence);
        
        // Update analysis
        this.elements.brightnessValue.textContent = formatted.brightness;
        this.elements.luminanceValue.textContent = formatted.luminance;
        this.elements.temperatureValue.textContent = formatted.temperature;
        
        // Update RGB slider colors for better visual feedback
        this.updateSliderColors(r, g, b);
        
        if (addToHistory) {
            this.addToColorHistory(r, g, b);
        }
    }

    /**
     * Update preview color (for hover effects)
     */
    updatePreviewColor(r, g, b) {
        const swatch = this.elements.colorPreview.querySelector('.preview-swatch');
        swatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Update confidence badge color based on confidence level
     */
    updateConfidenceBadgeColor(confidence) {
        const badge = this.elements.confidenceBadge;
        badge.classList.remove('high-confidence', 'medium-confidence', 'low-confidence');
        
        if (confidence >= 80) {
            badge.style.background = 'var(--success-50)';
            badge.style.color = 'var(--success-600)';
        } else if (confidence >= 60) {
            badge.style.background = 'var(--warning-50)';
            badge.style.color = 'var(--warning-600)';
        } else {
            badge.style.background = 'var(--error-50)';
            badge.style.color = 'var(--error-600)';
        }
    }

    /**
     * Update RGB slider colors for better visual feedback
     */
    updateSliderColors(r, g, b) {
        const redSlider = this.elements.redSlider;
        const greenSlider = this.elements.greenSlider;
        const blueSlider = this.elements.blueSlider;
        
        // Create gradients for sliders
        redSlider.style.background = `linear-gradient(to right, rgb(0,${g},${b}), rgb(255,${g},${b}))`;
        greenSlider.style.background = `linear-gradient(to right, rgb(${r},0,${b}), rgb(${r},255,${b}))`;
        blueSlider.style.background = `linear-gradient(to right, rgb(${r},${g},0), rgb(${r},${g},255))`;
    }

    /**
     * Add color to history
     */
    addToColorHistory(r, g, b) {
        const hex = this.colorUtils.rgbToHex(r, g, b);
        
        // Remove if already exists to avoid duplicates
        this.colorHistory = this.colorHistory.filter(color => color.hex !== hex);
        
        // Add to beginning
        this.colorHistory.unshift({ r, g, b, hex, timestamp: Date.now() });
        
        // Limit history size
        if (this.colorHistory.length > this.maxHistorySize) {
            this.colorHistory = this.colorHistory.slice(0, this.maxHistorySize);
        }
        
        this.updateHistoryDisplay();
        this.saveColorHistory();
    }

    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const grid = this.elements.historyGrid;
        
        if (this.colorHistory.length === 0) {
            grid.innerHTML = `
                <div class="history-placeholder">
                    <p>No colors picked yet</p>
                    <small>Click on the image to start building your color history</small>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = this.colorHistory.map(color => `
            <div class="history-item" 
                 style="background-color: ${color.hex}" 
                 title="${color.hex}"
                 data-r="${color.r}" 
                 data-g="${color.g}" 
                 data-b="${color.b}"
                 onclick="app.selectHistoryColor(${color.r}, ${color.g}, ${color.b})">
            </div>
        `).join('');
    }

    /**
     * Select color from history
     */
    selectHistoryColor(r, g, b) {
        this.updateColorInfo(r, g, b, false); // Don't add to history again
        this.showToast(`Selected color: ${this.colorUtils.rgbToHex(r, g, b)}`, 'success');
    }

    /**
     * Clear color history
     */
    clearColorHistory() {
        if (this.colorHistory.length === 0) {
            this.showToast('History is already empty', 'warning');
            return;
        }
        
        this.colorHistory = [];
        this.updateHistoryDisplay();
        this.saveColorHistory();
        this.showToast('Color history cleared', 'success');
    }

    /**
     * Save palette
     */
    savePalette() {
        if (this.colorHistory.length === 0) {
            this.showToast('No colors in history to save', 'warning');
            return;
        }
        
        const palette = {
            name: `Color Palette ${new Date().toLocaleDateString()}`,
            colors: this.colorHistory.map(color => ({
                name: this.colorUtils.findClosestNamedColor(color.r, color.g, color.b).name,
                hex: color.hex,
                rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
                hsl: (() => {
                    const hsl = this.colorUtils.rgbToHsl(color.r, color.g, color.b);
                    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                })()
            })),
            created: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(palette, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `color-palette-${Date.now()}.json`;
        link.click();
        
        this.showToast('Palette saved successfully!', 'success');
    }

    /**
     * Save color history to localStorage
     */
    saveColorHistory() {
        try {
            localStorage.setItem('colorPickerHistory', JSON.stringify(this.colorHistory));
        } catch (error) {
            console.warn('Could not save color history:', error);
        }
    }

    /**
     * Load color history from localStorage
     */
    loadColorHistory() {
        try {
            const saved = localStorage.getItem('colorPickerHistory');
            if (saved) {
                this.colorHistory = JSON.parse(saved);
                this.updateHistoryDisplay();
            }
        } catch (error) {
            console.warn('Could not load color history:', error);
            this.colorHistory = [];
        }
    }

    /**
     * Show upload section
     */
    showUploadSection() {
        this.elements.uploadSection.style.display = 'flex';
        this.elements.canvasSection.style.display = 'none';
        this.imageHandler.clearImage();
        this.elements.imageInfo.textContent = 'No image loaded';
    }

    /**
     * Show canvas section
     */
    showCanvasSection() {
        this.elements.uploadSection.style.display = 'none';
        this.elements.canvasSection.style.display = 'block';
    }

    /**
     * Update image info display
     */
    updateImageInfo(result) {
        const sizeKB = (result.size / 1024).toFixed(1);
        this.elements.imageInfo.textContent = `${result.width} × ${result.height} • ${sizeKB}KB • ${result.type.split('/')[1].toUpperCase()}`;
    }

    /**
     * Show upload progress
     */
    showProgress(progress) {
        this.elements.uploadProgress.style.display = 'block';
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressText.textContent = `${Math.round(progress)}%`;
    }

    /**
     * Hide upload progress
     */
    hideProgress() {
        this.elements.uploadProgress.style.display = 'none';
    }

    /**
     * Show help modal
     */
    showHelpModal() {
        this.elements.helpModal.classList.add('show');
    }

    /**
     * Hide help modal
     */
    hideHelpModal() {
        this.elements.helpModal.classList.remove('show');
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast(`Copied: ${text}`, 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showToast(`Copied: ${text}`, 'success');
            } catch (fallbackError) {
                this.showToast('Could not copy to clipboard', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success' ? '<polyline points="20,6 9,17 4,12"></polyline>' : 
                  type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' :
                  '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'}
            </svg>
            <span>${message}</span>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ColorPickerApp();
});