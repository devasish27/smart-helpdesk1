import PropTypes from "prop-types";

export default function TextInput({ label, error, ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input className="input mt-1" {...props} />
      {error && <p className="error">{error}</p>}
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  // allow any other props (like type, placeholder, etc.)
};
