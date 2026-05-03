export default function Footer() {
  return (
    <footer className="bg-[#F7F4ED]">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-neutral-500 flex flex-wrap justify-center gap-6">
        <a className="hover:text-black transition cursor-pointer">About</a>
        <a className="hover:text-black transition cursor-pointer">Blog</a>
        <a className="hover:text-black transition cursor-pointer">Privacy</a>
        <a className="hover:text-black transition cursor-pointer">Rules</a>
        <a className="hover:text-black transition cursor-pointer">Terms</a>
      </div>
    </footer>
  );
}
