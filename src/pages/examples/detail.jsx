/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// project-imports
import MainCard from 'components/MainCard';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Loader from 'components/Loader';


export default function Detail() {
    const params = useParams();

    let breadcrumbLinks = [
        { title: 'Detail', to: '/examples/list' }
    ];
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();


    useEffect(() => {
        setData(params)
        setLoading(false)
    }, [])

    if (loading) return (<Loader open={loading} />)

    return (
        <>
            <Breadcrumbs custom links={breadcrumbLinks} />
            <MainCard title="Detail Page">
                detail - id : {data.id}
            </MainCard>
        </>
    );
}
