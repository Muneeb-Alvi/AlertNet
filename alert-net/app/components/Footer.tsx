export default function Footer() {
  return (
    <footer className='bg-card text-card-foreground py-8'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='text-lg font-semibold mb-4'>AlertNet</h3>
            <p className='text-muted-foreground'>
              Empowering communities with real-time incident reporting and AI-driven analytics.
            </p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#features' className='text-muted-foreground hover:text-foreground'>
                  Features
                </a>
              </li>
              <li>
                <a href='#how-it-works' className='text-muted-foreground hover:text-foreground'>
                  How It Works
                </a>
              </li>
              <li>
                <a href='#about' className='text-muted-foreground hover:text-foreground'>
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-4'>Contact Us</h3>
            <p className='text-muted-foreground'>Email: info@alertnet.com</p>
            <p className='text-muted-foreground'>Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <div className='mt-8 pt-8 border-t border-border text-center text-muted-foreground'>
          <p>&copy; {new Date().getFullYear()} AlertNet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
