import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримуємо посилання на елементи форми
const form = document.querySelector('.form');

// Функція для створення промісу
function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

// Обробник сабміту форми
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Забороняємо перезавантаження сторінки

  // Отримуємо значення з форми
  const delay = Number(form.delay.value);
  const state = form.state.value;

  // Створюємо і обробляємо проміс
  createPromise(delay, state)
    .then((delay) => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });

  // Скидаємо форму після сабміту
  form.reset();
});
