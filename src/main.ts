import './style.css';

function randomUnicode(): number {
  const maxMinRange = [
    { min: 65, max: 90 },
    { min: 97, max: 122 },
  ];
  const { min, max } =
    maxMinRange[Math.floor(Math.random() * maxMinRange.length)];
  const difference = max - min;
  // generate random number
  let randomUnicode = Math.random();
  randomUnicode = Math.floor(randomUnicode * difference);
  randomUnicode = randomUnicode + min;
  return randomUnicode;
}

function randomSixDigitCaptcha(): string {
  let text: string[] = [];
  for (let i = 0; i < 6; i++) {
    const unicode = randomUnicode();
    text.push(String.fromCharCode(unicode));
  }
  return text.join('');
}

function draw() {
  const captcha = document.getElementById('captcha');
  if (captcha && captcha instanceof HTMLCanvasElement) {
    const ctx = captcha.getContext('2d');
    if (!ctx) return;
    ctx.font = '48px serif';
    const randomCaptcha = randomSixDigitCaptcha();
    ctx.fillText(randomCaptcha, 10, 40);
  }
}
draw();