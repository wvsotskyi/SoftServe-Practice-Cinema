import { Link } from "react-router-dom";
import { LuLogIn } from "react-icons/lu";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function Register() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register(formData.email, formData.password, formData.name);
      // On successful registration, the auth context will handle the user state
      // You might want to redirect here or the context could handle it
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex items-start justify-center px-6 sm:px-8 pt-10">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md sm:max-w-lg md:w-3/5 2xl:w-2/5 flex flex-col gap-6 p-8 sm:p-12 bg-[#1C1B20] rounded-lg border border-[#A9A9A9]"
      >
        <img
          src="/images/logo2.png"
          alt="logo"
          className="w-full h-14 object-contain mb-4"
        />

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="w-full">
          <label htmlFor="name" className="text-white text-sm">
            Ім'я
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-transparent border border-[#A9A9A9] text-white rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="w-full">
          <label htmlFor="email" className="text-white text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-transparent border border-[#A9A9A9] text-white rounded-lg focus:outline-none"
            required
          />
        </div>

        <div className="w-full mb-2">
          <label htmlFor="password" className="text-white text-sm">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-2 p-3 bg-transparent border border-[#A9A9A9] text-white rounded-lg focus:outline-none"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#FF6347] hover:bg-[#FF4500] text-white p-4 rounded-lg w-full flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span>Обробка...</span>
          ) : (
            <>
              <LuLogIn className="w-5 h-5" />
              <span>Реєстрація</span>
            </>
          )}
        </button>

        <p className="text-center text-[#CCCCCC] mt-2 text-sm">
          Вже є аккаунт?
          <Link className="text-[#A9A9A9] font-semibold ml-2" to="/login">
            Увійти
          </Link>
        </p>
      </form>
    </div>
  );
}