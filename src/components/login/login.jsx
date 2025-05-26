import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function generateCaptcha(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function LoginPage() {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Set captcha baru tiap kali komponen mount (reload halaman login)
  useEffect(() => {
    setCaptcha(generateCaptcha());
    setInputCaptcha("");
    setError("");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const validUsername = "azzatulnabila";
    const validPassword = "azznab123";

    if (username !== validUsername || password !== validPassword) {
      setError("Username atau password salah.");
      return;
    }

    if (inputCaptcha.toUpperCase() !== captcha) {
      setError("Captcha tidak sesuai.");
      return;
    }

    navigate("/revenue");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400">
      <div className="bg-white p-10 rounded-lg shadow-md w-[500px] h-[500px] slide-in">
        <h1 className="text-7xl font-bold text-center text-indigo-900">RLEGS4</h1>
        <p className="text-center text-sm text-gray-500 mb-6">DASHBOARD RLEG SERVICE REGIONAL IV</p>
        <h2 className="text-xl font-semibold text-center mb-4">LOGIN PAGE</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="Username/NIK"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-mono text-lg select-none">
              {captcha}
            </div>
            <input
              type="text"
              placeholder="Captcha"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value.toUpperCase())}
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}
