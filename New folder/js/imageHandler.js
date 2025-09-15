/**
 * Image Handler - Manages image upload, processing, and canvas operations
 */

class ImageHandler {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.imageData = null;
        this.originalImage = null;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
        this.maxImageSize = 2000; // Max width/height for performance
    }

    /**
     * Initialize the image handler with canvas element
     */
    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas properties for better quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    /**
     * Validate uploaded file
     */
    validateFile(file) {
        const errors = [];

        if (!file) {
            errors.push('No file selected');
            return errors;
        }

        // Check file type
        if (!this.supportedFormats.includes(file.type.toLowerCase())) {
            errors.push(`Unsupported file format. Supported: ${this.supportedFormats.join(', ')}`);
        }

        // Check file size
        if (file.size > this.maxFileSize) {
            errors.push(`File too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`);
        }

        return errors;
    }

    /**
     * Load and process image file
     */
    async loadImage(file, onProgress = null) {
        return new Promise((resolve, reject) => {
            const errors = this.validateFile(file);
            if (errors.length > 0) {
                reject(new Error(errors.join(', ')));
                return;
            }

            const reader = new FileReader();
            
            reader.onprogress = (event) => {
                if (onProgress && event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    onProgress(progress);
                }
            };

            reader.onload = (event) => {
                const img = new Image();
                
                img.onload = () => {
                    try {
                        this.originalImage = img;
                        this.processImage(img);
                        resolve({
                            success: true,
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                            size: file.size,
                            type: file.type
                        });
                    } catch (error) {
                        reject(error);
                    }
                };

                img.onerror = () => {
                    reject(new Error('Failed to load image. The file may be corrupted.'));
                };

                img.src = event.target.result;
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Process and resize image if needed
     */
    processImage(img) {
        const { width, height } = this.calculateOptimalSize(img.naturalWidth, img.naturalHeight);
        
        // Set canvas size
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Reset transformations
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Clear canvas and draw image
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.drawImage(img, 0, 0, width, height);
        
        // Store image data for pixel reading
        this.imageData = this.ctx.getImageData(0, 0, width, height);
        
        // Update canvas display style for proper scaling
        this.updateCanvasDisplay();
    }

    /**
     * Calculate optimal image size for performance and display
     */
    calculateOptimalSize(originalWidth, originalHeight) {
        if (originalWidth <= this.maxImageSize && originalHeight <= this.maxImageSize) {
            return { width: originalWidth, height: originalHeight };
        }

        const aspectRatio = originalWidth / originalHeight;
        
        if (originalWidth > originalHeight) {
            return {
                width: this.maxImageSize,
                height: Math.round(this.maxImageSize / aspectRatio)
            };
        } else {
            return {
                width: Math.round(this.maxImageSize * aspectRatio),
                height: this.maxImageSize
            };
        }
    }

    /**
     * Update canvas display properties
     */
    updateCanvasDisplay() {
        if (!this.canvas) return;

        const container = this.canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        const maxWidth = containerRect.width - 40; // Account for padding
        const maxHeight = Math.min(600, containerRect.height - 40);
        
        const scaleX = maxWidth / this.canvas.width;
        const scaleY = maxHeight / this.canvas.height;
        const displayScale = Math.min(scaleX, scaleY, 1);
        
        this.canvas.style.width = `${this.canvas.width * displayScale}px`;
        this.canvas.style.height = `${this.canvas.height * displayScale}px`;
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.maxHeight = '100%';
    }

    /**
     * Get pixel color at canvas coordinates
     */
    getPixelColor(canvasX, canvasY) {
        if (!this.imageData) {
            throw new Error('No image loaded');
        }

        // Convert display coordinates to actual canvas coordinates
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = Math.floor(canvasX * scaleX);
        const y = Math.floor(canvasY * scaleY);
        
        // Check bounds
        if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) {
            throw new Error('Coordinates out of bounds');
        }

        // Get pixel data
        const index = (y * this.canvas.width + x) * 4;
        const data = this.imageData.data;
        
        return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3],
            x: x,
            y: y
        };
    }

    /**
     * Get canvas coordinates from mouse/touch event
     */
    getCanvasCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    /**
     * Zoom canvas
     */
    zoom(factor, centerX = null, centerY = null) {
        if (!this.canvas || !this.originalImage) return;

        const newScale = Math.max(0.1, Math.min(5, this.scale * factor));
        
        if (centerX !== null && centerY !== null) {
            // Zoom towards specific point
            this.offsetX = centerX - (centerX - this.offsetX) * (newScale / this.scale);
            this.offsetY = centerY - (centerY - this.offsetY) * (newScale / this.scale);
        }
        
        this.scale = newScale;
        this.redrawCanvas();
    }

    /**
     * Pan canvas
     */
    pan(deltaX, deltaY) {
        if (!this.canvas || !this.originalImage) return;

        this.offsetX += deltaX;
        this.offsetY += deltaY;
        this.redrawCanvas();
    }

    /**
     * Reset view to original state
     */
    resetView() {
        if (!this.originalImage) return;

        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.processImage(this.originalImage);
    }

    /**
     * Redraw canvas with current transformations
     */
    redrawCanvas() {
        if (!this.originalImage) return;

        const { width, height } = this.calculateOptimalSize(
            this.originalImage.naturalWidth, 
            this.originalImage.naturalHeight
        );
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.save();
        
        // Apply transformations
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        
        // Draw image
        this.ctx.drawImage(this.originalImage, 0, 0, width, height);
        this.ctx.restore();
        
        // Update image data
        this.imageData = this.ctx.getImageData(0, 0, width, height);
        this.updateCanvasDisplay();
    }

    /**
     * Get image information for display
     */
    getImageInfo() {
        if (!this.originalImage) {
            return 'No image loaded';
        }

        const width = this.originalImage.naturalWidth;
        const height = this.originalImage.naturalHeight;
        const aspectRatio = (width / height).toFixed(2);
        
        return `${width} × ${height} (${aspectRatio}:1)`;
    }

    /**
     * Export current canvas as image
     */
    exportCanvas(format = 'png', quality = 0.9) {
        if (!this.canvas) return null;

        return this.canvas.toDataURL(`image/${format}`, quality);
    }

    /**
     * Check if image is loaded
     */
    hasImage() {
        return this.originalImage !== null;
    }

    /**
     * Clear current image
     */
    clearImage() {
        this.originalImage = null;
        this.imageData = null;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Get canvas as blob for saving
     */
    getCanvasBlob(callback, format = 'image/png', quality = 0.9) {
        if (!this.canvas) {
            callback(null);
            return;
        }

        this.canvas.toBlob(callback, format, quality);
    }
}

// Export for use in other modules
window.ImageHandler = ImageHandler;