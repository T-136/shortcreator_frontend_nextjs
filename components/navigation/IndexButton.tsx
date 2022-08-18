import type { NextPage } from 'next'
import Router, { useRouter } from 'next/router'

export function IndexButton() {

    const router = useRouter();

    function return_to_index() {
        Router.push("/")
    }

    return(
        <button className='btn btn-info btn-wide' onClick={return_to_index}>Index</button>
    )
}
