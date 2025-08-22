// client/src/components/TextInput.jsx
import PropTypes from 'prop-types';

export default function TextInput({ label, error, id, name, ...props }) {
  const inputId = id || name; // fallback to name if id not provided
  return (
    <div>
      <label htmlFor={inputId} className="label">{label}</label>
      <input id={inputId} name={name} {...props} className="input mt-1" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

// PropTypes validation
TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
};