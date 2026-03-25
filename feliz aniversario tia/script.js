const canvas = document.getElementById('confete');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('confeteBtn');
let confetes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function Confete() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.size = Math.random() * 12 + 8;
    this.color = `hsl(${Math.random()*360}, 80%, 60%)`;
    this.speed = Math.random() * 3 + 2;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.2;
}
Confete.prototype.update = function() {
    this.y += this.speed;
    this.angle += this.spin;
    this.x += Math.sin(this.angle) * 2;
};
Confete.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
    ctx.restore();
};

function soltarConfete() {
    for (let i = 0; i < 120; i++) {
        confetes.push(new Confete());
    }
}

function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetes.forEach((c, i) => {
        c.update();
        c.draw(ctx);
        if (c.y > canvas.height + 30) confetes.splice(i, 1);
    });
    requestAnimationFrame(animar);
}

btn.addEventListener('click', soltarConfete);
animar();
// Balões animados nos cantos
const balaoCores = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'];
let baloesLaterais = [];

function BalaoLateral(x) {
    this.x = x;
    this.y = canvas.height + Math.random() * 100;
    this.size = 60 + Math.random() * 30;
    this.color = balaoCores[Math.floor(Math.random() * balaoCores.length)];
    this.speed = 1 + Math.random() * 1.5;
}
BalaoLateral.prototype.update = function() {
    this.y -= this.speed;
    if (this.y < -this.size) {
        this.y = canvas.height + Math.random() * 100;
        this.size = 60 + Math.random() * 30;
        this.color = balaoCores[Math.floor(Math.random() * balaoCores.length)];
        this.speed = 1 + Math.random() * 1.5;
    }
};
BalaoLateral.prototype.draw = function(ctx) {
    ctx.save();
    // Balão com gradiente radial para efeito 3D
    let grad = ctx.createRadialGradient(
        this.x - this.size*0.15, this.y - this.size*0.2, this.size*0.1,
        this.x, this.y, this.size*0.5
    );
    grad.addColorStop(0, '#fff8');
    grad.addColorStop(0.2, '#fff4');
    grad.addColorStop(0.4, this.color);
    grad.addColorStop(1, '#0002');
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.size/2, this.size*0.7/2, 0, 0, 2*Math.PI);
    ctx.fillStyle = grad;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
    // Brilho extra
    ctx.beginPath();
    ctx.ellipse(this.x - this.size*0.15, this.y - this.size*0.18, this.size*0.13, this.size*0.09, 0, 0, 2*Math.PI);
    ctx.fillStyle = '#fff7';
    ctx.fill();
    // Nó do balão
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + this.size*0.35, this.size*0.09, this.size*0.06, 0, 0, 2*Math.PI);
    ctx.fillStyle = '#ccc';
    ctx.fill();
    // Cordinha
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.size*0.38);
    ctx.bezierCurveTo(
        this.x + 5, this.y + this.size*0.7 + 10,
        this.x - 5, this.y + this.size*0.7 + 20,
        this.x, this.y + this.size*0.7 + 30
    );
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
};

function criarBaloesLaterais() {
    baloesLaterais = [];
    let espacamento = canvas.width / 8;
    // 2 balões à esquerda, 2 à direita
    for (let i = 0; i < 2; i++) {
        baloesLaterais.push(new BalaoLateral(espacamento * (i+1)));
        baloesLaterais.push(new BalaoLateral(canvas.width - espacamento * (i+1)));
    }
}

criarBaloesLaterais();
window.addEventListener('resize', criarBaloesLaterais);

// Modificar a função animar para desenhar os balões laterais subindo
const animarOriginal = animar;
function animarCompleto() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Balões laterais
    baloesLaterais.forEach(b => {
        b.update();
        b.draw(ctx);
    });
    // Confetes
    confetes.forEach((c, i) => {
        c.update();
        c.draw(ctx);
        if (c.y > canvas.height + 30) confetes.splice(i, 1);
    });
    requestAnimationFrame(animarCompleto);
}

// Iniciar nova animação
animarCompleto();
