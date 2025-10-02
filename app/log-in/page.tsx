import LoginForm from "@/components/forms/LoginForm";

function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-[500px] border border-[#ccc] p-4 rounded-[10px] shadow-md">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
