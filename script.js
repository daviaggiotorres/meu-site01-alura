// ===== NAV =====
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== HERO LIGHTS ANIMATION =====
function animateHeroLights() {
  const lights = document.querySelectorAll('#heroLights .light');
  let i = 0;
  const interval = setInterval(() => {
    if (i < lights.length) {
      lights[i].classList.add('on');
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        lights.forEach(l => l.classList.remove('on'));
        setTimeout(animateHeroLights, 2000);
      }, 800);
    }
  }, 400);
}
animateHeroLights();

// ===== PARTICLES =====
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (8 + Math.random() * 12) + 's';
  p.style.animationDelay = Math.random() * 10 + 's';
  particlesContainer.appendChild(p);
}

// ===== NEWS CARDS ANIMATION =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.news-card').forEach(card => observer.observe(card));

// ===== MODALS =====
function openGame(type) {
  document.getElementById(`modal-${type}`).classList.add('active');
  if (type === 'quiz') startQuiz();
  if (type === 'tyres') newTyreScenario();
}

function closeModal(type) {
  document.getElementById(`modal-${type}`).classList.remove('active');
  if (type === 'lights') resetLightsGame();
}

// Close on outside click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
});

// ===== LIGHTS GAME =====
let lightsTimeout, startTime, canClick = false;

function startLightsGame() {
  const lights = document.querySelectorAll('#gameLights .game-light');
  const result = document.getElementById('reaction-result');
  const btn = document.getElementById('startLightsBtn');
  
  btn.style.display = 'none';
  result.textContent = 'Preparar...';
  result.style.color = '#aaa';
  lights.forEach(l => {
    l.className = 'game-light';
  });
  canClick = false;

  let count = 0;
  const lightInterval = setInterval(() => {
    if (count < 5) {
      lights[count].classList.add('red');
      count++;
    } else {
      clearInterval(lightInterval);
      // Random delay before lights out (1-3s)
      const delay = 1000 + Math.random() * 2000;
      lightsTimeout = setTimeout(() => {
        lights.forEach(l => {
          l.classList.remove('red');
          l.classList.add('green');
        });
        startTime = performance.now();
        canClick = true;
        result.textContent = 'JÁ! Clique agora!';
        result.style.color = '#00c853';
      }, delay);
    }
  }, 700);

  // Click handler
  const modal = document.getElementById('modal-lights');
  const clickHandler = (e) => {
    if (!canClick) {
      if (e.target.closest('.game-light') || e.target.id === 'reaction-result') {
        clearTimeout(lightsTimeout);
        clearInterval(lightInterval);
        result.textContent = 'LARGADA FALSA! 😱 Tente de novo.';
        result.style.color = 'var(--red)';
        btn.style.display = 'inline-block';
        canClick = false;
        modal.removeEventListener('click', clickHandler);
      }
      return;
    }

    const reaction = Math.round(performance.now() - startTime);
    canClick = false;
    modal.removeEventListener('click', clickHandler);

    let msg = '';
    if (reaction < 180) msg = `🔥 ${reaction}ms — Reflexos de campeão!`;
    else if (reaction < 250) msg = `⚡ ${reaction}ms — Excelente!`;
    else if (reaction < 350) msg = `👍 ${reaction}ms — Bom tempo!`;
    else msg = `😅 ${reaction}ms — Precisa treinar mais...`;

    result.textContent = msg;
    result.style.color = reaction < 250 ? '#00c853' : '#f5a623';
    btn.style.display = 'inline-block';
    btn.textContent = 'TENTAR DE NOVO';
  };

  setTimeout(() => modal.addEventListener('click', clickHandler), 100);
}

function resetLightsGame() {
  clearTimeout(lightsTimeout);
  canClick = false;
  document.getElementById('startLightsBtn').style.display = 'inline-block';
  document.getElementById('startLightsBtn').textContent = 'INICIAR';
  document.getElementById('reaction-result').textContent = '';
  document.querySelectorAll('#gameLights .game-light').forEach(l => l.className = 'game-light');
}

// ===== QUIZ =====
const quizData = [
  {
    q: "Quem lidera o campeonato de pilotos de 2026 no intervalo de verão?",
    options: ["Lewis Hamilton", "Kimi Antonelli", "Max Verstappen", "Lando Norris"],
    correct: 1
  },
  {
    q: "Qual equipe lidera o campeonato de construtores em 2026?",
    options: ["Ferrari", "McLaren", "Mercedes", "Red Bull"],
    correct: 2
  },
  {
    q: "Quem venceu o GP da Hungria 2026?",
    options: ["Max Verstappen", "George Russell", "Lando Norris", "Charles Leclerc"],
    correct: 2
  },
  {
    q: "Qual é o novo team principal da Cadillac?",
    options: ["Graeme Lowdon", "Marcin Budkowski", "Christian Horner", "Toto Wolff"],
    correct: 1
  },
  {
    q: "Quem é o companheiro de Max Verstappen na Red Bull em 2026?",
    options: ["Yuki Tsunoda", "Sergio Pérez", "Isack Hadjar", "Liam Lawson"],
    correct: 2
  }
];

let currentQ = 0, score = 0;

function startQuiz() {
  currentQ = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const q = quizData[currentQ];
  document.getElementById('quizQuestion').textContent = `Pergunta ${currentQ + 1}/5: ${q.q}`;
  const optionsDiv = document.getElementById('quizOptions');
  optionsDiv.innerHTML = '';
  document.getElementById('quizScore').textContent = '';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    optionsDiv.appendChild(btn);
  });
}

function selectAnswer(index) {
  const q = quizData[currentQ];
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach((b, i) => {
    b.onclick = null;
    if (i === q.correct) b.classList.add('correct');
    else if (i === index) b.classList.add('wrong');
  });

  if (index === q.correct) score++;

  setTimeout(() => {
    currentQ++;
    if (currentQ < quizData.length) {
      showQuestion();
    } else {
      document.getElementById('quizQuestion').textContent = 'Quiz finalizado!';
      document.getElementById('quizOptions').innerHTML = '';
      document.getElementById('quizScore').innerHTML = `
        Você acertou <strong style="color:var(--red)">${score}/5</strong>!<br>
        ${score === 5 ? '🏆 Perfeito! Você é um verdadeiro fã!' : 
          score >= 3 ? '👏 Bom conhecimento da temporada!' : 
          '📚 Hora de acompanhar mais as corridas!'}
        <br><br>
        <button class="game-btn" onclick="startQuiz()">JOGAR DE NOVO</button>
      `;
    }
  }, 1200);
}

// ===== TYRE GAME =====
const scenarios = [
  {
    text: "Pista seca, 28°C, 50 voltas. Qual o melhor composto para a largada?",
    correct: "soft",
    explanation: "Soft é ideal para maximizar o ritmo logo na largada em condições secas."
  },
  {
    text: "Começou a chover leve. A pista está úmida mas ainda não encharcada. O que usar?",
    correct: "inter",
    explanation: "Intermediários (verde) são perfeitos para chuva leve / pista úmida."
  },
  {
    text: "Chuva forte, pista completamente molhada. Qual pneu?",
    correct: "wet",
    explanation: "Full Wets (azul) são obrigatórios em chuva pesada."
  },
  {
    text: "Pista seca, corrida longa (70 voltas), degradação alta. Melhor estratégia inicial?",
    correct: "hard",
    explanation: "Hard permite stint mais longo e menos paradas em corridas de alta degradação."
  },
  {
    text: "Qualifying. Você precisa de uma volta rápida pura. Qual composto?",
    correct: "soft",
    explanation: "Soft oferece o máximo grip para uma única volta rápida."
  },
  {
    text: "Pista seca, temperatura baixa (18°C), corrida média. Bom equilíbrio?",
    correct: "medium",
    explanation: "Medium oferece bom equilíbrio entre desempenho e durabilidade."
  }
];

function newTyreScenario() {
  const s = scenarios[Math.floor(Math.random() * scenarios.length)];
  document.getElementById('tyreScenario').textContent = s.text;
  document.getElementById('tyreResult').textContent = '';
  
  const choices = document.getElementById('tyreChoices');
  choices.innerHTML = `
    <div class="tyre soft" data-type="soft" onclick="chooseTyre('soft', '${s.correct}', '${s.explanation}')">SOFT<br>C3</div>
    <div class="tyre medium" data-type="medium" onclick="chooseTyre('medium', '${s.correct}', '${s.explanation}')">MEDIUM<br>C2</div>
    <div class="tyre hard" data-type="hard" onclick="chooseTyre('hard', '${s.correct}', '${s.explanation}')">HARD<br>C1</div>
    <div class="tyre inter" data-type="inter" onclick="chooseTyre('inter', '${s.correct}', '${s.explanation}')">INTER</div>
    <div class="tyre wet" data-type="wet" onclick="chooseTyre('wet', '${s.correct}', '${s.explanation}')">WET</div>
  `;
}

function chooseTyre(chosen, correct, explanation) {
  const result = document.getElementById('tyreResult');
  if (chosen === correct) {
    result.innerHTML = `✅ <strong style="color:#00c853">Escolha certa!</strong><br>${explanation}`;
  } else {
    result.innerHTML = `❌ <strong style="color:var(--red)">Não foi a melhor opção.</strong><br>${explanation}`;
  }
  // Disable further clicks
  document.querySelectorAll('.tyre').forEach(t => t.onclick = null);   
}