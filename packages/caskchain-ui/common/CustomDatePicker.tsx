import Datepicker from "react-datepicker";

type Props = {
  selectedDate: any;
  onChangeDate: any;
  placeholder: string;
  error?: string;
  mandatory?: boolean;
};

const CustomDatePicker: React.FC<Props> = ({
  selectedDate,
  onChangeDate,
  ...props
}) => {
  return (
    <div className="w-full">
      <p className="font-poppins text-lg w-full mb-3 space-x-1">
        {props.mandatory && <span className="text-red-800">*</span>}
        <span className="text-gray-500">{props.placeholder}</span>
      </p>
      <Datepicker
        selected={selectedDate}
        onChange={onChangeDate}
        className="w-full bg-transparent mt-2 text-xl text-white focus:ring-0 focus:border-cask-chain rounded-lg"
        dateFormat="dd/MM/yyyy"
      />
      {props.error && (
        <p className="text-red-800 text-sm mt-1">{props.error}</p>
      )}
    </div>
  );
};

export default CustomDatePicker;
