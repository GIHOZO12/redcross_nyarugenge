import React from 'react'
import { Activities } from '../Felloweship/Activities'

const Humanity = () => {
  return (
    <div>
        <h1 className='text-center text-xl font-bold p-2'>Humanity and Family activities</h1>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-2 p-2'>
            {Activities.map((item,index)=>(
                <div key={index} className='bg-white p-2 rounded shadow border'>
                <img src={item.image} alt='image not found'/>
                <div>
                    <h2 className='text-lg font-semibold'>{item.title}</h2>
                    <p className='text-gray-600'>{item.description}</p>
                </div>
                </div>
            ))}

        </div>
    </div>
  )
}

export default Humanity