import { useState } from "react";
import { auth, signInWithEmailAndPassword } from "../../firebaseConfig.js";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(e);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const idToken = userCredential.user.getIdToken();
        return idToken;
      })
      .then((idToken) => {
        fetch("http://localhost:4000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 3);
            localStorage.setItem(
              "userData",
              JSON.stringify({
                token: idToken,
                userId: data.data.id,
                expiryDate: expiryDate,
                role: data.data.role,
              })
            );
            // console.log(data);
            window.location.href = "/";
            // navigate('/');
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6faff] rounded-xl">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
