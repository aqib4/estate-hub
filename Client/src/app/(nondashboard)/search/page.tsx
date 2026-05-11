'use client';
import { useAppSelector } from '@/state/redux';
import {  useSearchParams } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux';
import FilterBar from '@/components/FilterBar';
import { NAVBAR_HEIGHT } from '@/lib/constants';

function Search() {

    const searchParams = useSearchParams();
    const dispatch=useDispatch();
    const isFilterFullOpen = useAppSelector(
        (state)=> state.global.isFilterFullOpen
    )


  return (
      <div className='w-full mx-auto px-5 flex flex-col'
      style={
        {
            height:`calc(100vh - ${NAVBAR_HEIGHT}px)`,
            marginTop:`${NAVBAR_HEIGHT}px`
        }
      }
      >
        {/* filter bar */}
        <FilterBar/>
        <div className='w-full flex '>
            {/* sidebar filters  */}
            <div>
                {/* <SidebarFilter/> */}
            </div>
            
            {/* <map/> */}
            
            {/* listings */}
            <div>
                {/* <listings/> */}
            </div>

        </div>
      </div>
  )
}

export default Search