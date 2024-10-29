import React, { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/SignIn.css";
import animatedLogin from "../../assets/video/Login-Animation.gif";
import background from "../../assets/img/Background-Login.png";

interface PasswordValid {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  symbol: boolean;
}

interface State {
  email: string;
  password: string;
  passwordValid: PasswordValid;
}

const initialState: State = {
  email: "",
  password: "",
  passwordValid: {
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
  },
};

type Action =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
        passwordValid: {
          length: action.payload.length >= 8,
          uppercase: /[A-Z]/.test(action.payload),
          lowercase: /[a-z]/.test(action.payload),
          symbol: /[!@#$%^&*]/.test(action.payload),
        },
      };
    default:
      return state;
  }
};

const SignIn: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password, passwordValid } = state;

    if (!email || !password) {
      toast.warn("Please fill in all fields", { position: "top-right" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
      });
      return;
    }

    const cookieEmail = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userEmail="))
      ?.split("=")[1];

    const cookiePassword = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userPassword="))
      ?.split("=")[1];

    if (cookieEmail === email && cookiePassword === password) {
      toast.success("Successfully signed in!", { position: "top-right" });
      navigate("/customer");
    } else {
      toast.error("Invalid credentials. Please try again.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="authenticate_sign_in">
      <div className="login_and_register_section">
        <div>
          <h3>Sign in</h3>
          <img src={animatedLogin} alt="animate" />
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="example@gmail.com"
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: "SET_EMAIL", payload: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                }
                required
              />
              <div className="password_requirements">
                <p
                  style={{
                    color: state.passwordValid.length ? "green" : "red",
                  }}
                >
                  • At least 8 characters
                </p>
                <p
                  style={{
                    color: state.passwordValid.uppercase ? "green" : "red",
                  }}
                >
                  • Contains an uppercase letter
                </p>
                <p
                  style={{
                    color: state.passwordValid.lowercase ? "green" : "red",
                  }}
                >
                  • Contains a lowercase letter
                </p>
                <p
                  style={{
                    color: state.passwordValid.symbol ? "green" : "red",
                  }}
                >
                  • Contains a special symbol (!@#$%^&*)
                </p>
              </div>
            </div>
            <button
              type="submit"
              disabled={
                !(
                  state.passwordValid.length &&
                  state.passwordValid.uppercase &&
                  state.passwordValid.lowercase &&
                  state.passwordValid.symbol
                )
              }
            >
              Sign in
            </button>
          </form>
          <p>
            You don't have an account? Please <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
      <div className="signup_bg">
        <img src={background} alt="bg" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
