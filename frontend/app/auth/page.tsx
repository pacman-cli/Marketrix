"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { login, register, setToken } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "FOUNDER",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res =
        mode === "login"
          ? await login(form.email, form.password)
          : await register(form.email, form.password, form.fullName, form.role);

      setToken(res.accessToken);
      localStorage.setItem("marketrix_user", JSON.stringify(res.user));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-base)" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--ink)]">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {mode === "login"
              ? "Sign in to access your research dashboard"
              : "Join Marketrix as a founder or analyst"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-[var(--line)] bg-[var(--bg-surface)] p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
              mode === "login"
                ? "bg-[var(--bg-elevated)] text-[var(--ink)] shadow-sm"
                : "text-[var(--ink-muted)] hover:text-[var(--ink-soft)]"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
              mode === "register"
                ? "bg-[var(--bg-elevated)] text-[var(--ink)] shadow-sm"
                : "text-[var(--ink-muted)] hover:text-[var(--ink-soft)]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--line)] bg-[var(--bg-raised)] p-6">
          <div className="grid gap-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1.5">Full name</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="Your full name"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1.5">I am a</label>
                  <div className="flex gap-2">
                    {["FOUNDER", "ANALYST"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => update("role", role)}
                        className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                          form.role === role
                            ? "border-[var(--emerald-border)] bg-[var(--emerald-surface)] text-[var(--emerald)]"
                            : "border-[var(--line)] text-[var(--ink-muted)] hover:border-[var(--line-medium)]"
                        }`}
                      >
                        {role === "FOUNDER" ? "Founder" : "Analyst"}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ink-soft)] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min 8 characters"
                  className="input-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full justify-center"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                {mode === "login" ? "Sign in" : "Create account"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--ink-muted)]">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-medium text-[var(--emerald)] hover:underline"
          >
            {mode === "login" ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
