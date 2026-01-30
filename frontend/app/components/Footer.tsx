export default function Footer() {
  return (
    <footer className="bg-black text-white text-center py-6 mt-10">
  <p>© 2025 Service Shop</p>
  <div className="flex justify-center gap-6 mt-2 text-sm">
    <a href="https://facebook.com" className="text-blue-600 hover:underline">Facebook</a>
    <a href="https://instagram.com" className="text-pink-600 hover:underline">Instagram</a>
    <span>📞 +91 98765 43210</span>
  </div>
</footer>
  );
}