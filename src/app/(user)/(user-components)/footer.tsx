import { Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Footer Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-gray-700 pb-6">
                    <div>
                        <h3 className="font-semibold mb-2">About</h3>
                        <ul className="space-y-1 text-gray-400 text-sm">
                            <li><Link href="/about-us" className="hover:text-white">About us</Link></li>
                            <li><Link href="/why-choose-us" className="hover:text-white">Why Choose Us</Link></li>
                            <li><Link href="/contact-us" className="hover:text-white">Contact us</Link></li>
                            <li><Link href="/our-partners" className="hover:text-white">Our Partners</Link></li>
                            <li><Link href="/testimonials" className="hover:text-white">Reviews</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Discovery Eduverse</h3>
                        <ul className="space-y-1 text-gray-400 text-sm">
                            <li><Link href="/faq" className="hover:text-white">Help & FAQ</Link></li>
                            <li><Link href="/university-registration" className="hover:text-white">Teach on Eduverse</Link></li>
                            <li><Link href="/why-choose-us" className="hover:text-white">Plans and Pricing</Link></li>
                            <li><Link href="/our-partners" className="hover:text-white">Partner Network</Link></li>
                            <li><Link href="/contact-us" className="hover:text-white">Help and Support</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Eduverse for Business</h3>
                        <ul className="space-y-1 text-gray-400 text-sm">
                            <li><Link href="/course-provider-registration" className="hover:text-white">Eduverse Business</Link></li>
                            <li><Link href="/university-registration" className="hover:text-white">For Universities</Link></li>
                            <li><Link href="/our-partners" className="hover:text-white">Our Partners</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Legal & Accessibility</h3>
                        <ul className="space-y-1 text-gray-400 text-sm">
                            <li><Link href="/faq" className="hover:text-white">Accessibility</Link></li>
                            <li><a href="#" className="hover:text-white">Privacy policy</a></li>
                            <li><a href="#" className="hover:text-white">Sitemap</a></li>
                            <li><a href="#" className="hover:text-white">Terms</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-gray-400 text-sm">
                    {/* Logo & Copyright */}
                    <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold">
                            <span className="text-white">E</span>
                            <span className="text-purple-600">duverse</span>
                        </h1>
                        <span>© {new Date().getFullYear()} Eduverse, Inc.</span>
                    </div>

                    {/* Cookie Settings & Language Selector */}
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Cookie settings</a>
                        <button className="flex items-center space-x-1 hover:text-white">
                            <Globe size={18} />
                            <span>English</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
