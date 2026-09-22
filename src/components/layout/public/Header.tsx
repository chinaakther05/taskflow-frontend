import Link from "next/link";

export default function Header() {

const routes = [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about-us' },
    { name: 'Contact', url: '/contact' },
]

    return (
        <header className="w-full h-16 border border-b justify-center items-center flex">
           
            <nav className ="flex  gap-5">
                { routes.map((route) => (
                 <Link key={route.url} href={route.url}>
                   {route.name}
                 </Link>
                 ))}
            </nav>
     
    </header>
 );
};