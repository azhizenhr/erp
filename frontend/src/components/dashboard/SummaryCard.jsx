import React from 'react'

const SummaryCard = ({icon, text, number, color}) => {
  return (
    <div className='rounded flex bg-white w-full max-w-xs'>
        <div className={`text-2xl md:text-3xl flex justify-center items-center ${color} text-white px-3 md:px-4`}>
            {icon}
        </div>
        <div className='pl-3 md:pl-4 py-2 flex-1 overflow-hidden'>
            <p className='text-base md:text-lg font-semibold truncate'>{text}</p>
            <p className='text-lg md:text-xl font-bold truncate'>{number}</p>
        </div>
    </div>
  )
}

export default SummaryCard