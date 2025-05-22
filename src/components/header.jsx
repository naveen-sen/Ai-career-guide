import React from 'react'
import HeaderClient from './headerClient'

import { checkUser } from '@/lib/checkUser'

export default async function Header() {
  const user = await checkUser()

  return <HeaderClient user={user} />
}
