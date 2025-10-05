export default function Footer() {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-16 text-center text-gray-600 text-sm">
        <p>
          © {new Date().getFullYear()} Littlestown Area Senior Center. All rights
          reserved.
        </p>
        <p className="mt-1">
          10 Locust Street, Littlestown, PA 17340 · (717) 359-7743
        </p>
      </footer>
    );
  }
  