import PropTypes from "prop-types";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-10 items-center">
        
        <div className="hidden lg:block">
          <div className="card p-8">
            <h1 className="text-3xl font-semibold tracking-tight">Smart Helpdesk</h1>
            <p className="mt-3 text-slate-600">Agentic triage.</p>
          </div>
        </div>
        
        <div className="card p-8">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};