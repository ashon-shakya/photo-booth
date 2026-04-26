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
  const pad = W * 0.08;
  const gap = W * 0.05;
  const photoH = (H - pad * 2.5 - gap * 2) / 3;
  const photoW = W - pad * 2;

  // Deep black background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  // Red edge accent
  ctx.strokeStyle = 'rgba(255,45,45,0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, W - 10, H - 10);

  // Sprocket holes
  const holeR = 5;
  const holeSpacing = 24;
  ctx.fillStyle = '#1a1a1a';
  for (let y = pad; y < H - pad; y += holeSpacing) {
    ctx.beginPath(); ctx.arc(11, y, holeR, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W - 11, y, holeR, 0, Math.PI * 2); ctx.fill();
  }

  photos.forEach((img, i) => {
    const py = pad * 0.8 + i * (photoH + gap);
    ctx.save();
    // White frame
    ctx.fillStyle = '#fff';
    ctx.fillRect(pad - 3, py - 3, photoW + 6, photoH + 6);
    ctx.beginPath();
    ctx.rect(pad, py, photoW, photoH);
    ctx.clip();
    drawImageCover(ctx, img, pad, py, photoW, photoH);
    ctx.restore();
  });

  // Brand text at bottom
  ctx.fillStyle = '#ff2d2d';
  ctx.font = `bold ${W * 0.085}px 'Special Elite', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('PHOTO BOOTH', W / 2, H - pad * 0.35);
};

// ─── Newspaper ────────────────────────────────────────────
// "The Society" style — goofy breaking news broadsheet
export const renderNewspaper: RenderFn = (ctx, photos, W, H) => {
  // Off-white newsprint background
  ctx.fillStyle = '#f2edd8';
  ctx.fillRect(0, 0, W, H);

  // Subtle newsprint grain
  ctx.strokeStyle = 'rgba(139,119,80,0.06)';
  ctx.lineWidth = 1;
  for (let y = 0; y < H; y += 4) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  const marg = W * 0.055;

  // ── MASTHEAD ──────────────────────────────────────────────
  // Top thick rule
  ctx.fillStyle = '#111';
  ctx.fillRect(marg, marg, W - marg * 2, W * 0.012);

  // Newspaper name
  ctx.fillStyle = '#111';
  ctx.font = `900 ${W * 0.155}px 'Playfair Display', serif`;
  ctx.textAlign = 'center';
  ctx.fillText('THE SOCIETY', W / 2, marg + W * 0.175);

  // Thin rule below masthead
  ctx.fillStyle = '#111';
  ctx.fillRect(marg, marg + W * 0.19, W - marg * 2, W * 0.004);
  ctx.fillRect(marg, marg + W * 0.197, W - marg * 2, W * 0.002);

  // Sub-info line
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const vol = `VOL. ${today.getFullYear() - 1999}, NO.${today.getMonth() * 30 + today.getDate()}`;
  ctx.font = `500 ${W * 0.028}px 'Special Elite', monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(vol, marg, marg + W * 0.226);
  ctx.textAlign = 'center';
  ctx.fillText('★  THESOCIETYNEWS.COM  ★', W / 2, marg + W * 0.226);
  ctx.textAlign = 'right';
  ctx.fillText(dateStr, W - marg, marg + W * 0.226);

  // Medium rule
  ctx.fillStyle = '#111';
  ctx.fillRect(marg, marg + W * 0.24, W - marg * 2, W * 0.003);

  // ── HEADLINE ─────────────────────────────────────────────
  ctx.fillStyle = '#111';
  ctx.font = `900 ${W * 0.072}px 'Playfair Display', serif`;
  ctx.textAlign = 'center';
  ctx.fillText('BREAKING NEWS', W / 2, marg + W * 0.305);

  // Thin rule
  ctx.fillRect(marg, marg + W * 0.315, W - marg * 2, W * 0.002);

  // ── TWO-COLUMN LAYOUT ────────────────────────────────────
  const colTop = marg + W * 0.335;
  const colH = H - colTop - marg * 1.2;
  const colGap = W * 0.04;
  const leftW = W * 0.42;
  const rightW = W - marg * 2 - leftW - colGap;
  const leftX = marg;
  const rightX = marg + leftW + colGap;

  // ── LEFT COLUMN: text + quote ──
  // Sub-headline
  ctx.fillStyle = '#111';
  ctx.font = `bold ${W * 0.038}px 'Playfair Display', serif`;
  ctx.textAlign = 'left';
  const subHead = 'LOCAL LEGENDS SPOTTED';
  ctx.fillText(subHead, leftX, colTop + W * 0.04);
  ctx.fillText('IN WILD PHOTO FRENZY', leftX, colTop + W * 0.082);

  // Thin rule under sub-headline
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(leftX, colTop + W * 0.095); ctx.lineTo(leftX + leftW, colTop + W * 0.095); ctx.stroke();

  // Body copy — goofy news story
  const bodyLines = [
    'Sources confirm that a group of undeniably',
    'photogenic individuals commandeered a high-tech',
    'photo booth unit and proceeded to strike poses',
    'described by witnesses as "iconic," "legendary,"',
    'and "frankly, a bit too much."',
    '',
    'The suspects reportedly insisted on taking three',
    'separate shots, each more dramatic than the last.',
    'Bystanders applauded. One onlooker fainted.',
    '',
    'Authorities have ruled the incident "absolutely',
    'worth it" and have issued no citations, though',
    'several selfie requests are still pending review.',
  ];
  ctx.font = `${W * 0.027}px Georgia, serif`;
  ctx.fillStyle = '#222';
  let textY = colTop + W * 0.115;
  for (const line of bodyLines) {
    ctx.fillText(line, leftX, textY);
    textY += W * 0.036;
  }

  // Pull quote box
  const quoteBoxTop = textY + W * 0.02;
  const quoteBoxH = W * 0.14;
  ctx.fillStyle = '#111';
  ctx.fillRect(leftX, quoteBoxTop, leftW, quoteBoxH);
  ctx.fillStyle = '#f2edd8';
  ctx.font = `italic bold ${W * 0.033}px 'Playfair Display', serif`;
  ctx.textAlign = 'center';
  ctx.fillText('"Truly the most important', leftX + leftW / 2, quoteBoxTop + quoteBoxH * 0.35);
  ctx.fillText('photos ever taken."', leftX + leftW / 2, quoteBoxTop + quoteBoxH * 0.65);

  // Column divider
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(rightX - colGap / 2, colTop);
  ctx.lineTo(rightX - colGap / 2, colTop + colH);
  ctx.stroke();

  // ── RIGHT COLUMN: photos ──
  const photoGap = W * 0.03;
  const photoH = (colH - photoGap * 2) / 3;

  photos.forEach((img, i) => {
    const py = colTop + i * (photoH + photoGap);

    // Photo border
    ctx.save();
    ctx.fillStyle = '#ddd';
    ctx.fillRect(rightX - 2, py - 2, rightW + 4, photoH + 4);
    ctx.beginPath();
    ctx.rect(rightX, py, rightW, photoH);
    ctx.clip();
    drawImageCover(ctx, img, rightX, py, rightW, photoH);
    ctx.restore();

    // Caption
    ctx.fillStyle = '#444';
    ctx.font = `italic ${W * 0.024}px 'Playfair Display', serif`;
    ctx.textAlign = 'center';
    const captions = ['Moment of pure brilliance.', 'The crowd goes wild.', 'History is made.'];
    ctx.fillText(captions[i], rightX + rightW / 2, py + photoH + W * 0.025);
  });

  // ── FOOTER ────────────────────────────────────────────────
  ctx.fillStyle = '#111';
  ctx.fillRect(marg, H - marg - W * 0.012, W - marg * 2, W * 0.003);
  ctx.font = `${W * 0.022}px 'Special Elite', monospace`;
  ctx.fillStyle = '#555';
  ctx.textAlign = 'center';
  ctx.fillText('© THE SOCIETY NEWS  •  "IF IT HAPPENED IN THE BOOTH, IT HAPPENED."', W / 2, H - marg - W * 0.002);
};

// ─── Columns ──────────────────────────────────────────────
export const renderColumns: RenderFn = (ctx, photos, W, H) => {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0a1628');
  grad.addColorStop(1, '#0d2244');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const pad = H * 0.07;
  const gap = H * 0.035;
  const colW = (W - pad * 2 - gap * 2) / 3;
  const colH = H - pad * 2;

  // Top accent bar
  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, '#ff2d2d');
  barGrad.addColorStop(1, '#ff7a2d');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, W, 5);

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
    badgeGrad.addColorStop(0, '#ff2d2d');
    badgeGrad.addColorStop(1, '#ff7a2d');
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.roundRect(px + 12, py + 12, 34, 34, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${colH * 0.045}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${i + 1}`, px + 29, py + 33);
  });

  // Bottom label
  const textGrad = ctx.createLinearGradient(0, 0, W, 0);
  textGrad.addColorStop(0, '#ff2d2d');
  textGrad.addColorStop(1, '#ff7a2d');
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

  const pW = W * 0.36;
  const pH = pW * 1.22;
  const imgH = pW * 0.84;

  const positions = [
    { x: W * 0.04, y: H * 0.04,  rot: -7 },
    { x: W * 0.33, y: H * 0.29,  rot: 4.5 },
    { x: W * 0.59, y: H * 0.05,  rot: -2.5 },
  ];

  photos.forEach((img, i) => {
    const { x, y, rot } = positions[i];
    ctx.save();
    ctx.translate(x + pW / 2, y + pH / 2);
    ctx.rotate((rot * Math.PI) / 180);

    // Drop shadow
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 22;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 9;

    // White polaroid card
    ctx.fillStyle = '#faf9f5';
    ctx.fillRect(-pW / 2, -pH / 2, pW, pH);
    ctx.shadowColor = 'transparent';

    // Photo area
    ctx.save();
    ctx.beginPath();
    ctx.rect(-pW / 2 + pW * 0.055, -pH / 2 + pW * 0.055, pW * 0.89, imgH);
    ctx.clip();
    drawImageCover(ctx, img, -pW / 2 + pW * 0.055, -pH / 2 + pW * 0.055, pW * 0.89, imgH);
    ctx.restore();

    // Tape strip
    ctx.fillStyle = 'rgba(255,255,180,0.6)';
    ctx.fillRect(-pW * 0.13, -pH / 2 - 9, pW * 0.26, 15);

    ctx.restore();
  });
};

// ─── Film Reel ────────────────────────────────────────────
export const renderFilmReel: RenderFn = (ctx, photos, W, H) => {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  const holeW = H * 0.12;
  const holeH = H * 0.08;
  const holeGap = H * 0.06;
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
  const photoZoneTop = H * 0.23;
  const photoZoneH = H * 0.54;
  const frameGap = W * 0.025;
  const frameW = (W - frameGap * 4) / 3;

  photos.forEach((img, i) => {
    const px = frameGap + i * (frameW + frameGap);

    ctx.save();
    ctx.shadowColor = 'rgba(255,45,45,0.3)';
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#111';
    ctx.fillRect(px, photoZoneTop, frameW, photoZoneH);
    ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.rect(px, photoZoneTop, frameW, photoZoneH); ctx.clip();
    drawImageCover(ctx, img, px, photoZoneTop, frameW, photoZoneH);
    ctx.restore();

    // Red frame number
    ctx.fillStyle = '#ff2d2d';
    ctx.font = `bold ${H * 0.06}px Inter, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(`${i + 1}`, px + frameW - 10, photoZoneTop + H * 0.08);
  });

  // Cinematic label
  ctx.fillStyle = '#ff2d2d';
  ctx.font = `bold ${H * 0.1}px 'Special Elite', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('● PHOTO BOOTH', W / 2, H * 0.16);
};

// ─── Magazine Cover ───────────────────────────────────────
export const renderMagazine: RenderFn = (ctx, photos, W, H) => {
  // Dark bg
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#120202');
  grad.addColorStop(1, '#1e0404');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const marg = W * 0.045;
  const heroH = H * 0.52;
  const heroY = H * 0.14;

  // Hero photo
  ctx.save();
  ctx.shadowColor = 'rgba(255,45,45,0.4)';
  ctx.shadowBlur = 50;
  ctx.beginPath();
  ctx.roundRect(marg, heroY, W - marg * 2, heroH, 8);
  ctx.clip();
  drawImageCover(ctx, photos[0], marg, heroY, W - marg * 2, heroH);
  ctx.restore();

  // Gradient overlay on hero
  const heroGrad = ctx.createLinearGradient(marg, heroY, marg, heroY + heroH);
  heroGrad.addColorStop(0.6, 'transparent');
  heroGrad.addColorStop(1, 'rgba(18,2,2,0.85)');
  ctx.fillStyle = heroGrad;
  ctx.beginPath(); ctx.roundRect(marg, heroY, W - marg * 2, heroH, 8); ctx.fill();

  // Masthead
  const magGrad = ctx.createLinearGradient(0, 0, W, 0);
  magGrad.addColorStop(0, '#ff2d2d');
  magGrad.addColorStop(1, '#ff7a2d');
  ctx.fillStyle = magGrad;
  ctx.font = `900 ${W * 0.14}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('BOOTH', W / 2, H * 0.105);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `300 ${W * 0.04}px Inter, sans-serif`;
  ctx.fillText('MAGAZINE', W / 2, H * 0.132);

  // Hero caption
  ctx.fillStyle = '#fff';
  ctx.font = `700 ${W * 0.065}px Inter, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('PICTURE', marg + 12, heroY + heroH - W * 0.07);
  const captGrad = ctx.createLinearGradient(marg, 0, W, 0);
  captGrad.addColorStop(0, '#ff2d2d');
  captGrad.addColorStop(1, '#ff7a2d');
  ctx.fillStyle = captGrad;
  ctx.fillText('PERFECT', marg + 12, heroY + heroH - W * 0.01);

  // Two thumbnails
  const thumbW = (W - marg * 3) / 2;
  const thumbH = H - heroY - heroH - marg * 3;
  const thumbY = heroY + heroH + marg * 1.4;

  [photos[1], photos[2]].forEach((img, i) => {
    const tx = marg + i * (thumbW + marg);
    ctx.save();
    ctx.beginPath(); ctx.roundRect(tx, thumbY, thumbW, thumbH, 6); ctx.clip();
    drawImageCover(ctx, img, tx, thumbY, thumbW, thumbH);
    ctx.restore();

    const tbGrad = ctx.createLinearGradient(tx, thumbY, tx + thumbW, thumbY);
    tbGrad.addColorStop(0, '#ff2d2d');
    tbGrad.addColorStop(1, '#ff7a2d');
    ctx.strokeStyle = tbGrad;
    ctx.lineWidth = 2.5;
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

  const pW = W * 0.56;
  const pHPhoto = pW * 0.74;
  const border = pW * 0.045;

  const configs = [
    { x: W * 0.07, y: H * 0.04,  rot: -8,  tape: '#ffe9a0' },
    { x: W * 0.27, y: H * 0.33,  rot: 5.5, tape: '#a0e0ff' },
    { x: W * 0.13, y: H * 0.58,  rot: -3,  tape: '#ffb3c1' },
  ];

  configs.forEach(({ x, y, rot, tape }, i) => {
    const img = photos[i];
    ctx.save();
    ctx.translate(x + pW / 2, y + pHPhoto / 2 + border);
    ctx.rotate((rot * Math.PI) / 180);

    // Shadow
    ctx.shadowColor = 'rgba(80,50,10,0.38)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 6;

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
    ctx.fillRect(-pW * 0.16, -pHPhoto / 2 - border * 1.5, pW * 0.32, border * 1.3);
    ctx.restore();

    ctx.restore();
  });
};
