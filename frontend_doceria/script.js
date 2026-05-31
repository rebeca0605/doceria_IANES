const BASE_URL = "http://localhost:3000/v1/doceria";

export async function lerDoces() {
    const url = `${BASE_URL}/produtos`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const dadosBrutos = await response.json();
            
            console.log("ESTRUTURA QUE VEIO DO BACK-END:", dadosBrutos);

            if (dadosBrutos.items && dadosBrutos.items.produtos && Array.isArray(dadosBrutos.items.produtos)) {
                return dadosBrutos.items.produtos;
            }

            if (dadosBrutos.produtos && Array.isArray(dadosBrutos.produtos)) {
                return dadosBrutos.produtos;
            }
            if (Array.isArray(dadosBrutos)) {
                return dadosBrutos;
            }
            
            return [];
        }
        return [];
    } catch (error) {
        console.error("Erro ao buscar doces da API:", error);
        return [];
    }
}

export async function criarDoce(doce) {
    const url = `${BASE_URL}/produtos`;

    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "user-id": "6"
        },

        body: JSON.stringify(doce)
    };

    const response = await fetch(url, options);
    return response.ok;
}

document.querySelector('.formulario').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('doce-nome').value;
    const massa = document.getElementById('doce-massa').value;
    const recheio = document.getElementById('doce-recheio').value;
    const cobertura = document.getElementById('doce-cobertura').value;
    const preco = parseFloat(document.getElementById('doce-preco').value);
    const tipoPorcao = document.getElementById('doce-porcao').value;
    const quantidade = parseInt(document.getElementById('doce-qtd').value);
    const dataInput = document.getElementById('doce-vencimento').value;

    const novoDoce = {
        nome: nome,
        massa: massa,
        recheio: recheio,
        cobertura: cobertura,
        preco: preco,
        tipo_porcao: tipoPorcao,
        quantidade: quantidade,
        data_vencimento: dataInput ? dataInput : "2026-06-15 00:00:00"
    };

    console.log("PACOTE PERFEITO ALINHADO COM A MODEL:", novoDoce);

    const sucesso = await criarDoce(novoDoce);

    if (sucesso) {
        alert("PARABÉNS! Integração do cadastro concluída com sucesso!");
        window.location.reload();
    } else {
        alert("Erro");
    }
});

async function renderizarDoces() {
    const listaProdutosContainer = document.querySelector('.lista-produtos');
    if (!listaProdutosContainer) return;

    listaProdutosContainer.innerHTML = "";
    const doces = await lerDoces();

    console.log("Doces recebidos para desenhar na tela:", doces);

    if (!doces || doces.length === 0) {
        listaProdutosContainer.innerHTML = `<p style="color: #C889A2; text-align: center; font-weight: bold; width: 100%;">Nenhum doce cadastrado no momento. 🧁</p>`;
        return;
    }

    doces.forEach(doce => {
        const produtoCard = document.createElement('div');
        const qtd = doce.quantidade ? parseInt(doce.quantidade) : 0;
        
        const idDoce = doce.id_produtos;

        if (qtd <= 5) {
            produtoCard.className = "produto-item alerta-vencimento";
        } else {
            produtoCard.className = "produto-item";
        }

        produtoCard.innerHTML = `
            <div class="info-produto">
                <h3>${doce.nome || 'Doce sem nome'}</h3>
                <p style="margin: 5px 0; font-size: 14px; color: #7f8c8d;">
                    Massa: ${doce.massa || 'Não informada'} | Recheio: ${doce.recheio || 'Não informado'} | Cobertura: ${doce.cobertura || 'Não informada'}
                </p>
                <p class="preco">R$ ${doce.preco ? parseFloat(doce.preco).toFixed(2).replace('.', ',') : '0,00'}</p>
            </div>
            <div class="status-produto">
                <span class="${qtd <= 5 ? 'qtd-alerta' : 'qtd'}">Qtd: ${qtd} ${doce.tipo_porcao || 'unidade'}</span>
                <span class="${qtd <= 5 ? 'status-erro' : 'status-ok'}">
                    ${qtd <= 5 ? 'Estoque Baixo!' : 'Em estoque'}
                </span>
                <button class="btn-excluir" onclick="window.deletarDoce(${idDoce})" style="margin-top: 8px; cursor: pointer;">Excluir</button>
            </div>
        `;

        listaProdutosContainer.appendChild(produtoCard);
    });
}

window.deletarDoce = async function(id) {
    if (!id || id === "undefined") {
        alert("Erro: Não foi possível capturar o ID correto deste doce.");
        return;
    }

    if (confirm("Tem certeza que deseja descarter e deletar este doce?")) {
        const url = `${BASE_URL}/produtos/${id}`;
        
        const options = {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "user-id": "6" 
            }
        };

        try {
            const response = await fetch(url, options);
            
            if (response.ok) {
                alert("Doce deletado e registrado no histórico com sucesso!");
                renderizarDoces();
            } else {
                alert("Erro ao deletar doce. Verifique o console do Back-end.");
            }
        } catch (error) {
            console.error("Erro na requisição HTTP de exclusão:", error);
        }
    }
}

window.onload = () => {
    renderizarDoces();
};

window.realizarLogoff = function() {
    if (confirm("Deseja realmente sair da sua conta?")) {
        localStorage.clear();
        sessionStorage.clear();

        alert("Até logo! Redirecionando para a tela de login...");

        window.location.href = "login.html"; 
    }
}