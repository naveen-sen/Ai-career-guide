import React from 'react'

async function Page({params}) {
    const id = await params.id
  return (
    <div>Ai Cover Letter Page : {id}</div>
  )
}

export default Page