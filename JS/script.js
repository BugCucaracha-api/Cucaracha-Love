/*====================================================
    VARIABLES
====================================================*/

const cats = [
    "img/cat1.jpg",
    "img/cat2.jpg",
    "img/cat3.jpg",
    "img/cat4.jpg",
];

let currentImage = 0;
let rejectionReason = "";
let userName = "";


/*====================================================
    ELEMENTOS HTML
====================================================*/

const welcome = document.getElementById("welcome");
const nameScreen = document.getElementById("nameScreen");
const userNameInput = document.getElementById("userName");
const home = document.getElementById("home");
const welcomeUser = document.getElementById("welcomeUser");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalReason = document.getElementById("modalReason");
const modalButtons = document.getElementById("modalButtons");

const gallery = document.getElementById("gallery");
const catImage = document.getElementById("catImage");
const galleryCounter = document.getElementById("galleryCounter");
const catDecision = document.getElementById("catDecision");

const loading = document.getElementById("loading");
const progressBar = document.getElementById("progressBar");
const loadingText = document.getElementById("loadingText");
const finalScreen = document.getElementById("final");

const matchScreen = document.getElementById("matchScreen");
const matchForm = document.getElementById("matchForm");
const matchName = document.getElementById("matchName");
const matchDate = document.getElementById("matchDate");
const matchUserName = document.getElementById("matchUserName");
const matchStatus = document.getElementById("matchStatus");
const matchSuccess = document.getElementById("matchSuccess");
const successUserName = document.getElementById("successUserName");


/*====================================================
    UTILIDADES
====================================================*/

function show(element){
    element.classList.remove("oculto");
}

function hide(element){
    element.classList.add("oculto");
}

function closeModal(){
    hide(modal);
}

function resetModal(){
    modalTitle.innerHTML = "";
    modalText.innerHTML = "";
    modalReason.value = "";
    hide(modalReason);
    modalButtons.innerHTML = "";
}


/*====================================================
    CREAR BOTÓN
====================================================*/

function createButton(text, className, callback){

    const button = document.createElement("button");

    button.innerHTML = text;
    button.className = className;
    button.onclick = callback;

    return button;
}


/*====================================================
    ABRIR MODAL
====================================================*/

function openModal(title, text){

    resetModal();

    modalTitle.innerHTML = title;
    modalText.innerHTML = text;

    show(modal);
}


/*====================================================
    MODAL SI / NO
====================================================*/

function openQuestion(title, text, yesCallback, noCallback){

    openModal(title, text);

    modalButtons.appendChild(
        createButton(
            "Sí",
            "reject",
            () =>{
                closeModal();
                yesCallback();
            }
        )
    );

    modalButtons.appendChild(
        createButton(
            "No",
            "like",
            () =>{
                closeModal();

                if(noCallback){
                    noCallback();
                }
            }
        )
    );
}


/*====================================================
    MODAL CON TEXTAREA
====================================================*/

function openReasonModal(title, text, callback){

    openModal(title, text);

    show(modalReason);
    modalReason.focus();

    modalButtons.appendChild(
        createButton(
            "Continuar",
            "like",
            async () => {

                rejectionReason =
                    modalReason.value.trim();

                await submitRejection();

                closeModal();

                callback();
            }
        )
    );
}


/*====================================================
    PANTALLA INICIAL
====================================================*/

function startExperience(){

    hide(welcome);
    show(nameScreen);

    userNameInput.focus();
}

function saveNameAndContinue(){

    const name = userNameInput.value.trim();

    if(!name){
        userNameInput.focus();
        userNameInput.reportValidity();
        return;
    }

    userName = name;

    hide(nameScreen);
    show(home);

    welcomeUser.innerHTML =
        `Hola, <strong>${escapeHtml(userName)}</strong> 👋<br>25 años • Buenos Aires`;
}

function escapeHtml(text){

    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


/*====================================================
    MATCH
====================================================*/

function openMatch(){

    hide(home);

    matchName.value = userName;
    matchUserName.innerHTML = escapeHtml(userName);
    matchStatus.innerHTML = "";

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    matchDate.min = `${year}-${month}-${day}`;

    show(matchScreen);
}

async function submitMatch(event){

    event.preventDefault();

    const submitButton = matchForm.querySelector("button[type='submit']");


    const formSubmitUrl = "https://formsubmit.co/ajax/bugcucaracha@gmail.com";

    submitButton.disabled = true;
    submitButton.innerHTML = "⏳ Confirmando cita...";
    matchStatus.innerHTML = "Enviando los datos a Gabriel... ";

    const data = Object.fromEntries(new FormData(matchForm).entries());

    try{

        const response = await fetch(formSubmitUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if(!response.ok || result.success === false){
            throw new Error("No se pudo enviar el formulario.");
        }

        hide(matchScreen);
        successUserName.innerHTML = escapeHtml(userName);
        show(matchSuccess);

    }catch(error){

        console.error(error);
        matchStatus.innerHTML =
            "❌ No pudimos enviar la solicitud. Revisá la configuración de FormSubmit.";

        submitButton.disabled = false;
        submitButton.innerHTML = "❤️ Confirmar cita";
    }
}

/*====================================================
    Rechazo
====================================================*/

async function submitRejection(){

    const formSubmitUrl =
        "https://formsubmit.co/ajax/bugcucaracha@gmail.com";

    const data = {
        name: userName,
        decision: "Rechazo",
        motivo_rechazo: rejectionReason,
        _subject: "💔 Gabriel fue rechazado",
        _template: "table"
    };

    try {

        const response = await fetch(formSubmitUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
            throw new Error("No se pudo enviar el rechazo.");
        }

        console.log("Rechazo enviado correctamente");

    } catch (error) {

        console.error(
            "Error enviando el rechazo:",
            error
        );

    }
}


/*====================================================
    REINICIAR
====================================================*/

function restart(){

    hide(gallery);
    hide(loading);
    hide(finalScreen);
    hide(matchScreen);
    hide(matchSuccess);
    hide(home);
    hide(nameScreen);
    closeModal();

    show(welcome);

    currentImage = 0;
    rejectionReason = "";
    userName = "";

    userNameInput.value = "";
    matchForm.reset();
    matchStatus.innerHTML = "";
    progressBar.style.width = "0%";

    if(catDecision){
        hide(catDecision);
    }
}


/*====================================================
    FLUJO DE RECHAZO
====================================================*/

function startRejectFlow(){
    firstQuestion();
}


/*====================================================
    PRIMER CARTEL
====================================================*/

function firstQuestion(){

    openQuestion(
        "⚠️ ¿Está seguro?",
        `¿Está seguro que desea rechazar a <b>Gabriel</b>, ${escapeHtml(userName)}?`,
        secondQuestion
    );
}


/*====================================================
    SEGUNDO CARTEL
====================================================*/

function secondQuestion(){

    openQuestion(
        "🥺 Pensalo bien...",
        `
        ${escapeHtml(userName)}, mirá que Gabriel...
        <br><br>
        💵 Paga todas las salidas.
        <br>
        🔮 Cree en el horóscopo.
        <br>
        📖 Le fascina leer a Pizarnik.
        `,
        thirdQuestion
    );
}


/*====================================================
    TERCER CARTEL
====================================================*/

function thirdQuestion(){

    openReasonModal(
        "📝 Última pregunta",
        `
        Estás en todo tu derecho de rechazar a Gabriel, ${escapeHtml(userName)}.
        <br><br>
        Pero...
        <br><br>
        ¿Podrías decirnos el motivo?
        `,
        openGallery
    );
}


/*====================================================
    ABRIR GALERÍA
====================================================*/

function openGallery(){

    currentImage = 0;

    catImage.src = cats[currentImage];

    galleryCounter.innerHTML =
        `1 / ${cats.length}`;

    hide(catDecision);
    show(gallery);
}


/*====================================================
    SIGUIENTE FOTO
====================================================*/

function nextImage(){

    if(currentImage >= cats.length - 1){
        return;
    }

    currentImage++;

    catImage.src = cats[currentImage];

    galleryCounter.innerHTML =
        `${currentImage + 1} / ${cats.length}`;

    if(currentImage === cats.length - 1){
        show(catDecision);
    }
}


/*====================================================
    FOTO ANTERIOR
====================================================*/

function previousImage(){

    if(currentImage <= 0){
        return;
    }

    currentImage--;

    catImage.src = cats[currentImage];

    galleryCounter.innerHTML =
        `${currentImage + 1} / ${cats.length}`;

    if(currentImage < cats.length - 1){
        hide(catDecision);
    }
}


/*====================================================
    PREMIUM
====================================================*/

function premiumWarning(){

    hide(gallery);

    openQuestion(
        "💳 WARNING",
        `
        <b>Gabriel paga la suscripción Premium.</b>
        <br><br>
        Si desea rechazarlo deberá abonar
        <b>$10.000</b>
        <br><br>
        ¿Desea continuar?
        `,
        startLoading,
        () =>{
            restart();
        }
    );
}


/*====================================================
    LOADING
====================================================*/

function startLoading(){

    closeModal();
    show(loading);

    const messages = [
        "Validando suscripción Premium...",
        "Validando datos de pago...",
        "Finalizando proceso..."
    ];

    let progress = 0;

    progressBar.style.width = "0%";
    loadingText.innerHTML = messages[0];

    function advance(){

        progress += 5;
        progressBar.style.width = progress + "%";

        if(progress === 50){
            loadingText.innerHTML = messages[1];
            setTimeout(advance, 2500);
            return;
        }

        if(progress >= 100){
            progressBar.style.width = "100%";
            loadingText.innerHTML = messages[2];

            setTimeout(() =>{
                showFinal();
            }, 2500);

            return;
        }

        setTimeout(advance, 200);
    }

    advance();
}


/*====================================================
    FINAL
====================================================*/

function showFinal(){

    hide(loading);
    show(finalScreen);
}


/*====================================================
    EVENTOS
====================================================*/

document
    .getElementById("btnStart")
    .addEventListener("click", startExperience);

document
    .getElementById("btnNameContinue")
    .addEventListener("click", saveNameAndContinue);

document
    .getElementById("userName")
    .addEventListener("keydown", (event) =>{

        if(event.key === "Enter"){
            saveNameAndContinue();
        }

    });

document
    .getElementById("btnReject")
    .addEventListener("click", startRejectFlow);

document
    .getElementById("btnLike")
    .addEventListener("click", openMatch);

document
    .getElementById("btnNext")
    .addEventListener("click", nextImage);

document
    .getElementById("btnPrev")
    .addEventListener("click", previousImage);

document
    .getElementById("btnCatMatch")
    .addEventListener("click", openMatch);

document
    .getElementById("btnNoHeart")
    .addEventListener("click", premiumWarning);

matchForm.addEventListener("submit", submitMatch);

document
    .getElementById("btnMatchRestart")
    .addEventListener("click", restart);

document
    .getElementById("btnRestart")
    .addEventListener("click", restart);

document
    .getElementById("btnCancelMatch")
    .addEventListener("click", restart);

/*====================================================
    INICIALIZACIÓN
====================================================*/

restart();
