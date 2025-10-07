export default async function AuthenticationLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {

    return <main>{children}</main>
}