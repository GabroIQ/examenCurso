import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../Firebase/Credenciales";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import '../App'
import Swal from 'sweetalert2'

function Examen() {
  const [spiner, setSpiner] = useState(false);
  const [emailUser, setEmailUser] = useState();
  const [datosUser, setDatosUser] = useState();
  const [respuestas, setRespuestas] = useState({});
  const navigate = useNavigate();

  async function buscarRol(email) {
    try {
      const docRef = doc(db, email, "datos");
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data(), "existe el rol");
      setDatosUser(docSnap.data())
      navigate('/examen')
      setSpiner(false);
    } catch (error) {
      setSpiner(false);
      Swal.fire({
        icon: "error",
        text: "Avise al propietario de la pagina de este error",
      });
    }
  };

  function handleResChange(e) {
    setRespuestas({
      ...respuestas,
      [e.target.name]: e.target.value
    })
  }

  async function guardarRes(e) {
    e.preventDefault();
    try {
      await setDoc(doc(db, emailUser, "respuestas"), {
        uno: respuestas.uno,
        dos: respuestas.dos,
        tres: respuestas.tres,
        cuatro: respuestas.cuatro,
        cinco: respuestas.cinco,
        seis: new Date()
      });
      await setDoc(doc(db, emailUser, "datos"), {
        nombre: datosUser.nombre,
        rol: datosUser.rol,
        sendCuestionario: true,
      });
      Swal.fire({
        icon: "success",
        text: "Cuestionario enviado correctamente",
      });
      buscarRol(emailUser);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Avise al propietario de la pagina de este error",
      });
    }
    console.log(respuestas);
  }

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (userLog) => {
      if (userLog) {
        //Buscar datos del usuario en BD
        setEmailUser(userLog.email)
        buscarRol(userLog.email);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <>
      <header className='header-log'>
        <h1>Hola {datosUser?.nombre}!!</h1>
        <button type='submit' onClick={cerrarSesion}>Cerrar sesion</button>
      </header>
      {datosUser?.sendCuestionario === false
        ?
        <div className='log column'>
          <h1>Paso 1: Responder el siguiente cuestionario (2,5p en total)</h1>
          <form className='form-uno' onSubmit={guardarRes}>
            <div className='campo'>
              <label>Si quiero dejar un espaciado con el contenedor de arriba, que propíedad de CSS usarian? (0,5p)</label>
              <select name="uno" id="" className="input-text" onChange={handleResChange} required>
                <option value="">Seleccione</option>
                <option value="display: flex">display: flex</option>
                <option value="margin: 1rem">margin: 1rem</option>
                <option value="margin-top: 1rem">margin-top: 1rem</option>
                <option value=">margin: 10px">margin: 10px</option>
                <option value="margin-bottom: 1rem">margin-bottom: 1rem</option>
              </select>
            </div>

            <div className='campo'>
              <label>Necesito crear un formulario, que etiqueta usarias para el contenedor del formulario? (0,5p)</label>
              <select name="dos" id="" className="input-text" onChange={handleResChange} required>
                <option value="">Seleccione</option>
                <option value="form">form</option>
                <option value="div">div</option>
                <option value="h1">h1</option>
              </select>
            </div>

            <div className='campo'>
              <label>Para que usamos el placerHolder en una etiqueta input? (0,5p)</label>
              <select name="tres" id="" className="input-text" onChange={handleResChange} required>
                <option value="">Seleccione</option>
                <option value="Para indicar el valor del input">Para indicar el valor del input</option>
                <option value="Para indicar el tipo del input">Para indicar el tipo del input</option>
                <option value="Para añadir texto descriptivo al input">Para añadir texto descriptivo al input</option>
                <option value="Todas son correctas">Todas son correctas</option>
                <option value="Ninguna es correcta">Ninguna es correcta</option>
              </select>
            </div>

            <div className='campo'>
              <label>Supongamos que tengo un div conteniendo varias etiquetas de tipo input, por defecto se ponen una al lado de otra, que propiedades usarian para que se ponga en columna? (0,5p)</label>
              <select name="cuatro" id="" className="input-text" onChange={handleResChange} required>
                <option value="">Seleccione</option>
                <option value="display: flex +  flex-direction: column">display: flex +  flex-direction: column</option>
                <option value="display: grid +  flex-direction: column">display: grid +  flex-direction: column</option>
                <option value="display: flex +  flex-direction: row">display: flex +  flex-direction: row</option>
                <option value="Todas son correctas">Todas son correctas</option>
              </select>
            </div>

            <div className='campo'>
              <label>Padding es lo mismo que margin? (0,5p)</label>
              <select name="cinco" id="" className="input-text" onChange={handleResChange} required>
                <option value="">Seleccione</option>
                <option value="Verdadero">Verdadero</option>
                <option value="Falso">Falso</option>
              </select>
            </div>

            <button type='submit' className="boton-enviar ancho-btn">Enviar respuestas</button>
          </form>
        </div>
        : datosUser?.sendCuestionario === true ?

        <div className='log column'>
          <div className='consignas'>
            <h1>Paso 2: Replicar con html y css:</h1>
            <ul className='ul'>
              <li>Header: La imagen del header es a eleccion, tener en cuenta que su fondo sea transparente. (1p)</li>
              <li>Header: Tener en cuenta que tiene un espacio el contenedor header en sus lados. (1p)</li>
              <li>Header: Tener en cuenta el color de fondo. (1p)</li>
              <li>Header: Tener en cuenta el color y el subrayado de los links. (1p)</li>
              <li>Imagen: La imagen puede ser a eleccion, no importa si se visualiza estirada, la idea es que ocupe 350px de alto y 100% de ancho. (1p)</li>
              <li>Cards-Titulo : Debera estar centrada. (0,5p)</li>
              <li>Cards-Imagenes: 4 imagenes a elección orientadas en horizontal. (1p)</li>
              <li>Cards-Imagenes: Las imagenes son pequeñas, tener en cuenta eso. (1p)</li>
            </ul>
          </div>
          <div className='contenedor-examen-practica'>
            <header className='practica-header'>
              <img src="https://www.blender.org/wp-content/uploads/2020/07/blender_logo_no_socket_white.png" alt="" className="img" />
              <nav>
                <a href="">Inicio</a>
                <a href="">Locales</a>
                <a href="">Novedades</a>
                <a href="">Turismo</a>
                <a href="">Servicios</a>
                <a href="">Contacto</a>
              </nav>
            </header>
            <img className='img-banner' src="https://www.ambitojuridico.com/sites/default/files/styles/imagen_800x400/public/2022-08/hombre-negocios-firma%28freepik%29.jpg.webp?itok=2477ei9i" alt="" />
            <div className='cards'>
              <h1>Cards</h1>
              <div className='cards-contenedor'>
                <img className='img-agobiado' src="https://www.bpgurus.com/wp-content/uploads/2022/02/B_examen_miedo.png" alt="" />
                <img className='img-agobiado' src="https://www.bpgurus.com/wp-content/uploads/2022/02/B_examen_miedo.png" alt="" />
                <img className='img-agobiado' src="https://www.bpgurus.com/wp-content/uploads/2022/02/B_examen_miedo.png" alt="" />
                <img className='img-agobiado' src="https://www.bpgurus.com/wp-content/uploads/2022/02/B_examen_miedo.png" alt="" />
                <img className='img-agobiado' src="https://www.bpgurus.com/wp-content/uploads/2022/02/B_examen_miedo.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        :   
        <div className='log column'>
        <div className="column">
          <span className="loader"></span>
          <p>Cargando...</p>
        </div>
        </div> }


    </>
  )
}

export default Examen
