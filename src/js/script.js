//DECLARAÇÕES DOS ELEMENTOS
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");


// Método Habilitar Câmera

async function configurarCamera(){
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment"},
            audio: false
        });
        videoElemento.srcObject = midia;
        videoElemento.play();

    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera",erro;
    }
}

configurarCamera();

botaoScanear.onclick = async ()=>{
    botaoScanear.disabled = true;
    resultado.innerText = "Fazendo a leitura ...aguarde";

    // preparar o cenario em 2d do canvas
    const contexto = canvas.getContext("2d")

    //ajustar tamanho
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //limpa e garante que a orientação seja a padrão ( não espelhada)

    contexto.setTransform(1,0,0,1,0,0);

    contexto.filter= "contrast(1.2) grayscale(1)";

    contexto.drawImage(videoElemento, 0, 0, canvas.width,canvas.height);
    
    try{
        const {data: {text}} = await Tesseract.recognize(
            canvas,
            'por' // idioma do texto
        );
        const textoFinal = text.trim();
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não possivel capturar o texto";
    }catch(erro){
        console.error(erro);
        resultado.innerText = "Erro no Processamento", erro;
    } finally{
        botaoScanear.disabled= false;
    }
}