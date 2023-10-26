const Input = ({ ...props }) => {
  return (
    <div className="w-full">
      <p className="font-poppins text-lg w-full mb-3 space-x-1">
        {props.mandatory && <span className="text-red-800">*</span>}
        <span className="text-gray-500">{props.placeholder}</span>
      </p>
      <input
        {...(props.register
          ? props.register(props.name, { required: props.required })
          : {})}
        autoComplete="off"
        className="w-full mt-0 bg-transparent text-xl text-white focus:ring-0 focus:border-cask-chain rounded-lg "
        {...props}
      />
      {props.error && (
        <p className="text-red-800 text-sm mt-1">{props.error}</p>
      )}
    </div>
  );
};

export default Input;
