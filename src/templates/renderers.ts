export type RenderFn = (ctx: CanvasRenderingContext2D, photos: HTMLImageElement[], width: number, height: number) => void;

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function loadPhotos(dataUrls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(dataUrls.map(loadImage));
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

// ─── Classic Strip ────────────────────────────────────────
export const renderClassicStrip: RenderFn = (ctx, photos, W, H) => {
  const pad = W * 0.06;
  const gap = W * 0.04;
  const photoH = (H - pad * 2 - gap * 2) / 3;
  const photoW = W - pad * 2;

  // Background
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, W, H);

  // Gold edge lines
  ctx.strokeStyle = '#f5c84244';
  ctx.lineWidth = 1;
  ctx.strokeRect(4, 4, W - 8, H - 8);

  // Sprocket holes
  const holeR = 4;
  const holeSpacing = 22;
  ctx.fillStyle = '#222';
  for (let y = pad; y < H - pad; y += holeSpacing) {
    ctx.beginPath(); ctx.arc(10, y, holeR, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W - 10, y, holeR, 0, Math.PI * 2); ctx.fill();
  }

  photos.forEach((img, i) => {
    const py = pad + i * (photoH + gap);
    ctx.save();
    // White frame
    ctx.fillStyle = '#fff';
    ctx.fillRect(pad - 2, py - 2, photoW + 4, photoH + 4);
    ctx.beginPath();
    ctx.rect(pad, py, photoW, photoH);
    ctx.clip();
    drawImageCover(ctx, img, pad, py, photoW, photoH);
    ctx.restore();
  });

  // Brand text at bottom
  ctx.fillStyle = '#f5c842';
  ctx.font = `bold ${W * 0.07}px 'Special Elite', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('PHOTO BOOTH', W / 2, H - 12);
};

// ─── Newspaper ────────────────────────────────────────────
export const renderNewspaper: RenderFn = (ctx, photos, W, H) => {
  // Aged paper background
  ctx.fillStyle = '#e8dfc8';
  ctx.fillRect(0, 0, W, H);

  // Noise texture lines
  ctx.strokeStyle = 'rgba(139,119,80,0.08)';
  ctx.lineWidth = 1;
  for (let y = 0; y < H; y += 4) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const marg = W * 0.05;
  const inner = W - marg * 2;

  // Masthead
  ctx.fillStyle = '#1a1006';
  ctx.font = `900 ${W * 0.1}px 'Playfair Display', serif`;
  ctx.textAlign = 'center';
  ctx.fillText('THE DAILY BOOTH', W / 2, marg + W * 0.09);

  // Divider lines
  ctx.strokeStyle = '#1a1006';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(marg, marg + W * 0.105); ctx.lineTo(W - marg, marg + W * 0.105); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(marg, marg + W * 0.115); ctx.lineTo(W - marg, marg + W * 0.115); ctx.stroke();

  // Date line
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  ctx.font = `${W * 0.028}px 'Special Elite', monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(date.toUpperCase(), marg, marg + W * 0.14);
  ctx.textAlign = 'right';
  ctx.fillText('VOL. I  •  EDITION 1', W - marg, marg + W * 0.14);

  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(marg, marg + W * 0.15); ctx.lineTo(W - marg, marg + W * 0.15); ctx.stroke();

  // Headline
  ctx.textAlign = 'center';
  ctx.font = `bold ${W * 0.065}px 'Playfair Display', serif`;
  ctx.fillStyle = '#0d0a04';
  ctx.fillText('CAPTURED IN STYLE', W / 2, marg + W * 0.21);

  ctx.font = `italic ${W * 0.033}px 'Playfair Display', serif`;
  ctx.fillStyle = '#4a3a1a';
  ctx.fillText('Three Moments Worth Remembering', W / 2, marg + W * 0.245);

  const colStart = marg + W * 0.26;
  const photoW = (inner - W * 0.03) / 3;
  const photoH = H - colStart - marg - W * 0.1;

  // Column dividers & photos
  photos.forEach((img, i) => {
    const px = marg + i * (photoW + W * 0.015);
    if (i > 0) {
      ctx.strokeStyle = '#1a1006';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(px - W * 0.0075, colStart); ctx.lineTo(px - W * 0.0075, H - marg - W * 0.06); ctx.stroke();
    }
    ctx.save();
    ctx.beginPath(); ctx.rect(px, colStart, photoW, photoH); ctx.clip();
    drawImageCover(ctx, img, px, colStart, photoW, photoH);
    ctx.restore();
    // Caption
    ctx.fillStyle = '#2a1a06';
    ctx.font = `italic ${W * 0.026}px 'Playfair Display', serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`Photo ${i + 1}`, px + photoW / 2, H - marg - W * 0.035);
  });

  // Footer line
  ctx.strokeStyle = '#1a1006';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(marg, H - marg - W * 0.065); ctx.lineTo(W - marg, H - marg - W * 0.065); ctx.stroke();
  ctx.font = `${W * 0.025}px 'Special Elite', monospace`;
  ctx.fillStyle = '#4a3a1a';
  ctx.textAlign = 'center';
  ctx.fillText('© THE DAILY BOOTH  •  ALL PHOTOS RESERVED', W / 2, H - marg - W * 0.02);
};

// ─── Columns ──────────────────────────────────────────────
export const renderColumns: RenderFn = (ctx, photos, W, H) => {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0a1628');
  grad.addColorStop(1, '#0d2244');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const pad = H * 0.06;
  const gap = H * 0.025;
  const colW = (W - pad * 2 - gap * 2) / 3;
  const colH = H - pad * 2;

  // Top accent bar
  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, '#6ab3ff');
  barGrad.addColorStop(1, '#b36aff');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, W, 4);

  photos.forEach((img, i) => {
    const px = pad + i * (colW + gap);
    const py = pad;

    // Card shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#111';
    ctx.fillRect(px, py, colW, colH);
    ctx.restore();

    // Photo
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px, py, colW, colH, 4);
    ctx.clip();
    drawImageCover(ctx, img, px, py, colW, colH);
    ctx.restore();

    // Number badge
    const badgeGrad = ctx.createLinearGradient(px, py, px + colW, py);
    badgeGrad.addColorStop(0, '#6ab3ff');
    badgeGrad.addColorStop(1, '#b36aff');
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.roundRect(px + 10, py + 10, 32, 32, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${colH * 0.045}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1}`, px + 26, py + 31);
  });

  // Bottom label
  const textGrad = ctx.createLinearGradient(0, 0, W, 0);
  textGrad.addColorStop(0, '#6ab3ff');
  textGrad.addColorStop(1, '#b36aff');
  ctx.fillStyle = textGrad;
  ctx.font = `900 ${H * 0.042}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('PHOTO BOOTH', W / 2, H - pad * 0.28);
};

// ─── Polaroid Wall ────────────────────────────────────────
export const renderPolaroid: RenderFn = (ctx, photos, W, H) => {
  // Cork board background
  const corkGrad = ctx.createLinearGradient(0, 0, W, H);
  corkGrad.addColorStop(0, '#b5834a');
  corkGrad.addColorStop(0.5, '#c8974f');
  corkGrad.addColorStop(1, '#a57240');
  ctx.fillStyle = corkGrad;
  ctx.fillRect(0, 0, W, H);

  // Cork texture dots
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '80,50,20' : '200,160,100'},${Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 3 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const pW = W * 0.34;
  const pH = pW * 1.2;
  const imgH = pW * 0.82;

  const positions = [
    { x: W * 0.05,  y: H * 0.04,  rot: -6 },
    { x: W * 0.34,  y: H * 0.28,  rot: 4  },
    { x: W * 0.6,   y: H * 0.06,  rot: -3 },
  ];

  photos.forEach((img, i) => {
    const { x, y, rot } = positions[i];
    ctx.save();
    ctx.translate(x + pW / 2, y + pH / 2);
    ctx.rotate((rot * Math.PI) / 180);

    // Drop shadow
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 8;

    // White polaroid card
    ctx.fillStyle = '#faf9f5';
    ctx.fillRect(-pW / 2, -pH / 2, pW, pH);
    ctx.shadowColor = 'transparent';

    // Photo area
    ctx.save();
    ctx.beginPath();
    ctx.rect(-pW / 2 + pW * 0.05, -pH / 2 + pW * 0.05, pW * 0.9, imgH);
    ctx.clip();
    drawImageCover(ctx, img, -pW / 2 + pW * 0.05, -pH / 2 + pW * 0.05, pW * 0.9, imgH);
    ctx.restore();

    // Tape strip
    ctx.fillStyle = 'rgba(255,255,180,0.6)';
    ctx.fillRect(-pW * 0.12, -pH / 2 - 8, pW * 0.24, 14);

    ctx.restore();
  });
};

// ─── Film Reel ────────────────────────────────────────────
export const renderFilmReel: RenderFn = (ctx, photos, W, H) => {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  const holeW = H * 0.12;
  const holeH = H * 0.08;
  const holeGap = H * 0.055;
  const holeMarginY = H * 0.06;
  const numHoles = Math.floor((W) / (holeW + holeGap));

  // Top & bottom sprocket strips
  [holeMarginY, H - holeMarginY - holeH].forEach((hy) => {
    let hx = (W - numHoles * (holeW + holeGap) + holeGap) / 2;
    for (let i = 0; i < numHoles; i++) {
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.roundRect(hx, hy, holeW, holeH, 3);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.stroke();
      hx += holeW + holeGap;
    }
  });

  // Photo frames
  const photoZoneTop = H * 0.22;
  const photoZoneH = H * 0.56;
  const frameGap = W * 0.018;
  const frameW = (W - frameGap * 4) / 3;

  photos.forEach((img, i) => {
    const px = frameGap + i * (frameW + frameGap);

    ctx.save();
    ctx.shadowColor = 'rgba(255,50,50,0.25)';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#111';
    ctx.fillRect(px, photoZoneTop, frameW, photoZoneH);
    ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.rect(px, photoZoneTop, frameW, photoZoneH); ctx.clip();
    drawImageCover(ctx, img, px, photoZoneTop, frameW, photoZoneH);
    ctx.restore();

    // Red frame number
    ctx.fillStyle = '#ff4444';
    ctx.font = `bold ${H * 0.06}px Inter, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`${i + 1}`, px + frameW - 8, photoZoneTop + H * 0.07);
  });

  // Cinematic label
  ctx.fillStyle = '#ff4444';
  ctx.font = `bold ${H * 0.1}px 'Special Elite', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('● PHOTO BOOTH', W / 2, H * 0.16);
};

// ─── Magazine Cover ───────────────────────────────────────
export const renderMagazine: RenderFn = (ctx, photos, W, H) => {
  // Dark purple bg
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#120822');
  grad.addColorStop(1, '#1e0a38');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const marg = W * 0.04;
  const heroH = H * 0.52;
  const heroY = H * 0.13;

  // Hero photo
  ctx.save();
  ctx.shadowColor = 'rgba(179,106,255,0.4)';
  ctx.shadowBlur = 40;
  ctx.beginPath();
  ctx.roundRect(marg, heroY, W - marg * 2, heroH, 8);
  ctx.clip();
  drawImageCover(ctx, photos[0], marg, heroY, W - marg * 2, heroH);
  ctx.restore();

  // Gradient overlay on hero
  const heroGrad = ctx.createLinearGradient(marg, heroY, marg, heroY + heroH);
  heroGrad.addColorStop(0.6, 'transparent');
  heroGrad.addColorStop(1, 'rgba(18,8,34,0.8)');
  ctx.fillStyle = heroGrad;
  ctx.beginPath(); ctx.roundRect(marg, heroY, W - marg * 2, heroH, 8); ctx.fill();

  // Masthead
  const magGrad = ctx.createLinearGradient(0, 0, W, 0);
  magGrad.addColorStop(0, '#b36aff');
  magGrad.addColorStop(1, '#ff6ab3');
  ctx.fillStyle = magGrad;
  ctx.font = `900 ${W * 0.13}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('BOOTH', W / 2, H * 0.1);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `300 ${W * 0.04}px Inter, sans-serif`;
  ctx.letterSpacing = '0.3em';
  ctx.fillText('MAGAZINE', W / 2, H * 0.125);

  // Hero caption
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${W * 0.06}px Inter, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('PICTURE', marg + 10, heroY + heroH - W * 0.065);
  const captGrad = ctx.createLinearGradient(marg, 0, W, 0);
  captGrad.addColorStop(0, '#b36aff');
  captGrad.addColorStop(1, '#ff6ab3');
  ctx.fillStyle = captGrad;
  ctx.fillText('PERFECT', marg + 10, heroY + heroH - W * 0.01);

  // Two thumbnails
  const thumbW = (W - marg * 3) / 2;
  const thumbH = H - heroY - heroH - marg * 2.5;
  const thumbY = heroY + heroH + marg;

  [photos[1], photos[2]].forEach((img, i) => {
    const tx = marg + i * (thumbW + marg);
    ctx.save();
    ctx.beginPath(); ctx.roundRect(tx, thumbY, thumbW, thumbH, 6); ctx.clip();
    drawImageCover(ctx, img, tx, thumbY, thumbW, thumbH);
    ctx.restore();

    const tbGrad = ctx.createLinearGradient(tx, thumbY, tx + thumbW, thumbY);
    tbGrad.addColorStop(0, '#b36aff');
    tbGrad.addColorStop(1, '#ff6ab3');
    ctx.strokeStyle = tbGrad;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(tx, thumbY, thumbW, thumbH, 6); ctx.stroke();
  });
};

// ─── Scrapbook ────────────────────────────────────────────
export const renderScrapbook: RenderFn = (ctx, photos, W, H) => {
  // Paper background
  ctx.fillStyle = '#f0e6d0';
  ctx.fillRect(0, 0, W, H);

  // Linen texture
  for (let i = 0; i < H; i += 3) {
    ctx.strokeStyle = `rgba(180,150,100,${0.05 + (i % 6 === 0 ? 0.05 : 0)})`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
  }

  const pW = W * 0.55;
  const pHPhoto = pW * 0.72;
  const border = pW * 0.04;

  const configs = [
    { x: W * 0.06, y: H * 0.04,  rot: -8, tape: '#ffe9a0' },
    { x: W * 0.25, y: H * 0.32,  rot: 5,  tape: '#a0e0ff' },
    { x: W * 0.12, y: H * 0.57,  rot: -3, tape: '#ffb3c1' },
  ];

  configs.forEach(({ x, y, rot, tape }, i) => {
    const img = photos[i];
    ctx.save();
    ctx.translate(x + pW / 2, y + pHPhoto / 2 + border);
    ctx.rotate((rot * Math.PI) / 180);

    // Shadow
    ctx.shadowColor = 'rgba(80,50,10,0.35)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;

    // White photo card
    ctx.fillStyle = '#fff';
    ctx.fillRect(-pW / 2, -pHPhoto / 2 - border, pW, pHPhoto + border * 3.5);
    ctx.shadowColor = 'transparent';

    // Photo
    ctx.save();
    ctx.beginPath(); ctx.rect(-pW / 2 + border, -pHPhoto / 2, pW - border * 2, pHPhoto); ctx.clip();
    drawImageCover(ctx, img, -pW / 2 + border, -pHPhoto / 2, pW - border * 2, pHPhoto);
    ctx.restore();

    // Tape strip
    ctx.fillStyle = `${tape}bb`;
    ctx.save();
    ctx.rotate(-0.05);
    ctx.fillRect(-pW * 0.15, -pHPhoto / 2 - border * 1.4, pW * 0.3, border * 1.2);
    ctx.restore();

    ctx.restore();
  });
};
