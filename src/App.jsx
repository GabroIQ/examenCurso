import { useState, useEffect } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./Firebase/Credenciales";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './App.css'
import Swal from 'sweetalert2'

function App() {
  const [spiner, setSpiner] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    //capturar input campos
    const email = e.target.email.value
    const pass = e.target.pass.value
    console.log(email, pass)
    //funcion inicio de session (con parametros)
    iniciarSesion(email, pass)
  }

  const iniciarSesion = (email, pass) => {
    setSpiner(true);
    signInWithEmailAndPassword(auth, email, pass).then((userCredential) => {
      if (userCredential) {
        console.log(userCredential, "existe")
        // navigate('/Dashboard')
        buscarRol(email);
      }
    })
      .catch((err) => {
        console.log(err);
        setSpiner(false);
        Swal.fire({
          icon: "error",
          text: "Regvise usuario y cxontraseña e intenelo de nuevo",
        });
      });
  }

  async function buscarRol(email) {
    try {
      const docRef = doc(db, email, "datos");
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data(), "existe el rol");
      navigate('/examen')
      setSpiner(false);
    } catch (error) {
      setSpiner(false);
      Swal.fire({
        icon: "error",
        text: "Avise al propietario de la pagina de este error",
      });
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (userLog) => {
      if (userLog) {
        //Buscar datos del usuario en BD
        navigate("/examen");
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <>
      {/* <button onClick={mostrar}>asd</button> */}
      <div className='log'>
        <div className='formulario'>
          <img src="https://cdn-icons-png.flaticon.com/512/843/843331.png" alt="img" />
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="campo">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name='email' className="input-text" required />
            </div>
            <div className="campo">
              <label htmlFor="email">Contraseña:</label>
              <input type="password" id="pass" name='pass' className="input-text" required />
            </div>
            <button type="submit" className="boton-enviar" disabled={spiner}>
              {spiner ? (
                <span className="spinner"></span>
              ) : (
                "Login"
              )}
            </button>
        
          </form>
        </div>
      </div>
    </>
  )
}

export default App
