import { Navbar } from '../../src/components/public/Navbar';
import { Footer } from '../../src/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Add padding-top to account for fixed navbar */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
