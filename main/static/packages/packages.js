const btnDoc = document.querySelector("#btn-doc");
const btnPac = document.querySelector('#btn-pac');
const origen = document.querySelector('#origen');
const destino = document.querySelector('#destino');
const origen2 = document.querySelector('#origen2');
const destino2 = document.querySelector('#destino2');
const micro = document.querySelector(".left-chat-micro");
const peso2 = document.querySelector("#peso2");
const peso = document.querySelector('#peso');
const alert1 = document.querySelector('#alert')
var totalOptions = origen.options.length;
var totalOptions2 = origen2.options.length;
var orden = [origen, destino, peso]
var orden2 = [origen2, destino2]
let currentIndex = 0;

function select(text, element){
  text = text.charAt(0).toUpperCase() + text.slice(1);

  if(element == origen || element == destino){
    for (var i = 0; i < totalOptions; i++){
      var option = element.options[i].textContent;
        if (option == text) {
          element.value = option;
        }
    }
  } else if(element == origen2 || element == destino2){
    for (var i = 0; i < totalOptions2; i++){
      var option = element.options[i].textContent;
        if (option == text) {
          element.value = option;
        }
    }
  }
  

}

function startVoice(event, rec) {
  let textResult = event.results[0][0].transcript;
  rec.stop();
  micro.style.cssText = `
      background-color: blue;
      box-shadow: 0 0 1.5rem 0.4rem transparent;
  `;

  if(formulario1.style.display == "block"){
    select(textResult, orden[currentIndex]); 

    currentIndex++; 

    if (currentIndex < orden.length) {
      orden[currentIndex].focus();
      listen_select();
    }
  } else if (formulario2.style.display == "block"){
    select(textResult, orden2[currentIndex]); 

    currentIndex++; 

    if (currentIndex < orden2.length) {
      orden2[currentIndex].focus();
      listen_select();
    }
  } else {
    console.log("hola")
  }
}

function listen_select(){
  let rec;
  micro.style.cssText = `
      background-color: var(--primary-color);
      box-shadow: 0 0 1.5rem 0.4rem var(--secondary-color);
  `;

  if (!("webkitSpeechRecognition" in window)){
      alert("No puedes usar el micrófono")
  } else {
      rec = new webkitSpeechRecognition();
      rec.lang = "es-CO";
      rec.continuous = true;
      rec.interim = true;
      rec.addEventListener("result", (e) => {
          startVoice(e, rec);
      })
      rec.start();
  }
}

function calc_val(peso, e){
  if(origen2.value == destino2.value){
    const alert_d = document.createElement('p');
    alert_d.textContent = `No se puede enviar a la misma ciudad`;
    alert_d.classList.add('alert'); 
    alert_d.classList.add('alert-danger'); 
    container.appendChild(alert_d);
    e.preventDefault();
  }else{
    var total2 = 0;
  if (peso < 10){
    total2 = 0;
    alert_d.textContent = `El peso mínimo son 10 kg`;
    container.appendChild(alert_d);
    e.preventDefault();
  }
  else if(10 <= peso && peso < 29){
    total2 = 35500;
  }
  else if(30 <= peso && peso <= 50){
    total2 = 54500;
  }
  else if(50 < peso && peso <= 59){
    total2 = 64000;
  }
  else if(60 <= peso && peso <= 69){
    total2 = 73400;
  }
  else if(peso > 69){
    total2 = 0;
    alert_d.textContent = `El peso máximo son 69 kg`;
    container.appendChild(alert_d);
    e.preventDefault();
  }

  return total2;
  }
}


function calc_doc(peso, e){
  if(origen.value == destino.value){
    const alert_d = document.createElement('p');
    alert_d.textContent = `No se puede enviar a la misma ciudad`;
    alert_d.classList.add('alert'); 
    alert_d.classList.add('alert-danger'); 
    container.appendChild(alert_d);
    e.preventDefault();
  }else{
    var total = 0;
  if (peso < 2){
    total = 0;
    alert_d.textContent = `El peso mínimo son 2 kg`;
    container.appendChild(alert_d);
    e.preventDefault();
  }
  else if(peso == 2 ){
    total = 25000;
  }
  else if(2 < peso && peso < 6){
    total = 40000;
  }
  else if(6 <= peso && peso < 67){
    total = 45000;
  }
  else if(peso >= 68){
    total = 50000;
  }

  return total;
  }
}

function mostrarTotalEnContainer(total) {
  const container = document.querySelector('.container');
  const totalElement = document.createElement('p');
  totalElement.textContent = `Total: ${total}`;
  totalElement.classList.add('alert'); 
  totalElement.classList.add('alert-danger'); 
  
  


  container.appendChild(totalElement);
  totalElement.style.display = "flex";
  totalElement.style.alignItems = "center";
}


micro.addEventListener('click', listen_select)


document.addEventListener('DOMContentLoaded', function() {
    const elemento1 = document.getElementById('elemento1');
    const elemento2 = document.getElementById('elemento2');
    const formulario1 = document.getElementById('formulario1');
    const formulario2 = document.getElementById('formulario2');
  
    elemento1.addEventListener('click', function() {
      formulario1.style.display = 'block';
      formulario2.style.display = 'none';
      elemento1.style.border = '0.1rem solid blue';
      elemento2.style.border = '0.1rem solid grey';
      elemento1.style.color = 'blue';
      elemento2.style.color = 'black';
    });
  
    elemento2.addEventListener('click', function() {
      formulario1.style.display = 'none';
      formulario2.style.display = 'block';
      elemento2.style.border = '0.1rem solid blue';
      elemento1.style.border = '0.1rem solid grey';
      elemento2.style.color = 'blue';
      elemento1.style.color = 'black';
    });

    btnDoc.addEventListener('click', (e) => {
      total = calc_doc(peso.value, e);
      e.preventDefault();
      mostrarTotalEnContainer(total);
      e.preventDefault();
      
    })

    btnPac.addEventListener('click', (e) => {
      total2 = calc_val(peso2.value, e);
      mostrarTotalEnContainer(total2);
      e.preventDefault();
      
    })
  });

  



