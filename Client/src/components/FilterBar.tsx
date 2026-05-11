import { Filter } from 'lucide-react'
import React from 'react'

function filterBar() {
  return (
    <div className='w-full flex flex-wrap items-center justify-between'>
        {/* filters */}
        <div>
                {/* <FilterButton/> */}
                <button
                 className='bg-black text-white px-4 py-2 rounded-md flex items-center font-mono text-md font-semibold'
                 >
                  <Filter className='inline mr-2'/>
                  All Filters
                </button>

                {/* input search  */}
                

                {/* min price */}
                
                

                {/* max price */}

                {/* bedrooms */}

                {/* bathrooms */}

                {/* property type */}



        </div>

        {/*  view toggle */}
        <div>

        </div>
    </div>
  )
}

export default filterBar