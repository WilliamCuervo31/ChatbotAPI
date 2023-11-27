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
  });

console.log("Funciona");