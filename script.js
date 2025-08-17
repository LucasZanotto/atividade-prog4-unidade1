const visitasEl = document.getElementById('visitas');
const visitas = Number(localStorage.getItem('visitas') || 0) + 1;
localStorage.setItem('visitas', visitas);
visitasEl.innerText = visitas;

const nomeInput = document.getElementById('nomeInput');
const btnSaudacao = document.getElementById('btnSaudacao');
const nomeTopo = document.getElementById('nomeTopo');

btnSaudacao.addEventListener('click', function(){
  const nome = nomeInput.value.trim();
  if(nome){
    nomeTopo.innerText = nome;
    alert('Olá, ' + nome + '! Obrigado por visitar meu currículo.');
  } else {
    alert('Por favor, digite seu nome.');
  }
});

const btnToggle = document.getElementById('btnToggleExp');
const secExp = document.getElementById('experiencia');
btnToggle.addEventListener('click', function(){
  const hidden = secExp.style.display === 'none';
  secExp.style.display = hidden ? '' : 'none';
});

const form = document.getElementById('formContato');
form.addEventListener('submit', function(e){
  e.preventDefault();
  const email = document.getElementById('email').value;
  alert('Obrigado! Iremos entrar em contato: ' + email);
  form.reset();
});

window.addEventListener('load', function(){
  const c = document.getElementById('meuCanvas');
  if(c && c.getContext){
    const ctx = c.getContext('2d');
    // fundo
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,c.width,c.height);
    // círculo decorativo
    ctx.beginPath();
    ctx.arc(60,60,40,0,Math.PI*2);
    ctx.fillStyle = '#2b7a78';
    ctx.fill();
    // texto
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.fillText('Skills', 40, 66);
  }
});

const btnBg = document.getElementById('btnBg');

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    btnBg.innerText = 'Light mode';         
    btnBg.setAttribute('aria-pressed', 'true');
  } else {
    document.documentElement.removeAttribute('data-theme');
    btnBg.innerText = 'Dark mode';
    btnBg.setAttribute('aria-pressed', 'false');
  }
  localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

// evento do botão
btnBg.addEventListener('click', () => {
  const currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
  setTheme(currentlyDark ? 'light' : 'dark');
});

(function(){
  const form = document.getElementById('formContato');
  if (!form) return;

  const submitBtn = document.getElementById('submitContact');
  const spinner = document.getElementById('formSpinner');
  const msgEl = document.getElementById('formMessage');

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const formData = new FormData(form);
    const email = formData.get('Email') || '';
    const nome = formData.get('Nome') || '';
    const mensagem = formData.get('Mensagem') || '';
    if (!email || !nome || !mensagem) {
      msgEl.textContent = 'Por favor, preencha os campos obrigatórios (Nome, E-mail e Mensagem).';
      return;
    }
    submitBtn.disabled = true;
    spinner.hidden = false;
    msgEl.textContent = '';

    try {
      const response = await fetch('https://formspree.io/f/xzbqwjwd', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        // sucesso
        msgEl.style.color = '';
        msgEl.textContent = 'Obrigado! Sua mensagem foi enviada com sucesso.';
        // limpa campos
        form.reset();
        submitBtn.blur();
      } else {
        const data = await response.json().catch(()=>({}));
        const errorMsg = (data && data.error) ? data.error : 'Ocorreu um erro ao enviar. Tente novamente mais tarde.';
        msgEl.textContent = errorMsg;
      }
    } catch (err) {
      msgEl.textContent = 'Erro de rede: não foi possível enviar a mensagem.';
      console.error('Contact form error', err);
    } finally {
      submitBtn.disabled = false;
      spinner.hidden = true;
    }
  });
})();
