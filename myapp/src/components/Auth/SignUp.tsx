import React, { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/SignUp.css";
import animatedRegister from "../../assets/video/Login-Animation.gif";
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

const SignUp: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
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

    if (
      !passwordValid.length ||
      !passwordValid.uppercase ||
      !passwordValid.lowercase ||
      !passwordValid.symbol
    ) {
      toast.error("Please fulfill all password requirements", {
        position: "top-right",
      });
      return;
    }

    document.cookie = `userEmail=${email}; path=/`;
    document.cookie = `userPassword=${password}; path=/`;

    toast.success("Successfully signed up!", { position: "top-right" });
    navigate("/");
  };

  return (
    <div className="authenticate_sign_up">
      <div className="login_and_register_section">
        <div>
          <h3>Sign Up</h3>
          <img src={animatedRegister} alt="animate" />
          <form onSubmit={handleSignUp}>
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
                onChange={(e) => {
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value });
                }}
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
              Sign Up
            </button>
          </form>
          <p>
            Already have an account? Please <Link to="/">Sign in</Link>
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

export default SignUp;
