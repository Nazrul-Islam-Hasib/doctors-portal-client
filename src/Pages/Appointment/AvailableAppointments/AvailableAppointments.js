import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useState } from 'react';
import Loading from '../../Shared/Loading/Loading';
import BookingModal from '../BookingModal/BookingModal';
import AppointmentOptions from './AppointmentOptions';

const AvailableAppointments = ({selectedDate, setSelectedDate}) => {
    const [treatment, setTreatment] = useState(null);
    const date = format(selectedDate, 'PP');
    const {data:appointmentOptions=[], refetch, isLoading} =useQuery({
        queryKey: ['appointmentOptions', date],
        queryFn: async()=>{
            const res = await fetch(`https://doctors-portal-server-ivory-xi.vercel.app/v2/appointmentOptions?date=${date}`);
            const data = await res.json();
            return data;
        }
    });
    if(isLoading){
        return <Loading></Loading>
    }
    return (
        <section className='my-16'>
            <h2 className='text-center font-bold text-secondary'>Available Services on {format(selectedDate, 'PP')}</h2>
            <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6'>
                {
                    appointmentOptions.map(option => <AppointmentOptions key={option._id} appointmentOptions={option} setTreatment={setTreatment}></AppointmentOptions>)
                }
            </div>
            {
                treatment && 
                <BookingModal 
                    treatment={treatment} 
                    selectedDate={selectedDate}
                    setTreatment={setTreatment}
                    refetch = {refetch}
                 ></BookingModal>
            }
        </section>
    );
};

export default AvailableAppointments;