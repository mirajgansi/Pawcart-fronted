import LoginForm from "../_componets/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Welcome back
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Please enter your details to sign in.
        </p>
      </div>
      <LoginForm />
    </>
  );
}