import { useState } from 'react'
import { doc, setDoc } from "firebase/firestore";
import { db } from "./Firebase/Credenciales";
import './App.css'
import Swal from 'sweetalert2'
import styled from 'styled-components';
import { Rating } from 'primereact/rating';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [spiner, setSpiner] = useState(false);
  const [stepUno, setStepUno] = useState(true);
  const [stepDos, setStepDos] = useState(false);
  const [stepTres, setStepTres] = useState(false);
  const [stepCuatro, setStepCuatro] = useState(false);
  const [value, setValue] = useState(null);
  const [user, setUser] = useState({
    nombre: '',
    apellido: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const siguiente = (opt) => {
    if (opt === "1") {
      SpeechRecognition.stopListening
      setStepUno(false);
      setStepDos(true);
    }

    if (opt === "2") {
      setStepDos(false);
      setStepTres(true);
    }

    if (opt === "3") {
      setStepTres(false);
      setStepCuatro(true);
    }
  }

  const validacionNombre = () => {
    if (user.nombre && user.apellido) {
      return false;
    }
    return true;
  }

  const validacionValue = () => {
    if (value != null) {
      return false;
    }
    return true;
  }

  const asd = async (e) => {
    e.preventDefault();
    setSpiner(true);
    const objMoldeado = {
      nombreCompleto: `${user.nombre.toLowerCase()}${user.apellido.toLowerCase()}`,
      texto: transcript,
      textoPuntaje: value
    }

    await setDoc(doc(db, objMoldeado.nombreCompleto, uuidv4()), {
      nombre: user.nombre,
      apellido: user.apellido,
      texto: objMoldeado.texto,
      textoPuntaje: objMoldeado.textoPuntaje,
      fecha: new Date()
    });
    setSpiner(false);
    Swal.fire({
      icon: "success",
      text: "Cuestionario enviado correctamente, gracias por participar.",
    });
    setStepCuatro(false);
    setStepUno(true);
    resetTranscript
    setValue(null);
    setUser({
      nombre: '',
      apellido: ''
    });

  }




  return (
    <>
      {/* <button onClick={mostrar}>asd</button> */}
      <div className='log'>

        <Form>
          {stepUno &&
            <>
              <h3>¡Bienvenido!</h3>
              <p>
                Gracias por tomarte el tiempo para completar este cuestionario. Tu participación es muy valiosa y nos ayuda a mejorar continuamente. Apreciamos tu colaboración y tus respuestas son fundamentales para el éxito de este proyecto.
              </p>
              <button onClick={() => siguiente("1")}>Empezar</button>
            </>
          }

          {stepDos &&
            <>
              <h3 style={{ textAlign: 'start' }}>Paso 01.</h3>
              <div className='contenedor-input'>
                <label htmlFor="">Nombre</label>
                <input type="text" placeholder='Ingrese su nombre' name='nombre' onChange={handleChange} />
              </div>
              <div className='contenedor-input espacio-top'>
                <label htmlFor="">Apellido</label>
                <input type="text" placeholder='Ingrese su nombre' name='apellido' onChange={handleChange} />
              </div>
              <button disabled={validacionNombre()} className={`${validacionNombre() ? 'btn-disabled' : null} espacio-top`} onClick={() => siguiente("2")}>Siguiente</button>
            </>
          }

          {stepTres &&
            <>
              <h3>¡Excelente!</h3>
              <p>
                A continuación, verá un ícono de micrófono en la pantalla. Para comenzar, deberá presionarlo y comenzar a hablar, simulando el diagnóstico y/o la evaluación de un paciente.
                <br /><br />

                El objetivo es verificar si el sistema es capaz de interpretar de manera eficiente y precisa todas las palabras que mencione y procesar el vocabulario médico con presición.
              </p>

              <div className='contenedor-micro'>
                {
                  listening === false
                    ? <i onClick={SpeechRecognition.startListening} className={`${listening ? 'pi pi-microphone escuchando' : 'pi pi-microphone'}`}></i>
                    : <p className='stop' >DETENER</p>
                }
              </div>
              {transcript &&
                <p className='transcripcion'>{transcript}</p>
              }
              <button className={`${transcript ? null : 'btn-disabled'}`} disabled={transcript ? false : true} onClick={() => siguiente("3")}>Siguiente</button>
            </>
          }

          {stepCuatro &&
            <>
              <h3>¡Último paso!</h3>
              <p>
                Califique la precisión de la interpretación según su exactitud. Utilice una escala de 1 a 5 estrellas, siendo 5 el puntaje más alto, que indica una interpretación perfecta, y 1 el puntaje más bajo, que indica que la traducción no fue precisa en absoluto.
              </p>

              <div className='contenedor-estrellas'>
                <Rating value={value} onChange={(e) => setValue(e.value)} cancel={false} style={{ fontSize: '2rem' }} />
              </div>

              <button className={`${validacionValue() ? 'btn-disabled' : null} espacio-top`} disabled={validacionValue()} onClick={asd}>Enviar cuestionario</button>
            </>
          }
        </Form>
      </div>
    </>
  )
}

export default App


const Form = styled.form`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  width: 350px;
  margin: 0 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  h3 {
  font-family: 'Kanit', sans-serif;
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

p {
  font-family: 'Kanit', sans-serif;
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
}

label {
  font-family: 'Kanit', sans-serif;
  font-size: 16px;
  color: #555;
  line-height: 1.6;
}

button {
  background-color: #28a745;
  color: #fff;
  font-size: 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: block;
  margin: 0 auto;
}

.btn-disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.contenedor-input{
  display: flex;
  flex-direction: column;
  width: 100%;
  input {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 16px;
  color: #333;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
}

.espacio-top{
  margin-top: 1rem;
}

.contenedor-micro{
  display: flex;
  align-items: center;
  justify-content: center;
}
.pi-microphone{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  color: #333;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: solid 1px #333;
  font-size: 40px;
  cursor: pointer;
}
.stop{
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  color: tomato;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: solid 1px tomato;
  font-weight: 700;
  cursor: pointer;
}
.escuchando{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  color: #333;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: solid 1px #333;
  font-size: 40px;
  cursor: pointer;
}
.pi-microphone:hover{
  background-color: #333;
  color: #fff;
  font-weight: 100;
}

.contenedor-estrellas{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.transcripcion{
  border: solid #333;
  border-radius: 10px;
  padding: 1rem;
}
`