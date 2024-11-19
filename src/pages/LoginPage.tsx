import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../libs/firebase'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const handleForgotPassword = () => {
    const temp = prompt('Enter email')
    const auth = getAuth()
    if (temp) {
      sendPasswordResetEmail(auth, temp)
        .then(() => {
          alert('Check your inbox to reset your Password.')
        })
        .catch((error) => {
          const errorMessage = error.message
          alert(errorMessage)
          // ..
        })
    }
  }
  return (
    <>
      <main>
        <div className="create-main w-full flex justify-center flex-col items-center">
          <div className="create-form w-full max-w-md flex justify-center flex-col items-center">
            <div>
              <div>
                <img
                  src="images\Chat_BOX-removebg.png"
                  alt=""
                  className="logo"
                  width="500px"
                  margin-top="50px"
                />
              </div>
            </div>
            <div className="create-account-box">
              <div className="title">Login</div>
              <div className="inputs">
                <div className="enter-email">
                  <div className="email">Email</div>
                  <input
                    type="text"
                    name=""
                    id="input1"
                    placeholder="abc@gmail.com"
                    className="email-input"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="password-box">
                  <div className="password">
                    <div>Password</div>
                    <div
                      style={{ cursor: 'pointer' }}
                      className="password"
                      onClick={handleForgotPassword}
                    >
                      Forgot?
                    </div>
                  </div>
                  <div className="enter-password">
                    <input
                      type="password"
                      name=""
                      id="input2"
                      placeholder="........"
                      className="password-input"
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="signup-buttons">
                <button
                  className="create-button"
                  onClick={() => {
                    signInWithEmailAndPassword(auth, email, password).then(
                      () => {
                        navigate('/')
                      },
                    )
                  }}
                >
                  Login
                </button>
              </div>
              <div className="footer">
                Didn't Have An Account? <a href="/auth">Create Account </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Login
