/**
 * Color Utilities - Advanced color conversion and matching functions
 */

class ColorUtils {
    constructor() {
        this.namedColors = [];
        this.loadColorData();
    }

    /**
     * Load comprehensive color dataset
     */
    async loadColorData() {
        try {
            const response = await fetch('data/colors.json');
            this.namedColors = await response.json();
        } catch (error) {
            console.warn('Could not load color data, using fallback colors');
            this.namedColors = this.getFallbackColors();
        }
    }

    /**
     * Fallback color dataset (CSS3 named colors + common colors)
     */
    getFallbackColors() {
        return [
            { name: "AliceBlue", r: 240, g: 248, b: 255 },
            { name: "AntiqueWhite", r: 250, g: 235, b: 215 },
            { name: "Aqua", r: 0, g: 255, b: 255 },
            { name: "Aquamarine", r: 127, g: 255, b: 212 },
            { name: "Azure", r: 240, g: 255, b: 255 },
            { name: "Beige", r: 245, g: 245, b: 220 },
            { name: "Bisque", r: 255, g: 228, b: 196 },
            { name: "Black", r: 0, g: 0, b: 0 },
            { name: "BlanchedAlmond", r: 255, g: 235, b: 205 },
            { name: "Blue", r: 0, g: 0, b: 255 },
            { name: "BlueViolet", r: 138, g: 43, b: 226 },
            { name: "Brown", r: 165, g: 42, b: 42 },
            { name: "BurlyWood", r: 222, g: 184, b: 135 },
            { name: "CadetBlue", r: 95, g: 158, b: 160 },
            { name: "Chartreuse", r: 127, g: 255, b: 0 },
            { name: "Chocolate", r: 210, g: 105, b: 30 },
            { name: "Coral", r: 255, g: 127, b: 80 },
            { name: "CornflowerBlue", r: 100, g: 149, b: 237 },
            { name: "Cornsilk", r: 255, g: 248, b: 220 },
            { name: "Crimson", r: 220, g: 20, b: 60 },
            { name: "Cyan", r: 0, g: 255, b: 255 },
            { name: "DarkBlue", r: 0, g: 0, b: 139 },
            { name: "DarkCyan", r: 0, g: 139, b: 139 },
            { name: "DarkGoldenRod", r: 184, g: 134, b: 11 },
            { name: "DarkGray", r: 169, g: 169, b: 169 },
            { name: "DarkGreen", r: 0, g: 100, b: 0 },
            { name: "DarkKhaki", r: 189, g: 183, b: 107 },
            { name: "DarkMagenta", r: 139, g: 0, b: 139 },
            { name: "DarkOliveGreen", r: 85, g: 107, b: 47 },
            { name: "DarkOrange", r: 255, g: 140, b: 0 },
            { name: "DarkOrchid", r: 153, g: 50, b: 204 },
            { name: "DarkRed", r: 139, g: 0, b: 0 },
            { name: "DarkSalmon", r: 233, g: 150, b: 122 },
            { name: "DarkSeaGreen", r: 143, g: 188, b: 143 },
            { name: "DarkSlateBlue", r: 72, g: 61, b: 139 },
            { name: "DarkSlateGray", r: 47, g: 79, b: 79 },
            { name: "DarkTurquoise", r: 0, g: 206, b: 209 },
            { name: "DarkViolet", r: 148, g: 0, b: 211 },
            { name: "DeepPink", r: 255, g: 20, b: 147 },
            { name: "DeepSkyBlue", r: 0, g: 191, b: 255 },
            { name: "DimGray", r: 105, g: 105, b: 105 },
            { name: "DodgerBlue", r: 30, g: 144, b: 255 },
            { name: "FireBrick", r: 178, g: 34, b: 34 },
            { name: "FloralWhite", r: 255, g: 250, b: 240 },
            { name: "ForestGreen", r: 34, g: 139, b: 34 },
            { name: "Fuchsia", r: 255, g: 0, b: 255 },
            { name: "Gainsboro", r: 220, g: 220, b: 220 },
            { name: "GhostWhite", r: 248, g: 248, b: 255 },
            { name: "Gold", r: 255, g: 215, b: 0 },
            { name: "GoldenRod", r: 218, g: 165, b: 32 },
            { name: "Gray", r: 128, g: 128, b: 128 },
            { name: "Green", r: 0, g: 128, b: 0 },
            { name: "GreenYellow", r: 173, g: 255, b: 47 },
            { name: "HoneyDew", r: 240, g: 255, b: 240 },
            { name: "HotPink", r: 255, g: 105, b: 180 },
            { name: "IndianRed", r: 205, g: 92, b: 92 },
            { name: "Indigo", r: 75, g: 0, b: 130 },
            { name: "Ivory", r: 255, g: 255, b: 240 },
            { name: "Khaki", r: 240, g: 230, b: 140 },
            { name: "Lavender", r: 230, g: 230, b: 250 },
            { name: "LavenderBlush", r: 255, g: 240, b: 245 },
            { name: "LawnGreen", r: 124, g: 252, b: 0 },
            { name: "LemonChiffon", r: 255, g: 250, b: 205 },
            { name: "LightBlue", r: 173, g: 216, b: 230 },
            { name: "LightCoral", r: 240, g: 128, b: 128 },
            { name: "LightCyan", r: 224, g: 255, b: 255 },
            { name: "LightGoldenRodYellow", r: 250, g: 250, b: 210 },
            { name: "LightGray", r: 211, g: 211, b: 211 },
            { name: "LightGreen", r: 144, g: 238, b: 144 },
            { name: "LightPink", r: 255, g: 182, b: 193 },
            { name: "LightSalmon", r: 255, g: 160, b: 122 },
            { name: "LightSeaGreen", r: 32, g: 178, b: 170 },
            { name: "LightSkyBlue", r: 135, g: 206, b: 250 },
            { name: "LightSlateGray", r: 119, g: 136, b: 153 },
            { name: "LightSteelBlue", r: 176, g: 196, b: 222 },
            { name: "LightYellow", r: 255, g: 255, b: 224 },
            { name: "Lime", r: 0, g: 255, b: 0 },
            { name: "LimeGreen", r: 50, g: 205, b: 50 },
            { name: "Linen", r: 250, g: 240, b: 230 },
            { name: "Magenta", r: 255, g: 0, b: 255 },
            { name: "Maroon", r: 128, g: 0, b: 0 },
            { name: "MediumAquaMarine", r: 102, g: 205, b: 170 },
            { name: "MediumBlue", r: 0, g: 0, b: 205 },
            { name: "MediumOrchid", r: 186, g: 85, b: 211 },
            { name: "MediumPurple", r: 147, g: 112, b: 219 },
            { name: "MediumSeaGreen", r: 60, g: 179, b: 113 },
            { name: "MediumSlateBlue", r: 123, g: 104, b: 238 },
            { name: "MediumSpringGreen", r: 0, g: 250, b: 154 },
            { name: "MediumTurquoise", r: 72, g: 209, b: 204 },
            { name: "MediumVioletRed", r: 199, g: 21, b: 133 },
            { name: "MidnightBlue", r: 25, g: 25, b: 112 },
            { name: "MintCream", r: 245, g: 255, b: 250 },
            { name: "MistyRose", r: 255, g: 228, b: 225 },
            { name: "Moccasin", r: 255, g: 228, b: 181 },
            { name: "NavajoWhite", r: 255, g: 222, b: 173 },
            { name: "Navy", r: 0, g: 0, b: 128 },
            { name: "OldLace", r: 253, g: 245, b: 230 },
            { name: "Olive", r: 128, g: 128, b: 0 },
            { name: "OliveDrab", r: 107, g: 142, b: 35 },
            { name: "Orange", r: 255, g: 165, b: 0 },
            { name: "OrangeRed", r: 255, g: 69, b: 0 },
            { name: "Orchid", r: 218, g: 112, b: 214 },
            { name: "PaleGoldenRod", r: 238, g: 232, b: 170 },
            { name: "PaleGreen", r: 152, g: 251, b: 152 },
            { name: "PaleTurquoise", r: 175, g: 238, b: 238 },
            { name: "PaleVioletRed", r: 219, g: 112, b: 147 },
            { name: "PapayaWhip", r: 255, g: 239, b: 213 },
            { name: "PeachPuff", r: 255, g: 218, b: 185 },
            { name: "Peru", r: 205, g: 133, b: 63 },
            { name: "Pink", r: 255, g: 192, b: 203 },
            { name: "Plum", r: 221, g: 160, b: 221 },
            { name: "PowderBlue", r: 176, g: 224, b: 230 },
            { name: "Purple", r: 128, g: 0, b: 128 },
            { name: "Red", r: 255, g: 0, b: 0 },
            { name: "RosyBrown", r: 188, g: 143, b: 143 },
            { name: "RoyalBlue", r: 65, g: 105, b: 225 },
            { name: "SaddleBrown", r: 139, g: 69, b: 19 },
            { name: "Salmon", r: 250, g: 128, b: 114 },
            { name: "SandyBrown", r: 244, g: 164, b: 96 },
            { name: "SeaGreen", r: 46, g: 139, b: 87 },
            { name: "SeaShell", r: 255, g: 245, b: 238 },
            { name: "Sienna", r: 160, g: 82, b: 45 },
            { name: "Silver", r: 192, g: 192, b: 192 },
            { name: "SkyBlue", r: 135, g: 206, b: 235 },
            { name: "SlateBlue", r: 106, g: 90, b: 205 },
            { name: "SlateGray", r: 112, g: 128, b: 144 },
            { name: "Snow", r: 255, g: 250, b: 250 },
            { name: "SpringGreen", r: 0, g: 255, b: 127 },
            { name: "SteelBlue", r: 70, g: 130, b: 180 },
            { name: "Tan", r: 210, g: 180, b: 140 },
            { name: "Teal", r: 0, g: 128, b: 128 },
            { name: "Thistle", r: 216, g: 191, b: 216 },
            { name: "Tomato", r: 255, g: 99, b: 71 },
            { name: "Turquoise", r: 64, g: 224, b: 208 },
            { name: "Violet", r: 238, g: 130, b: 238 },
            { name: "Wheat", r: 245, g: 222, b: 179 },
            { name: "White", r: 255, g: 255, b: 255 },
            { name: "WhiteSmoke", r: 245, g: 245, b: 245 },
            { name: "Yellow", r: 255, g: 255, b: 0 },
            { name: "YellowGreen", r: 154, g: 205, b: 50 }
        ];
    }

    /**
     * Convert RGB to HEX
     */
    rgbToHex(r, g, b) {
        const toHex = (c) => {
            const hex = Math.round(c).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    /**
     * Convert RGB to HSL
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    /**
     * Convert RGB to HSV
     */
    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        
        let h, s = max === 0 ? 0 : d / max;
        let v = max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    /**
     * Calculate Euclidean distance between two RGB colors
     */
    calculateColorDistance(r1, g1, b1, r2, g2, b2) {
        return Math.sqrt(
            Math.pow(r1 - r2, 2) +
            Math.pow(g1 - g2, 2) +
            Math.pow(b1 - b2, 2)
        );
    }

    /**
     * Find closest named color match
     */
    findClosestNamedColor(r, g, b) {
        if (!this.namedColors || this.namedColors.length === 0) {
            return { name: 'Unknown', confidence: 0 };
        }

        let minDistance = Infinity;
        let closestColor = this.namedColors[0];

        for (const color of this.namedColors) {
            const distance = this.calculateColorDistance(r, g, b, color.r, color.g, color.b);
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        }

        // Calculate confidence percentage (max distance is ~441 for RGB)
        const confidence = Math.max(0, Math.round((1 - minDistance / 441) * 100));

        return {
            name: closestColor.name,
            confidence: confidence,
            distance: minDistance
        };
    }

    /**
     * Calculate color brightness (0-100%)
     */
    calculateBrightness(r, g, b) {
        // Use luminance formula
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return Math.round((brightness / 255) * 100);
    }

    /**
     * Calculate relative luminance for WCAG contrast calculations
     */
    calculateLuminance(r, g, b) {
        const rsRGB = r / 255;
        const gsRGB = g / 255;
        const bsRGB = b / 255;

        const rLin = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const gLin = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const bLin = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

        return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
    }

    /**
     * Determine color temperature (warm/cool/neutral)
     */
    getColorTemperature(r, g, b) {
        const hsl = this.rgbToHsl(r, g, b);
        const hue = hsl.h;
        
        if (hue >= 0 && hue <= 60) return 'Warm (Red-Yellow)';
        if (hue > 60 && hue <= 120) return 'Neutral (Yellow-Green)';
        if (hue > 120 && hue <= 180) return 'Cool (Green-Cyan)';
        if (hue > 180 && hue <= 240) return 'Cool (Cyan-Blue)';
        if (hue > 240 && hue <= 300) return 'Cool (Blue-Magenta)';
        if (hue > 300 && hue <= 360) return 'Warm (Magenta-Red)';
        
        return 'Neutral';
    }

    /**
     * Get comprehensive color information
     */
    getColorInfo(r, g, b) {
        const hex = this.rgbToHex(r, g, b);
        const hsl = this.rgbToHsl(r, g, b);
        const hsv = this.rgbToHsv(r, g, b);
        const namedColor = this.findClosestNamedColor(r, g, b);
        const brightness = this.calculateBrightness(r, g, b);
        const luminance = this.calculateLuminance(r, g, b);
        const temperature = this.getColorTemperature(r, g, b);

        return {
            rgb: { r, g, b },
            hex,
            hsl,
            hsv,
            namedColor,
            brightness,
            luminance,
            temperature
        };
    }

    /**
     * Format color values for display
     */
    formatColorValues(colorInfo) {
        return {
            rgb: `rgb(${colorInfo.rgb.r}, ${colorInfo.rgb.g}, ${colorInfo.rgb.b})`,
            hex: colorInfo.hex,
            hsl: `hsl(${colorInfo.hsl.h}, ${colorInfo.hsl.s}%, ${colorInfo.hsl.l}%)`,
            hsv: `hsv(${colorInfo.hsv.h}, ${colorInfo.hsv.s}%, ${colorInfo.hsv.v}%)`,
            namedColor: colorInfo.namedColor.name,
            confidence: colorInfo.namedColor.confidence,
            brightness: `${colorInfo.brightness}%`,
            luminance: colorInfo.luminance.toFixed(3),
            temperature: colorInfo.temperature
        };
    }

    /**
     * Generate color palette from base color
     */
    generatePalette(r, g, b, type = 'monochromatic') {
        const hsl = this.rgbToHsl(r, g, b);
        const palette = [];

        switch (type) {
            case 'monochromatic':
                // Generate shades and tints
                for (let i = -4; i <= 4; i++) {
                    const newL = Math.max(0, Math.min(100, hsl.l + (i * 15)));
                    const rgb = this.hslToRgb(hsl.h, hsl.s, newL);
                    palette.push(rgb);
                }
                break;
            
            case 'analogous':
                // Generate analogous colors (±30° hue)
                for (let i = -2; i <= 2; i++) {
                    const newH = (hsl.h + (i * 30) + 360) % 360;
                    const rgb = this.hslToRgb(newH, hsl.s, hsl.l);
                    palette.push(rgb);
                }
                break;
            
            case 'complementary':
                // Original + complementary
                palette.push({ r, g, b });
                const compH = (hsl.h + 180) % 360;
                palette.push(this.hslToRgb(compH, hsl.s, hsl.l));
                break;
            
            case 'triadic':
                // Three colors equally spaced
                for (let i = 0; i < 3; i++) {
                    const newH = (hsl.h + (i * 120)) % 360;
                    const rgb = this.hslToRgb(newH, hsl.s, hsl.l);
                    palette.push(rgb);
                }
                break;
        }

        return palette;
    }

    /**
     * Convert HSL to RGB
     */
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}

// Export for use in other modules
window.ColorUtils = ColorUtils;