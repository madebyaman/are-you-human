import './style.css';

/**
 * Generate a random unicode between 65 - 90 OR 97 - 122
 * @returns Random unicode
 */
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

/**
 * Returns a random captcha
 * @param n: Number of digit to return captcha
 * @returns Random string
 */
function randomCaptcha(n: number): string {
  let text: string[] = [];
  for (let i = 0; i < n; i++) {
    const unicode = randomUnicode();
    text.push(String.fromCharCode(unicode));
  }
  return text.join('');
}

let sixDigitCaptcha = randomCaptcha(6);

/**
 * Function to submit signup form
 */
function onSubmitForm(e: SubmitEvent) {
  e.preventDefault();
  if (!e.currentTarget || !(e.currentTarget instanceof HTMLFormElement)) return;
  const { email, firstName, lastName, captcha, password } = e.currentTarget
    .elements as any;
  // Check captcha
  if (!captcha) return;
  const captchaInvalidMessage = document.querySelector(
    '.captcha-invalid-message'
  );
  if (captcha.value !== sixDigitCaptcha) {
    captchaInvalidMessage?.classList.remove('hide');
    captcha.value = '';
    sixDigitCaptcha = randomCaptcha(6);
    draw(sixDigitCaptcha);
    return;
  }
  if (!email || !firstName || !lastName || !password) return;
  captchaInvalidMessage?.classList.add('hide');
  showSuccess({
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    password: password.value,
    el: e.currentTarget,
  });
  return;
}

// Change captcha text when color scheme changes
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
    draw(sixDigitCaptcha);
  });

/**
 * Shows a success message in DOM when form submitted successfully
 */
function showSuccess(props: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  el: HTMLFormElement;
}) {
  const { el, ...rest } = props;
  if (el && el instanceof HTMLFormElement) {
    el.removeEventListener('submit', onSubmitForm);
    el.remove();
  }
  const successMessage = document.querySelector('.success-message');
  if (!successMessage) return;
  const pre = successMessage.querySelector('pre');
  if (!pre) return;
  pre.innerHTML = JSON.stringify(rest, null, 2);
  successMessage.classList.remove('hide');
}

/**
 * Draws a string in the canvas
 */
function draw(string: string) {
  const captcha = document.getElementById('captcha');
  if (captcha && captcha instanceof HTMLCanvasElement) {
    const ctx = captcha.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, captcha.width, captcha.height);
    const x = captcha.width / 2;
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = colorScheme === 'light' ? '#22222' : '#ffffff';
    ctx.fillText(string, x, 45);
  }
}

/**
 * Add submit event listener to form
 */
function addEventListenerToForm() {
  const form = document.querySelector('.signup-form form');
  if (form && form instanceof HTMLFormElement) {
    form.addEventListener('submit', onSubmitForm);
  }
}

draw(sixDigitCaptcha);
addEventListenerToForm();
