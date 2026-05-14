import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import { login } from "../../api/auth.api";
import { setSession } from "../../auth/session";

function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);

      // res: { ok:true, user:{ id, role, clientId? } }
      setSession({
        userId: res.user.id,
        role: res.user.role,
        clientId: res.user.clientId || null,
        email: res.user.email,
      });

      if (res.user.role === "coach") nav("/coach/dashboard");
      else nav("/client/dashboard");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

return (
  <div className="authPage">
    <div className="authWrap">
      <PageHeader
        breadcrumb="Auth / Login"
        title="Login"
        subtitle="Access your dashboard"
      />

      <div className="card authCard">
        <form onSubmit={handleSubmit}>
          <label className="fieldLabel">Email</label>
          <input
            className="editInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@test.com"
          />

          <div className="vSpace" />

          <label className="fieldLabel">Password</label>
          <input
            className="editInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••"
          />

          <div className="vSpaceLg" />

          <button className="primaryBtn btnBlock" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="authFooter">
            No account? <Link to="/signup">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  </div>
);
}

export default Login;
