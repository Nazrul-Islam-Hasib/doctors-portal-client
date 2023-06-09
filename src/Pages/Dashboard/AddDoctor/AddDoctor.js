import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Loading from '../../Shared/Loading/Loading';

const AddDoctor = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const imageHostKey = process.env.REACT_APP_imgbb_key;
    const navigate = useNavigate();
    const { data: specialties, isLoading } = useQuery({
        queryKey: ['speacialty'],
        queryFn: async () => {
            const res = await fetch('https://doctors-portal-server-ivory-xi.vercel.app/appointmentSpecialty');
            const data = res.json();
            return data;
        }
    })

    if(isLoading){
        return <Loading></Loading>
    }
    const handleAddDoctor = data => {
        const image = data.image[0];
        const formData = new FormData();
        formData.append('image',image);
        const url = `https://api.imgbb.com/1/upload?&key=${imageHostKey}`;
        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(imgData => {
            if(imgData.success){
                const doctor = {
                    name: data.name,
                    email: data.email,
                    specialty: data.specialty,
                    image: imgData.data.url
                }

                fetch('https://doctors-portal-server-ivory-xi.vercel.app/doctors', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify(doctor)
                })
                .then(res => res.json())
                .then(result =>{
                    toast.success(`${data.name} is added successfully!`);
                    navigate('/dashboard/managedoctors');
                })
            }
        })
    }
    return (
        <div className='w-96 p-7'>
            <h2 className="text-4xl">Add A Doctor</h2>
            <form onSubmit={handleSubmit(handleAddDoctor)}>

                <div className="form-control w-full max-w-xs">
                    <label className="label"> <span className="label-text">Name</span></label>
                    <input type="text"
                        {...register("name", { required: "Name is required" })}
                        className="input input-bordered w-full max-w-xs" />
                    {errors.name && <p role="alert" className='text-red-600'>{errors.name?.message}</p>}

                    <label className="label"> <span className="label-text">Email</span></label>
                    <input type="email"
                        {...register("email", { required: "Email Address is required" })}
                        className="input input-bordered w-full max-w-xs" />
                    {errors.email && <p role="alert" className='text-red-600'>{errors.email?.message}</p>}

                    <label className="label"> <span className="label-text">Specialty</span></label>
                    <select 
                    {...register('specialty')}
                    className="select select-bordered w-full max-w-xs">
                        {
                            specialties?.map(specialty => 
                            <option key={specialty._id} value={specialty.name}>{specialty.name}</option>)
                        }
                    </select>

                    <label className="label"> <span className="label-text">Photo</span></label>
                    <input type="file"
                        {...register("image", { required: "Photo is required" })}
                        className="input input-bordered w-full max-w-xs" />
                    {errors.image && <p role="alert" className='text-red-600'>{errors.image?.message}</p>}
                </div>
                <input className='btn btn-accent w-full mt-4' value="Add Doctor" type="submit" />
            </form>
        </div>
    );
};

export default AddDoctor;