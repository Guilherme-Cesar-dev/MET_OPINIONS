// Dados do usuário — PERFIL
const user = JSON.parse(localStorage.getItem('user_perfil')) || { nome: 'Sem nome', descricao: '', foto: '' };

// Modal
const modal = document.getElementById('modal-edit');
const btnEdit = document.getElementById('btn-edit-perfil');
const closeBtn = document.querySelector('.modal-close');

btnEdit.onclick = function() {
    modal.style.display = 'block';
};

closeBtn.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
function atualizarVisualizacao() {
    document.getElementById('user-name').textContent = user.nome || 'Sem nome definido';
    document.getElementById('user-desc').textContent = user.descricao || '';
    if (user.foto) {
        document.getElementById('profile-pic').src = user.foto;
    } else {
        document.getElementById('profile-pic').src = 'https://i.imgur.com/kqClj3v.png'; // padrão
    }
}

atualizarVisualizacao();

// Editar perfil
document.getElementById('input-nome').value = user.nome || '';
document.getElementById('input-desc').value = user.descricao || '';
document.getElementById('input-foto').value = user.foto || '';

// Contadores de caracteres
document.getElementById('input-nome').addEventListener('input', function() {
    document.getElementById('nome-count').textContent = this.value.length;
});

document.getElementById('input-desc').addEventListener('input', function() {
    document.getElementById('desc-count').textContent = this.value.length;
});

// Atualizar contadores ao carregar
document.getElementById('nome-count').textContent = document.getElementById('input-nome').value.length;
document.getElementById('desc-count').textContent = document.getElementById('input-desc').value.length;

document.getElementById('edit-perfil').onsubmit = function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('input-nome').value.trim();
    const desc = document.getElementById('input-desc').value.trim();
    const foto = document.getElementById('input-foto').value.trim();

    if (!nome) {
        showToast('Por favor, digite seu nome!', 'error');
        return;
    }

    const userData = { nome: nome, descricao: desc, foto: foto };
    localStorage.setItem('user_perfil', JSON.stringify(userData));
    
    // Atualizar variável global
    Object.assign(user, userData);
    atualizarVisualizacao();
    
    showToast('Perfil salvo com sucesso!', 'success');
    // fechar modal se existir
    const modalEl = document.getElementById('modal-edit');
    if (modalEl) modalEl.style.display = 'none';
};

// Lista favoritos
const favs = JSON.parse(localStorage.getItem('favoritos')) || [];
const lista = document.getElementById('favoritos-list');

async function exibirFavoritos(ids) {
    lista.innerHTML = ''; // Limpa antes

    if (ids.length === 0) {
        lista.innerHTML = '<li style="text-align: center; color: #999; padding: 40px 20px;">Nenhum favorito ainda. <br>Vá para <strong>Avaliar obras</strong> para favoritá-las!</li>';
        return;
    }

    for (const id of ids) {
        try {
            const resposta = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
            if (!resposta.ok) throw new Error();
            const obj = await resposta.json();

            const title = obj.title || "Sem título";
            const artist = obj.artistDisplayName && obj.artistDisplayName.trim() ? obj.artistDisplayName : "Artista desconhecido";
            const desc = obj.description && obj.description.trim() ? obj.description.substring(0, 150) + "..." : "";
            const img = obj.primaryImage && obj.primaryImage.length > 10 ? obj.primaryImage : "";

            const li = document.createElement('li');
            li.className = 'favorite-item';

            let content = '';
            if (img) {
                content += `<img class="favorite-image" src="${img}" alt="Obra">`;
            }
            content += `
                <strong class="favorite-title">${title}</strong>
                <em>${artist}</em>
                <span>${desc}</span>
                <a href="https://www.metmuseum.org/art/collection/search/${id}" target="_blank">Ver no MET</a>
            `;
            li.innerHTML = content;
            lista.appendChild(li);
        } catch (e) {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>ID: ${id}</strong>
                <span style="color: #999;">Erro ao obter dados da obra</span>
                <a href="https://www.metmuseum.org/art/collection/search/${id}" target="_blank">Ver no MET</a>
            `;
            lista.appendChild(li);
        }
    }
}

exibirFavoritos(favs);