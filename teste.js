let ultimoObjectID = null;

// Captura o IP e salva no localStorage (uma única vez)
async function salvarIP() {
    if (!localStorage.getItem('user_ip')) {
        try {
            const ipReq = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipReq.json();
            localStorage.setItem('user_ip', ipData.ip);
        } catch (e) {
            localStorage.setItem('user_ip', 'IP não disponível');
        }
    }
}

salvarIP();

async function searchOBJ(maxTentativas = 10) {
    showLoading(true);
  const listUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects`;
  try {
    const listaRes = await fetch(listUrl);
    if (!listaRes.ok) throw new Error(`Erro HTTP: ${listaRes.status}`);
    const listaDados = await listaRes.json();
    const ids = listaDados.objectIDs;
    if (!ids || ids.length === 0) throw new Error('Nenhum objectID disponível');

    for (let tentativa = 0; tentativa < maxTentativas; tentativa++) {
      const randomIndex = Math.floor(Math.random() * ids.length);
      const chosenId = ids[randomIndex];
      const urlOBJ = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${chosenId}`;
      const resposta = await fetch(urlOBJ);
      if (!resposta.ok) continue;
      const dadoOBJ = await resposta.json();
      if (dadoOBJ && dadoOBJ.primaryImage) {
                await tratarDados(dadoOBJ);
                showLoading(false);
                return;
      }
    }
    throw new Error('Não foi possível encontrar imagem em várias tentativas.');
  } catch (erro) {
    console.error('Erro ao consumir o OBJ:', erro);
        showToast('Erro ao buscar obra', 'error');
        showLoading(false);
  }
}

async function tratarDados(dadoOBJ) {

// id = dadoOBJ.objectID ;
// image = dadoOBJ.primaryImage ;
// nome = dadoOBJ.title ; 
// descricao = dadoOBJ.description ; 
// artista = dadoOBJ.artistDisplayName ; 
// tamanho = dadoOBJ.dimensions ; 
// data = dadoOBJ.objectBeginDate ; 
// departamento = dadoOBJ.department ; 

    ultimoObjectID = dadoOBJ.objectID; // ATUALIZA GLOBAL

    if(!dadoOBJ.description) dadoOBJ.description = "Sem descrição";
    if(!dadoOBJ.artistDisplayName) dadoOBJ.artistDisplayName = "Não identificado";

    // Seleciona o elemento container
    const container = document.getElementById('left');
   

    // Adiciona HTML dentro do container
    container.innerHTML = `
    <p id="obj-id">${ultimoObjectID}</p>
    <div id="obj-div">
        <p><b>${dadoOBJ.title}</b></p>
        <img id="imagem" src="${dadoOBJ.primaryImage}" alt="${dadoOBJ.title}">
        <p>Description: ${dadoOBJ.description}</p>
        <p>Artist: ${dadoOBJ.artistDisplayName}</p>
        <p>Year: ${dadoOBJ.objectBeginDate}</p>
    </div>
    `;
}

document.getElementById('favoritar').onclick = function() {
    favoritarOBJ(ultimoObjectID);
};

function favoritarOBJ(objectID) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (!favoritos.includes(objectID)) {
        favoritos.push(objectID);
        showToast('Favoritado!', 'success');
    } else {
        favoritos = favoritos.filter(id => id !== objectID);
        showToast('Removido dos favoritos!', 'info');
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

//  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${Number}`;


async function kayney() {
        try {
            const kaneUrl = `https://api.kanye.rest/`;

            const resposta = await fetch(kaneUrl);
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }
            const kane = await resposta.json();
            console.log({ kane });
            await tratarkane(kane);
            
        } catch (erro) {
            console.error('Erro ao consumir o OBJ:', erro);
        }
}

async function tratarkane(kane) {
    console.log({ quote: kane.quote });

    
    // Seleciona o elemento container
    const container = document.getElementById('back');

    // Adiciona HTML dentro do container
    container.innerHTML = `
    <div id="obj-kane">
        <p>${kane.quote}, Kanye West</p><br/>
        <p><a href="sobre.html">About Us.</a></p>
    </div>
    `;

}

searchOBJ();
kayney();