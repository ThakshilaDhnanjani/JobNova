import { useEffect, useState } from 'react';

const SalaryRangeSlider = ({ filters = {}, handleFilterChange = () => {} }) => {
  const [minSalary, setMinSalary] = useState(filters.minSalary ?? '');
  const [maxSalary, setMaxSalary] = useState(filters.maxSalary ?? '');

  useEffect(() => {
    setMinSalary(filters.minSalary ?? '');
    setMaxSalary(filters.maxSalary ?? '');
  }, [filters.minSalary, filters.maxSalary]);

  const updateMinSalary = (value) => {
    setMinSalary(value);
    handleFilterChange('minSalary', value !== '' ? parseInt(value, 10) : '');
  };

  const updateMaxSalary = (value) => {
    setMaxSalary(value);
    handleFilterChange('maxSalary', value !== '' ? parseInt(value, 10) : '');
  };

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Minimum Salary
          </label>

          <input
            type='number'
            placeholder='0'
            min='0'
            step='1000'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 '
            value={minSalary}
            onChange={({ target }) => updateMinSalary(target.value)}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Maximum Salary
          </label>

          <input
            type='number'
            placeholder='No Limit'
            min='0'
            step='1000'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 '
            value={maxSalary}
            onChange={({ target }) => updateMaxSalary(target.value)}
          />
        </div>
      </div>

      {(minSalary !== '' || maxSalary !== '') ? (
        <div className='text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded '>
          Salary Range: {minSalary ? `$${Number(minSalary).toLocaleString()}` : '0'} - {maxSalary ? `$${Number(maxSalary).toLocaleString()}` : 'No Limit'}
        </div>
      ) : null}
    </div>
  );
};

export default SalaryRangeSlider;
