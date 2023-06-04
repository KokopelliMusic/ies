import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react'
import { getAccessToken } from '../utils/spotify'

export async function getServerSideProps() {
  const token = await getAccessToken()

  if (token) {
    return {
      redirect: {
        destination: '/game',
        permanent: false
      }
    }
  }

  return {
    redirect: {
      destination: '/spotify',
      permanent: false
    }
  }
}

export default function Home() {
  return (
    <div className={styles.container}>
    </div>
  )
}
