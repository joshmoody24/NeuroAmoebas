export function Multiply(color, amount){
    let r = (color >> 16) * amount;
    let g = ((color >> 8) & 0x00ff) * amount;
    let b = ((color) & 0x0000ff) * amount;
    return b | (g << 8) | (r << 16);
}

export function hsl2rgb(h, s, l) {

    var r, g, b, q, p;

    if (s == 0) {
        r = g = b = l;
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t++;
            if (t > 1) t--;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return (r * 255) * 65536 +(g * 255) * 256 + b;
}