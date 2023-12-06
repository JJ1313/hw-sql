const chatBox = document.querySelector('.chat');
const respuesta = document.querySelector('.respuesta');

const btnAceptar = document.querySelector('.btn-aceptar');
const btnLimpiar = document.querySelector('.btn-limpiar');

const containerOpciones = document.querySelector('.block-options');

let nivelActual = 1;
let preguntaActual = 1;

let puntuacion = 0;

const preguntasPorNivel = 3;
const cantidadNiveles = 3;

async function main(){
  // ====== Cargar json de preguntas ======
  const response = await fetch('./niveles.json').then();
  if(!response.ok){
    alert("Error al cargar el nivel");
    location.reload();
  }
  const preguntas = await response.json();
  let user = JSON.parse(sessionStorage.getItem('user'));
  if(!user){
    alert('Debes haber puesto tu nombre en el inicio... No necesariamente el tuyo, es solo para guardar los datos');
    window.location.href = `index.html`;
  }
  console.log(preguntas);
  cargarPregunta(preguntas);
}
function cargarOpciones(pregunta){
   // === Cargar opciones de la pregunta ===
   pregunta.opciones.forEach((opcion)=>{
    const opcionDIV = document.createElement('div');
    opcionDIV.innerText = opcion;
    containerOpciones.appendChild(opcionDIV);
  });

  // === Agrega evento click a opciones de preguntas ===
  opciones = document.querySelectorAll('.block-options div');
  opciones.forEach(opcion =>{
    opcion.addEventListener('click', ()=>{
      const r = document.createElement('div');
      opcion.remove();
      r.innerText = opcion.innerText;
      respuesta.appendChild(r);
    });
  });
}
function actualizaPuntuacion(){
  const puntuacionDIV = document.getElementById('puntuacion');
  puntuacionDIV.innerText = `$ ${puntuacion}`
}
function cargarPregunta(preguntas){
  preguntas.forEach((pregunta)=>{
    if(pregunta.nivel == nivelActual && pregunta.pregunta == preguntaActual){
      let recompensaFinal = pregunta.recompensa;
      let oportunidades = pregunta.cantOportunidades;
      let numeroAyuda = 0;

      const q = document.createElement('div')
      q.innerText = `${pregunta.enunciado} $${recompensaFinal}`;
      chatBox.appendChild(q);

     cargarOpciones(pregunta);

      // === Revisar si la respuesta es correcta ===
      btnAceptar.addEventListener('click', ()=>{
        const respuesta = document.querySelector('.respuesta').innerText.replace(/\n/g, ' ');

        const msg = document.createElement('div');
        if(respuesta == pregunta.respuesta){
          msg.innerText = `${pregunta.respuestaCorrecta} ${recompensaFinal}`;
          msg.style.outline = 'solid 2px #265828';
          document.querySelector('.respuesta').innerHTML = '';
          containerOpciones.innerHTML = '';
          preguntaActual += 1;
          if(preguntaActual > preguntasPorNivel){
            preguntaActual = 1;
            nivelActual += 1;
            chatBox.innerHTML = '';
          }
          if(nivelActual > cantidadNiveles){
            console.log('FINAL JUEGO')
          }
          puntuacion += recompensaFinal;
          actualizaPuntuacion();

          chatBox.appendChild(msg);
          cargarPregunta(preguntas)
        }
        else if(pregunta.nivel == nivelActual && pregunta.pregunta == preguntaActual){
          msg.style.outline = 'solid 2px #7c0a20';
          msg.innerText = `${pregunta.respuestaIncorrecta} $${pregunta.castigo}`;
          recompensaFinal -= pregunta.castigo;
          if(recompensaFinal < 0){
            recompensaFinal = 0;
          }
          containerOpciones.innerHTML = '';
          chatBox.appendChild(msg);
          cargarOpciones(pregunta);
          oportunidades--;
          if (oportunidades<0){
            msg.innerText = pregunta.respuesta
            // numeroAyuda++;
            // if(numeroAyuda >= pregunta.ayudas.length){
            //   numeroAyuda = 0;
            // }
          }
        }
        
      })
      // === Resetear opciones y respuesta ===
      btnLimpiar.addEventListener('click', ()=>{
        containerOpciones.innerHTML = '';
        respuesta.innerHTML = '';
        cargarOpciones(pregunta);
      });
   }
 });
}

main();