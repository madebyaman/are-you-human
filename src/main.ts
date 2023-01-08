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

let randomCaptcha = randomSixDigitCaptcha();
function draw() {
  const captcha = document.getElementById('captcha');
  if (captcha && captcha instanceof HTMLCanvasElement) {
    const ctx = captcha.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, captcha.width, captcha.height);
    const x = captcha.width / 2;
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = colorScheme === 'light' ? '#22222' : '#ffffff';
    ctx.fillText(randomCaptcha, x, 45);
  }
}

let colorScheme: 'light' | 'dark' = 'light';
if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  colorScheme = 'dark';
}
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (event) => {
    colorScheme = event.matches ? 'dark' : 'light';
    draw();
  });

draw();

const form = document.querySelector('.signup-form form');
function onSubmitForm(e: SubmitEvent) {
  e.preventDefault();
  if (!form || !(form instanceof HTMLFormElement)) return;
  const { email, firstName, lastName, captcha, password } = form.elements;
  // Check captcha
  if (!captcha) return;
  const captchaInvalidMessage = document.querySelector(
    '.captcha-invalid-message'
  );
  if (captcha.value !== randomCaptcha) {
    captchaInvalidMessage?.classList.remove('hide');
    captcha.value = '';
    randomCaptcha = randomSixDigitCaptcha();
    draw();
    return;
  }
  if (!email || !firstName || !lastName || !password) return;
  captchaInvalidMessage?.classList.add('hide');
  showSuccess({
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    password: password.value,
  });
  return;
}
if (form && form instanceof HTMLFormElement) {
  form.addEventListener('submit', onSubmitForm);
}

function showSuccess(props) {
  if (form && form instanceof HTMLFormElement) {
    form.removeEventListener('submit', onSubmitForm);
    form.remove();
  }
  const successMessage = document.querySelector('.success-message');
  if (!successMessage) return;
  const pre = successMessage.querySelector('pre');
  if (!pre) return;
  pre.innerHTML = JSON.stringify(props, null, 2);
  successMessage.classList.remove('hide');
}
