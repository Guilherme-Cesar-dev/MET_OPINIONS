// Pega dados do usuário
const user = JSON.parse(localStorage.getItem('user_perfil')) || {nome: 'Sem nome', descricao:'', foto: ''};
document.getElementById('user-name').textContent = user.nome || 'Sem nome definido';
document.getElementById('user-desc').textContent = user.descricao || '';
if (user.foto) {
    document.getElementById('profile-pic').src = user.foto;
} else {
    document.getElementById('profile-pic').src = 'https://i.imgur.com/kqClj3v.png'; // padrão
}

// Lista favoritos
const favs = JSON.parse(localStorage.getItem('favoritos')) || [];
const lista = document.getElementById('favoritos-list');
if(favs.length === 0) lista.innerHTML = '<li>Nenhum favorito</li>';
favs.forEach(id => {
    // Linka para a página do museu ou outra lógica
    const li = document.createElement('li');
    li.innerHTML = `ID: <a href="https://www.metmuseum.org/art/collection/search/${id}" target="_blank">${id}</a>`;
    lista.appendChild(li);
});

// Preenche campos do formulário
document.getElementById('input-nome').value = user.nome || '';
document.getElementById('input-desc').value = user.descricao || '';
document.getElementById('input-foto').value = user.foto || '';

document.getElementById('edit-perfil').onsubmit = function(e) {
    e.preventDefault();
    const nome = document.getElementById('input-nome').value;
    const desc = document.getElementById('input-desc').value;
    const foto = document.getElementById('input-foto').value;
    localStorage.setItem('user_perfil', JSON.stringify({nome:nome, descricao:desc, foto:foto}));
    alert('Perfil salvo!');
    location.reload();
};

async function exibirFavoritos(ids) {
    if(ids.length === 0) {
        lista.innerHTML = '<li>Nenhum favorito</li>';
        return;
    }

    for (const id of ids) {
        try {
            // Busca detalhes do objeto pela API
            const resposta = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
            const dados = await resposta.json();

            // Cria um item de lista com a imagem e um link
            const li = document.createElement('li');
            if (dados.primaryImage) {
                li.innerHTML = `
                    <a href="https://www.metmuseum.org/art/collection/search/${id}" target="_blank">
                        <img src="${dados.primaryImage}" alt="${dados.title}" style="max-width:120px;max-height:120px;vertical-align:middle">
                    </a><br>
                    <span>${dados.title || 'Sem título'}</span>
                `;
            } else {
                li.innerHTML = `
                    <a href="https://www.metmuseum.org/art/collection/search/${id}" target="_blank">${id}</a> - Sem imagem disponível
                `;
            }
            lista.appendChild(li);
        } catch (e) {
            // Se der erro, mostra só o ID
            const li = document.createElement('li');
            li.textContent = `ID: ${id} (erro ao obter dados)`;
            lista.appendChild(li);
        }
    }
}

exibirFavoritos(favs);