export function generateCityCard(city) {
  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  const score = city.pulse_score;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'High Energy' : score >= 40 ? 'Moderate' : 'Low Energy';
  const bgColor = score >= 70 ? '#052e16' : score >= 40 ? '#1c1005' : '#1c0505';

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 900, 480);

  // Subtle grid pattern
  ctx.strokeStyle = color + '08';
  ctx.lineWidth = 1;
  for (let x = 0; x < 900; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 480);
    ctx.stroke();
  }
  for (let y = 0; y < 480; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(900, y);
    ctx.stroke();
  }

  // Left accent bar
  const barGrad = ctx.createLinearGradient(0, 0, 0, 480);
  barGrad.addColorStop(0, color);
  barGrad.addColorStop(1, color + '44');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, 5, 480);

  // Top branding
  ctx.fillStyle = color + 'aa';
  ctx.font = '500 16px Arial, sans-serif';
  ctx.fillText('🌆 CITY PULSE', 36, 44);

  // Divider line
  ctx.strokeStyle = color + '33';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, 58);
  ctx.lineTo(560, 58);
  ctx.stroke();

  // City name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Arial, sans-serif';
  ctx.fillText(city.city, 36, 148);

  // Score number — large
  ctx.fillStyle = color;
  ctx.font = 'bold 108px Arial, sans-serif';
  ctx.fillText(score.toString(), 36, 270);

  // /100 — positioned after score with proper gap
  const scoreWidth = ctx.measureText(score.toString()).width;
  ctx.fillStyle = color + '66';
  ctx.font = '300 36px Arial, sans-serif';
  ctx.fillText('/100', 36 + scoreWidth + 10, 260);

  // Label pill
  ctx.fillStyle = color + '25';
  ctx.beginPath();
  ctx.roundRect(36, 290, 140, 34, 17);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.font = 'bold 14px Arial, sans-serif';
  ctx.fillText(label.toUpperCase(), 52, 313);

  // Divider
  ctx.strokeStyle = color + '22';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, 350);
  ctx.lineTo(560, 350);
  ctx.stroke();

  // Weather row
  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 18px Arial, sans-serif';
  ctx.fillText(`${city.temperature}°C`, 36, 382);
  ctx.fillText(`${city.condition}`, 130, 382);
  ctx.fillText(`AQI ${city.aqi}`, 280, 382);

  // Summary
  if (city.summary) {
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 400 15px Arial, sans-serif';
    ctx.fillText(`"${city.summary}"`, 36, 440, 560);
  }

  // Right side — decorative circles
  ctx.beginPath();
  ctx.arc(760, 240, 160, 0, Math.PI * 2);
  ctx.fillStyle = color + '08';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(760, 240, 118, 0, Math.PI * 2);
  ctx.fillStyle = color + '12';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(760, 240, 78, 0, Math.PI * 2);
  ctx.fillStyle = color + '20';
  ctx.fill();

  // Score in circle
  ctx.fillStyle = color;
  ctx.font = 'bold 52px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(score.toString(), 760, 255);
  ctx.fillStyle = color + '88';
  ctx.font = '400 13px Arial, sans-serif';
  ctx.fillText('pulse score', 760, 278);
  ctx.textAlign = 'left';

  // Bottom watermark
  ctx.fillStyle = color + '44';
  ctx.font = '400 13px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('citypulse.vercel.app', 864, 464);
  ctx.textAlign = 'left';

  return canvas;
}

export function downloadCityCard(city) {
  const canvas = generateCityCard(city);
  const link = document.createElement('a');
  link.download = `${city.city}-pulse-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function copyCityCardToClipboard(city) {
  const canvas = generateCityCard(city);
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      const item = new ClipboardItem({ 'image/png': blob });
      navigator.clipboard.write([item])
        .then(resolve)
        .catch(reject);
    });
  });
}