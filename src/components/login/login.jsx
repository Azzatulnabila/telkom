import { useState } from "react";

export default function LoginPage() {
  const [captcha, setCaptcha] = useState("3A226");
  const [inputCaptcha, setInputCaptcha] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-400">
      <div className="bg-white p-10 rounded-lg shadow-md w-[500px] h-[500px] slide-in">
        <h1 className="text-7xl font-bold text-center text-indigo-900">RLEGS4</h1>
        <p className="text-center text-sm text-gray-500 mb-6">DASHBOARD RLEG SERVICE REGIONAL IV</p>
        <h2 className="text-xl font-semibold text-center mb-4">LOGIN PAGE</h2>
        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username/NIK"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-mono text-lg">{captcha}</div>
            <input
              type="text"
              placeholder="Captcha"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
            />
          </div>
          <button className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700">SIGN IN</button>
        </form>
      </div>
    </div>
  );
}
