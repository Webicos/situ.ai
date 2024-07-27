const consultaButton = document.getElementById('consultaButton'),
  consultaNovamenteButton = document.getElementById('consultar-novamente'),
  consultaInput = document.getElementById('consultaInput');

const formContainer = document.querySelector('.form-overlay'),
  loader = document.getElementById('loader-box'),
  erroMensagem = document.getElementById('erro');

const cadastradoCNPJ = document.getElementById('cadastrado-cnpj'),
  cadastradoRazaoSocial = document.getElementById('cadastrado-razao_social'),
  cadastradoCapital = document.getElementById('cadastrado-capital_social'),
  cadastradoSituacao = document.getElementById('cadastrado-situacao_cadastral');

const consultadoCNPJ = document.getElementById('consultado-cnpj'),
  consultadoRazaoSocial = document.getElementById('consultado-razao_social'),
  consultadoCapital = document.getElementById('consultado-capital_social'),
  consultadoSituacao = document.getElementById('consultado-situacao_cadastral');

// CONTROLE DO INPUT

function formataCNPJ(cnpj) {
  // Remove todos os caracteres que não são dígitos
  cnpj = cnpj.replace(/\D/g, "");

  // Adiciona a formatação do CNPJ
  cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
  cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');

  return cnpj;
}

function deformataCNPJ(cnpj) {
  // Remove todos os caracteres que não são dígitos
  return cnpj.replace(/\D/g, "");
}

consultaInput.addEventListener('keydown', function (e) {
  // Permitir as teclas de controle: backspace, delete, tab, escape, enter, etc.
  if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
    (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
    (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
    (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
    // Permitir teclas de navegação: home, end, left, right, down, up
    (e.keyCode >= 35 && e.keyCode <= 40)) {
    // Deixe acontecer
    return;
  }
  // Assegure-se que é um número e pare o evento se não for
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
    e.preventDefault();
  }
});

consultaInput.addEventListener('input', () => {
  let cnpjFormatado = formataCNPJ(consultaInput.value);
  consultaInput.value = cnpjFormatado;

  if (consultaInput.value.length === 18) {
    consultaButton.classList.remove('disabled')
  } else {
    consultaButton.classList.add('disabled')
  };
});

// FUNÇÕES PARA FETCH
function obterStatusAleatorio() {
  let status = ["Ativa", "Inativa", "Cancelado", "Extinta"];
  let indiceAleatorio = Math.floor(Math.random() * status.length);
  return status[indiceAleatorio];
}

function gerarValorAleatorio() {
  let min = 1,
    max = 100000;

  let numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min,
    valorFormatado = `R$ ${numeroAleatorio}.00`;
  return valorFormatado;
}

function comparaDoisCampos(campoUm, campoDois) {
  if (campoUm.innerText !== campoDois.innerText) {
    campoUm.classList.add('diferente')
  } else {
    campoUm.classList.remove('diferente')
  }
}

consultaButton.addEventListener('click', () => {

  loader.classList.add('show');

  fetch(`https://publica.cnpj.ws/cnpj/${deformataCNPJ(consultaInput.value)}`)
    .then(r => {
      if (!r.ok) {
        erroMensagem.innerText = response.statusText + '. Não encontrado.';

        [erroMensagem, consultaInput].forEach(each => each.classList.add('mostra-erro'))

        loader.classList.remove('show');
      } else {
        return r.json()
      }
    })
    .then(response => {

      window.scrollTo(0, 0);

      cadastradoCNPJ.innerText = consultadoCNPJ.innerText = response.estabelecimento.cnpj;
      
      cadastradoRazaoSocial.innerText = consultadoRazaoSocial.innerTex = response.razao_social;
      
      cadastradoSituacao.innerText = obterStatusAleatorio();
      consultadoSituacao.innerText = response.estabelecimento.situacao_cadastral;
      comparaDoisCampos(consultadoSituacao, cadastradoSituacao);
      
      cadastradoCapital.innerText = gerarValorAleatorio();
      consultadoCapital.innerText = 'R$ ' + response.capital_social;
      comparaDoisCampos(consultadoCapital, cadastradoCapital);
      
      loader.classList.remove('show');
      [document.body, formContainer].forEach(each => each.classList.remove('consulta-ativa'));
    })
})

consultaNovamenteButton.addEventListener('click', () => {
  
  [erroMensagem, consultaInput].forEach(each => each.classList.remove('mostra-erro'));
  [document.body, formContainer].forEach(each => each.classList.add('consulta-ativa'));

  consultaInput.value = '';
})