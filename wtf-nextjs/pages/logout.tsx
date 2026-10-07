import type { NextPage } from 'next'
import { useEffect } from 'react' 
import { useRouter } from 'next/router'
import { useLogout } from 'baseapp-nextjs-core'

const Logout: NextPage = () => {
  const router = useRouter()
  const logout = useLogout()

  useEffect(() => {
    function doLogout() {
      logout()
      router.push('/')
    }
    doLogout()
  })

  return <div />
}

export default Logout
