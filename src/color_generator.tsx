function hslToRgb(h:number, s:number, l:number) {
h /= 360;
s /= 100;
l /= 100;
let r, g, b;

if (s === 0) {
    r = g = b = l;
} else {
    const hue2rgb = (p:number, q:number, t:number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
}

return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

export function generateContrastingColors(numColors:number) {
let colors = [];
for (let i = 0; i < numColors; i++) {
    const hue = (i * (360 / numColors)) % 360;
    const saturation = 75; // You can adjust the saturation value to control color intensity
    const lightness = 50; // You can adjust the lightness value to control brightness

    const rgbColor = hslToRgb(hue, saturation, lightness);
    colors.push(rgbColor);
}
return colors;
}
  
