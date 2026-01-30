import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar role="user" />
      <main className="min-h-screen px-6 py-8">{children}</main>
      <Footer />
    </>
  );
}
