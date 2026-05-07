const musica = document.getElementById('musica');

function toggleMusica() {
    if (musica.paused) {
        if (musica.currentTime === 0) musica.currentTime = 60;
        musica.play();
        document.getElementById('btnMusica').innerText = "🎵 Som: ON";
    } else {
        musica.pause();
        document.getElementById('btnMusica').innerText = "🎵 Som: OFF";
    }
}

function proximaPagina() {
    document.getElementById('pagina1').style.display = 'none';
    document.getElementById('pagina2').style.display = 'block';
    startParticles();
    habilitarArrastar();
}

function habilitarArrastar() {
    const fotos = document.querySelectorAll('.foto-mural');
    fotos.forEach(foto => {
        let isDragging = false;
        let x, y;
        const start = (e) => {
            isDragging = true;
            const ev = e.touches ? e.touches[0] : e;
            x = ev.clientX - foto.offsetLeft;
            y = ev.clientY - foto.offsetTop;
            foto.style.zIndex = 1000;
        };
        const move = (e) => {
            if (!isDragging) return;
            const ev = e.touches ? e.touches[0] : e;
            foto.style.left = (ev.clientX - x) + 'px';
            foto.style.top = (ev.clientY - y) + 'px';
        };
        foto.addEventListener('mousedown', start);
        foto.addEventListener('touchstart', start);
        document.addEventListener('mousemove', move);
        document.addEventListener('touchmove', move);
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('touchend', () => isDragging = false);
    });
}

function startParticles() {
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const upd = (e) => {
        const ev = e.touches ? e.touches[0] : e;
        mouse.x = ev.clientX; mouse.y = ev.clientY;
    };
    window.addEventListener('mousemove', upd);
    window.addEventListener('touchmove', upd);
    
    // Ajeitando as Partículas: Mais densidade e cor vibrante
    // Aumentei o número de partículas e diminuí o espaçamento
    const heartSize = window.innerWidth < 600 ? 10 : 18;
    for(let i=0; i<1500; i++) { // Mais partículas (1500 em vez de 600)
        const t = Math.random()*Math.PI*2;
        const tx = heartSize * 16 * Math.pow(Math.sin(t), 3);
        const ty = -heartSize * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        // Cor vibrante para o coração
        particles.push(new P(tx + canvas.width/2, ty + canvas.height/2, '#ff1744')); // Vermelho vibrante
    }

    function P(tx,ty,c) {
        this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height;
        this.tx = tx; this.ty = ty; this.c = c; this.vx=0; this.vy=0;
        this.u = function() {
            this.vx += (this.tx - this.x)*0.02; // Movimento mais rápido
            this.vy += (this.ty - this.y)*0.02;
            let d = Math.sqrt((mouse.x-this.x)**2 + (mouse.y-this.y)**2);
            if(d<70) { // Maior área de interação
                this.vx -= (mouse.x-this.x)*0.25; this.vy -= (mouse.y-this.y)*0.25; 
            }
            this.vx*=0.82; this.vy*=0.82; // Menor resistência para o rastro
            this.x+=this.vx; this.y+=this.vy;
        };
        this.d = function() { 
            ctx.fillStyle=this.c; ctx.beginPath(); 
            // Partículas ligeiramente maiores e com transparência para "ajeitar"
            ctx.arc(this.x,this.y, 1.4, 0,Math.PI*2); ctx.fill(); 
        };
    }

    function anim() {
        ctx.fillStyle='rgba(0,0,0,0.1)'; // Rastro mais leve e suave
        ctx.fillRect(0,0,canvas.width,canvas.height);
        particles.forEach(p=>{p.u(); p.d();});
        requestAnimationFrame(anim);
    }
    anim();
}