import { PropsWithChildren } from 'react'

const Container = ({ children }: PropsWithChildren) => {
  return <div className="container mx-auto max-w-4xl p-4 md:p-8">{children}</div>
}

export default Container
