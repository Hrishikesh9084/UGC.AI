import { Link } from "react-router-dom";

export const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-black text-gray-100">
            {/* Header */}
            <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12 border-b border-gray-800">
                <Link to="/" className="text-indigo-500 hover:text-indigo-400 text-sm mb-4 inline-block">
                    ← Back to Home
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mt-4">Privacy Policy</h1>
                <p className="text-gray-400 mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Content */}
            <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Introduction */}
                    <section>
                        <p className="text-gray-300 leading-relaxed">
                            Genify.AI ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                        </p>
                    </section>

                    {/* 1. Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-indigo-400 mb-2">Personal Information</h3>
                                <p className="text-gray-300">
                                    We may collect personal information that you voluntarily provide, including but not limited to:
                                </p>
                                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                                    <li>Name and email address</li>
                                    <li>Account credentials and password</li>
                                    <li>Profile information (optional)</li>
                                    <li>Payment and billing information</li>
                                    <li>Contact information and communication preferences</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-indigo-400 mb-2">User Content</h3>
                                <p className="text-gray-300">
                                    When you use our services, you may upload images, videos, or other media content ("User Content"). We collect and store this content to provide you with our services.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-indigo-400 mb-2">Automatically Collected Information</h3>
                                <p className="text-gray-300">
                                    When you access our platform, we automatically collect:
                                </p>
                                <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                                    <li>IP address and device information</li>
                                    <li>Browser type and version</li>
                                    <li>Pages visited and time spent on site</li>
                                    <li>Referring URLs and click-through data</li>
                                    <li>Cookies and similar tracking technologies</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 2. How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-300 mb-3">We use the collected information for various purposes:</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>To provide, maintain, and improve our services</li>
                            <li>To process transactions and send related information</li>
                            <li>To send promotional communications (with your consent)</li>
                            <li>To respond to inquiries and provide customer support</li>
                            <li>To monitor and analyze usage trends and service performance</li>
                            <li>To detect, prevent, and address fraud and technical issues</li>
                            <li>To comply with legal obligations</li>
                            <li>To personalize your experience and deliver relevant content</li>
                        </ul>
                    </section>

                    {/* 3. How We Share Your Information */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. How We Share Your Information</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-indigo-400 mb-2">Service Providers</h3>
                                <p className="text-gray-300">
                                    We may share your information with third-party service providers who assist us in operating our website and conducting our business, including payment processors, hosting providers, and analytics services.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-indigo-400 mb-2">Legal Requirements</h3>
                                <p className="text-gray-300">
                                    We may disclose your information when required by law or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-indigo-400 mb-2">Business Transfers</h3>
                                <p className="text-gray-300">
                                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Data Security */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                        <p className="text-gray-300">
                            We implement appropriate technical and organizational measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* 5. Your Privacy Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Your Privacy Rights</h2>
                        <p className="text-gray-300 mb-3">Depending on your location, you may have certain rights regarding your personal information:</p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>Right to access: Request a copy of your personal data</li>
                            <li>Right to rectification: Correct inaccurate or incomplete information</li>
                            <li>Right to erasure: Request deletion of your data (right to be forgotten)</li>
                            <li>Right to restrict processing: Limit how we use your information</li>
                            <li>Right to data portability: Receive your data in a portable format</li>
                            <li>Right to object: Opt-out of certain data processing activities</li>
                            <li>Right to withdraw consent: Withdraw previously given consent</li>
                        </ul>
                        <p className="text-gray-300 mt-4">
                            To exercise any of these rights, please contact us at privacy@genify.ai.
                        </p>
                    </section>

                    {/* 6. Cookies and Tracking */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
                        <p className="text-gray-300 mb-3">
                            We use cookies and similar tracking technologies to enhance your experience on our platform. These may include:
                        </p>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li><strong>Essential Cookies:</strong> Necessary for site functionality</li>
                            <li><strong>Performance Cookies:</strong> Used to analyze site usage</li>
                            <li><strong>Functional Cookies:</strong> Remember your preferences</li>
                            <li><strong>Marketing Cookies:</strong> Track your interests for targeted ads</li>
                        </ul>
                        <p className="text-gray-300 mt-4">
                            You can control cookie preferences through your browser settings. Please note that disabling certain cookies may impact site functionality.
                        </p>
                    </section>

                    {/* 7. Third-Party Links */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
                        <p className="text-gray-300">
                            Our website may contain links to third-party websites and services that are not operated by us. This Privacy Policy applies only to our platform, and we are not responsible for the privacy practices of third-party sites. We encourage you to review the privacy policies of any third-party services before providing your information.
                        </p>
                    </section>

                    {/* 8. Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                        <p className="text-gray-300">
                            Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will promptly delete the information. Parents or guardians who believe their child has provided information to us should contact us immediately.
                        </p>
                    </section>

                    {/* 9. Retention */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
                        <p className="text-gray-300">
                            We retain your personal information for as long as your account is active or as needed to provide our services. You can request deletion of your account and associated data at any time, subject to certain legal obligations to retain data.
                        </p>
                    </section>

                    {/* 10. International Transfers */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
                        <p className="text-gray-300">
                            Your information may be transferred to, stored in, and processed in countries other than your country of residence. These countries may have data protection laws that differ from your home country. By using our services, you consent to the transfer of your information to countries outside your country of residence.
                        </p>
                    </section>

                    {/* 11. Updates to Privacy Policy */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">11. Updates to This Privacy Policy</h2>
                        <p className="text-gray-300">
                            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by updating the "Last updated" date and posting the revised policy on our website. Your continued use of our services following the posting of changes constitutes your acceptance of such changes.
                        </p>
                    </section>

                    {/* 12. Contact Us */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                        <p className="text-gray-300 mb-4">
                            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                        </p>
                        <div className="bg-gray-900 p-6 rounded border border-gray-800">
                            <p className="text-gray-300 mb-2"><strong>Email:</strong> privacy@genify.ai</p>
                            <p className="text-gray-300 mb-2"><strong>Support:</strong> support@genify.ai</p>
                            <p className="text-gray-300"><strong>Address:</strong> Genify.AI, Inc.</p>
                        </div>
                    </section>

                    {/* Closing */}
                    <section className="pt-6 border-t border-gray-800">
                        <p className="text-gray-400 text-sm">
                            This Privacy Policy is designed to be transparent and user-friendly. We remain committed to protecting your privacy and maintaining your trust.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
