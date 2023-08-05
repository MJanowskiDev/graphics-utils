import { OperationType } from '../types';

interface OperationTypeSelectProps {
  selectedOperation: OperationType;
  setSelectedOperation: (operation: OperationType) => void;
}

export const OperationTypeSelect = ({
  setSelectedOperation,
  selectedOperation,
}: OperationTypeSelectProps) => {
  const handleOperationSelectedChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedOperation(event.target.value as OperationType);
  };
  return (
    <div className="w-64 px-10">
      <label
        className="block uppercase tracking-wide text-xs font-bold mb-2"
        htmlFor="operation"
      >
        Operation Type
      </label>
      <div className="relative">
        <select
          id="operation"
          value={selectedOperation}
          onChange={handleOperationSelectedChange}
          className="block appearance-none w-full bg-transparent rounded-lg border border-gray-200 text-gray-300 py-3 px-4 pr-8 leading-tight focus:outline-none  focus:border-gray-500"
        >
          {Object.values(OperationType).map((operation) => (
            <option key={operation} value={operation}>
              {operation}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 12l-6-6h12l-6 6z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
