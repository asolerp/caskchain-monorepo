import { XMarkIcon } from "@heroicons/react/24/outline";

type ChipProps = {
  label: string;
  color: string;
  onClick?: () => void;
};

const Chip: React.FC<ChipProps> = ({ label, color = "gray100", onClick }) => {
  const mapColor: any = {
    gray100: {
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
    gray200: {
      bgColor: "bg-gray-200",
      textColor: "text-gray-800",
    },
    caskChain: {
      bgColor: "bg-cask-chain",
      textColor: "text-black",
    },
  };

  const mainColor = mapColor[color];

  return (
    <span
      id="badge-dismiss-dark"
      className={`inline-flex items-center px-2 py-1 mr-2 text-md font-popins font-medium text-gray-800 ${mainColor.bgColor} rounded `}
    >
      {label}
      <button
        onClick={onClick}
        type="button"
        className={`inline-flex items-center p-0.5 ml-2 text-sm ${mainColor.textColor} bg-transparent rounded-sm`}
        data-dismiss-target="#badge-dismiss-dark"
        aria-label="Remove"
      >
        <XMarkIcon color={mainColor.textColor} className="w-4 h-4" />
      </button>
    </span>
  );
};

export default Chip;
