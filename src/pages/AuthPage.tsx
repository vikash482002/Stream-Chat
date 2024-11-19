import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import {
  useSignInWithEmailLink,
  useSignInWithGoogle,
} from 'react-firebase-hooks/auth'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../libs/firebase'

export function AuthPage() {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth)
  const [useSignInWithEmail] = useSignInWithEmailLink(auth)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  return (
    <main>
      <div className="create-main w-full flex justify-center flex-col items-center">
        <div className="create-form w-full max-w-md flex justify-center flex-col items-center">
          {/* <div>
            <img
              src="images\Chat_BOX-removebg.png"
              alt=""
              className="logo"
              width="500px"
              margin-top="50px"
            />
          </div> */}
          <div className="create-account-box">
            <div className="title">Create an Account</div>
            <div className="inputs">
              <div>
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
            </div>
            <div className="signup-buttons w-full flex justify-center flex-col items-center">
              <button
                className="create-button"
                onClick={async () => {
                  createUserWithEmailAndPassword(auth, email, password)
                    .then(async (userCred) => {
                      const user = userCred.user

                      if (user) {
                        setDoc(doc(db, 'users', user.uid), {
                          email: user.email,
                          displayName: user.displayName,
                          photoURL: user.photoURL,
                        }).then(() => {
                          navigate('/')
                        })
                      }

                      if (!user.emailVerified) {
                        await sendEmailVerification(user).then(() => {
                          alert('Check your inbox to verify account.')
                        })
                      }

                      //alert("account created succesfully");
                      setEmail('')
                      setPassword('')
                      navigate('/')
                    })
                    .catch((error) => {
                      const errorMessage = error.message
                      alert(errorMessage)
                    })
                }}
              >
                Create account
              </button>
              <button
                onClick={() =>
                  signInWithGoogle().then((user) => {
                    if (user?.user) {
                      setDoc(doc(db, 'users', user.user.uid), {
                        email: user.user.email,
                        displayName: user.user.displayName,
                        photoURL: user.user.photoURL,
                      }).then(() => {
                        navigate('/')
                      })
                    }
                  })
                }
                className="flex h-fit w-fit cursor-pointer items-center space-x-2 rounded-md border border-gray-300 bg-white px-8 py-2 font-medium shadow-md"
              >
                <div className="flex items-center space-x-2 ">
                  <FcGoogle className="text-2xl" />
                  <span className="font-inter text-base font-medium text-gray-800 ">
                    Sign in with Google
                  </span>
                </div>
              </button>
            </div>
            <div className="footer">
              Already Have An Account? <a href="/login"> Login</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

